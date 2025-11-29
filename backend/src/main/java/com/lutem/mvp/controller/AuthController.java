package com.lutem.mvp.controller;

import com.lutem.mvp.model.User;
import com.lutem.mvp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for authentication-related endpoints.
 * All endpoints require a valid Firebase ID token.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserService userService;
    
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    /**
     * Get current user info. Creates user on first login.
     * Requires: Authorization: Bearer <firebase-id-token>
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String firebaseUid = (String) request.getAttribute("firebaseUid");
        String email = (String) request.getAttribute("firebaseEmail");
        String displayName = (String) request.getAttribute("firebaseDisplayName");
        
        if (firebaseUid == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Not authenticated"));
        }
        
        // Find or create user
        User user = userService.findOrCreateByFirebaseUid(firebaseUid, email, displayName);
        
        // Return user info
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("firebaseUid", user.getFirebaseUid());
        response.put("email", user.getEmail());
        response.put("displayName", user.getDisplayName());
        response.put("createdAt", user.getCreatedAt());
        response.put("lastLoginAt", user.getLastLoginAt());
        
        return ResponseEntity.ok(response);
    }
}
