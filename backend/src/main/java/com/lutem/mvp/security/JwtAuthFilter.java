package com.lutem.mvp.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

/**
 * Filter to validate JWT tokens on protected endpoints.
 * Checks both Authorization header and cookies.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private static final String AUTH_COOKIE_NAME = "lutem_token";
    
    private final JwtService jwtService;
    
    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) 
            throws ServletException, IOException {
        
        // Handle CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String path = request.getRequestURI();
        
        // Skip auth for public paths
        if (!requiresAuth(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Try to get token from header or cookie
        String token = extractToken(request);
        
        if (token == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Authentication required\"}");
            return;
        }
        
        Claims claims = jwtService.validateToken(token);
        
        if (claims == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }
        
        // Add user info to request attributes
        request.setAttribute("userId", claims.get("userId", Long.class));
        request.setAttribute("authProvider", claims.get("authProvider", String.class));
        request.setAttribute("steamId", claims.get("steamId", String.class));
        request.setAttribute("googleId", claims.get("googleId", String.class));
        request.setAttribute("email", claims.get("email", String.class));
        request.setAttribute("displayName", claims.get("displayName", String.class));
        request.setAttribute("avatarUrl", claims.get("avatarUrl", String.class));
        
        // Also set firebaseUid for backwards compatibility
        String googleId = claims.get("googleId", String.class);
        if (googleId != null) {
            request.setAttribute("firebaseUid", googleId);
        }
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * Extract token from Authorization header or cookie.
     */
    private String extractToken(HttpServletRequest request) {
        // Try Authorization header first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        // Fall back to cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> AUTH_COOKIE_NAME.equals(c.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }
        
        return null;
    }
    
    /**
     * Determine which paths require authentication.
     */
    private boolean requiresAuth(String path) {
        // Public paths (no auth required)
        if (path.equals("/") ||
            path.startsWith("/h2-console") ||
            path.startsWith("/auth/steam/login") ||
            path.startsWith("/auth/steam/callback") ||
            path.startsWith("/auth/google") ||
            path.startsWith("/auth/dev/") ||
            path.startsWith("/api/games") ||
            path.startsWith("/api/recommendations") ||
            path.equals("/api/steam/status")) {
            return false;
        }
        
        // Protected paths
        if (path.startsWith("/auth/me") ||
            path.startsWith("/auth/logout") ||
            path.startsWith("/api/steam/import") ||
            path.startsWith("/api/steam/library") ||
            path.startsWith("/api/library") ||
            path.startsWith("/api/sessions") ||
            path.startsWith("/api/calendar") ||
            path.startsWith("/api/friends")) {
            return true;
        }
        
        // Default: don't require auth for unspecified paths
        return false;
    }
}
