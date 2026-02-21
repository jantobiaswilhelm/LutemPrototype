package com.lutem.mvp.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.lutem.mvp.model.User;
import com.lutem.mvp.security.JwtService;
import com.lutem.mvp.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import org.springframework.core.env.Environment;

import java.util.Arrays;
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
    private final FirebaseAuth firebaseAuth;
    private final Environment environment;

    @Value("${lutem.dev-mode:false}")
    private boolean devMode;

    @Autowired
    public AuthController(UserService userService, JwtService jwtService,
                          @Autowired(required = false) FirebaseAuth firebaseAuth,
                          Environment environment) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.firebaseAuth = firebaseAuth;
        this.environment = environment;
    }

    @PostConstruct
    public void validateConfig() {
        String[] activeProfiles = environment.getActiveProfiles();
        boolean isProduction = Arrays.stream(activeProfiles)
            .anyMatch(p -> p.equalsIgnoreCase("prod") || p.equalsIgnoreCase("production"));

        if (devMode && isProduction) {
            throw new IllegalStateException(
                "FATAL: lutem.dev-mode=true is not allowed with production profile. " +
                "Set LUTEM_DEV_MODE=false or remove it from environment.");
        }

        if (devMode) {
            logger.warn("=== DEV MODE ENABLED === Dev auth endpoints are accessible. Do NOT use in production.");
        }
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
     * Verifies the Firebase token server-side before issuing our own JWT.
     */
    @PostMapping("/google/login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> request, HttpServletResponse httpResponse) {
        String idToken = request.get("idToken");
        String email = request.get("email");
        String displayName = request.get("displayName");
        String photoURL = request.get("photoURL");

        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Missing idToken"));
        }

        try {
            String googleId;
            String verifiedEmail = email;
            String verifiedName = displayName;
            String verifiedPhoto = photoURL;

            // Verify the Firebase idToken with Firebase Admin SDK
            if (firebaseAuth != null) {
                try {
                    FirebaseToken decodedToken = firebaseAuth.verifyIdToken(idToken);
                    googleId = decodedToken.getUid();
                    // Use verified data from token when available
                    if (decodedToken.getEmail() != null) {
                        verifiedEmail = decodedToken.getEmail();
                    }
                    if (decodedToken.getName() != null) {
                        verifiedName = decodedToken.getName();
                    }
                    if (decodedToken.getPicture() != null) {
                        verifiedPhoto = decodedToken.getPicture();
                    }
                    logger.info("Firebase token verified for user: {}", googleId);
                } catch (FirebaseAuthException e) {
                    logger.error("Firebase token verification failed: {}", e.getMessage());
                    return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid Firebase token", "details", e.getMessage()));
                }
            } else {
                // Firebase not configured - only allow in dev mode
                if (!devMode) {
                    logger.error("Firebase authentication not configured and not in dev mode");
                    return ResponseEntity.status(503)
                        .body(Map.of("error", "Authentication service unavailable"));
                }
                logger.warn("Firebase not configured - using fallback auth (DEV MODE ONLY)");
                googleId = String.valueOf(idToken.hashCode());
            }

            // Try to find existing user by email first
            if (verifiedEmail != null && !verifiedEmail.isBlank()) {
                var existingUser = userService.findByEmail(verifiedEmail);
                if (existingUser.isPresent() && existingUser.get().getGoogleId() != null) {
                    googleId = existingUser.get().getGoogleId();
                }
            }

            User user = userService.findOrCreateByGoogleId(
                googleId,
                verifiedEmail,
                verifiedName != null ? verifiedName : "Google User"
            );

            // Update avatar if provided
            if (verifiedPhoto != null && !verifiedPhoto.isBlank()) {
                user.setAvatarUrl(verifiedPhoto);
            }

            logger.info("Google login successful: {} (ID: {})", user.getDisplayName(), user.getId());

            // Generate JWT and set as httpOnly cookie
            String token = jwtService.generateToken(user);

            Cookie cookie = new Cookie("lutem_token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
            cookie.setAttribute("SameSite", "Lax");
            httpResponse.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
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
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Delete cookie
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
        
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    /**
     * DEV ONLY: Create a test user for local development.
     * Only available when lutem.dev-mode=true
     */
    @PostMapping("/dev/create-user")
    public ResponseEntity<?> createDevUser(@RequestBody Map<String, String> request) {
        if (!devMode) {
            return ResponseEntity.notFound().build();
        }

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
     * Only available when lutem.dev-mode=true
     */
    @GetMapping("/dev/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        if (!devMode) {
            return ResponseEntity.notFound().build();
        }

        var claims = jwtService.validateToken(token);
        if (claims == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }

        Map<String, Object> response = new HashMap<>();
        claims.forEach((key, value) -> response.put(key, value));
        return ResponseEntity.ok(response);
    }
}
