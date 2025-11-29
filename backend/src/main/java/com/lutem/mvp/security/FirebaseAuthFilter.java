package com.lutem.mvp.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to validate Firebase ID tokens on protected endpoints.
 * Extracts user info from token and adds to request attributes.
 */
@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {
    
    private final FirebaseAuth firebaseAuth;
    
    public FirebaseAuthFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // Skip auth for non-protected paths
        String path = request.getRequestURI();
        if (!requiresAuth(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Firebase not configured - allow through (for dev/testing)
        if (firebaseAuth == null) {
            System.out.println("⚠️ Firebase Auth not configured, skipping token validation");
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Missing or invalid Authorization header\"}");
            return;
        }
        
        String idToken = authHeader.substring(7); // Remove "Bearer "
        
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
            
            // Add user info to request attributes
            request.setAttribute("firebaseUid", decodedToken.getUid());
            request.setAttribute("firebaseEmail", decodedToken.getEmail());
            request.setAttribute("firebaseDisplayName", decodedToken.getName());
            
            filterChain.doFilter(request, response);
            
        } catch (FirebaseAuthException e) {
            System.err.println("❌ Token validation failed: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
        }
    }
    
    /**
     * Determine if a path requires authentication.
     * Currently only /auth/** endpoints require a valid token.
     */
    private boolean requiresAuth(String path) {
        // Only /auth endpoints require authentication
        // Other endpoints can be called anonymously
        return path.startsWith("/auth");
    }
}
