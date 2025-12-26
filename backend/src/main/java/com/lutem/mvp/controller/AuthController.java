package com.lutem.mvp.controller;

import com.lutem.mvp.model.User;
import com.lutem.mvp.security.JwtService;
import com.lutem.mvp.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for authentication-related endpoints.
 * Supports both Steam and Google (Firebase) authentication.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final UserService userService;
    private final JwtService jwtService;
    
    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    
    /**
     * Get current authenticated user info.
     * Works with JWT token from either Steam or Google login.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Not authenticated"));
        }
        
        return userService.findById(userId)
            .map(user -> {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("displayName", user.getDisplayName());
                response.put("email", user.getEmail());
                response.put("steamId", user.getSteamId());
                response.put("googleId", user.getGoogleId());
                response.put("avatarUrl", user.getAvatarUrl());
                response.put("authProvider", user.getAuthProvider());
                response.put("createdAt", user.getCreatedAt());
                response.put("lastLoginAt", user.getLastLoginAt());
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.status(404)
                    .body(Map.of("error", "User not found")));
    }
    
    /**
     * Google/Firebase login - exchange Firebase idToken for our JWT.
     * Note: In production, you should verify the Firebase token.
     * For now, we trust the frontend and create/find user by email.
     */
    @PostMapping("/google/login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        String email = request.get("email");
        String displayName = request.get("displayName");
        String photoURL = request.get("photoURL");
        
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Missing idToken"));
        }
        
        // TODO: In production, verify the Firebase idToken with Firebase Admin SDK
        // For now, we trust the token and use it as the googleId
        
        try {
            // Create or find user
            // Note: In a real implementation, you'd decode the Firebase token
            // to get the actual UID. For now, we use a hash of the token as ID.
            String googleId = String.valueOf(idToken.hashCode());
            
            if (email != null && !email.isBlank()) {
                // Try to find existing user by email first
                var existingUser = userService.findByEmail(email);
                if (existingUser.isPresent()) {
                    googleId = existingUser.get().getGoogleId();
                }
            }
            
            User user = userService.findOrCreateByGoogleId(
                googleId,
                email,
                displayName != null ? displayName : "Google User"
            );
            
            // Update avatar if provided
            if (photoURL != null && !photoURL.isBlank()) {
                user.setAvatarUrl(photoURL);
            }
            
            logger.info("Google login successful: {} (ID: {})", user.getDisplayName(), user.getId());
            
            // Generate JWT
            String token = jwtService.generateToken(user);
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                    "id", user.getId(),
                    "displayName", user.getDisplayName(),
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "googleId", user.getGoogleId(),
                    "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                    "authProvider", user.getAuthProvider()
                )
            ));
            
        } catch (Exception e) {
            logger.error("Google login failed", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
    
    /**
     * Logout - clear auth cookie.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("lutem_token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Delete cookie
        response.addCookie(cookie);
        
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    /**
     * DEV ONLY: Create a test user for local development.
     */
    @PostMapping("/dev/create-user")
    public ResponseEntity<?> createDevUser(@RequestBody Map<String, String> request) {
        String firebaseUid = request.get("firebaseUid");
        String steamId = request.get("steamId");
        String email = request.getOrDefault("email", "dev@test.com");
        String displayName = request.getOrDefault("displayName", "Dev User");
        
        User user;
        if (steamId != null && !steamId.isBlank()) {
            user = userService.findOrCreateBySteamId(steamId, displayName, null);
        } else if (firebaseUid != null && !firebaseUid.isBlank()) {
            user = userService.findOrCreateByGoogleId(firebaseUid, email, displayName);
        } else {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Either firebaseUid or steamId is required"));
        }
        
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "steamId", user.getSteamId(),
            "googleId", user.getGoogleId(),
            "email", user.getEmail(),
            "displayName", user.getDisplayName(),
            "authProvider", user.getAuthProvider(),
            "token", token,
            "message", "User created/updated successfully"
        ));
    }
    
    /**
     * DEV ONLY: Validate a token and return its claims.
     */
    @GetMapping("/dev/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        var claims = jwtService.validateToken(token);
        if (claims == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        
        Map<String, Object> response = new HashMap<>();
        claims.forEach((key, value) -> response.put(key, value));
        return ResponseEntity.ok(response);
    }
}
