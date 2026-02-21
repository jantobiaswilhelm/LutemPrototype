package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.lutem.mvp.model.Role;

/**
 * User entity representing authenticated users.
 * Supports dual auth: Steam OpenID or Google (Firebase).
 * At least one of steamId or googleId must be set.
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_steam_id", columnList = "steam_id"),
    @Index(name = "idx_user_google_id", columnList = "firebase_uid")
})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Google/Firebase UID (nullable if Steam-only user)
     * Previously called firebaseUid - kept for backwards compatibility
     */
    @Column(name = "firebase_uid", unique = true)
    private String googleId;
    
    /**
     * Steam 64-bit ID (nullable if Google-only user)
     */
    @Column(name = "steam_id", unique = true)
    private String steamId;
    
    private String email;
    
    private String displayName;
    
    /**
     * Avatar URL from Steam or Google profile
     */
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
    
    /**
     * Auth provider used: "steam" or "google"
     */
    @Column(name = "auth_provider")
    private String authProvider;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime lastLoginAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    /**
     * Constructor for Google/Firebase auth (backwards compatible)
     */
    public User(String googleId, String email, String displayName) {
        this.googleId = googleId;
        this.email = email;
        this.displayName = displayName;
        this.authProvider = "google";
        this.createdAt = LocalDateTime.now();
        this.lastLoginAt = LocalDateTime.now();
    }
    
    /**
     * Constructor for Steam auth
     */
    public static User fromSteam(String steamId, String personaName, String avatarUrl) {
        User user = new User();
        user.steamId = steamId;
        user.displayName = personaName;
        user.avatarUrl = avatarUrl;
        user.authProvider = "steam";
        user.createdAt = LocalDateTime.now();
        user.lastLoginAt = LocalDateTime.now();
        return user;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getGoogleId() {
        return googleId;
    }
    
    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }
    
    public String getSteamId() {
        return steamId;
    }
    
    public void setSteamId(String steamId) {
        this.steamId = steamId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    public String getAuthProvider() {
        return authProvider;
    }
    
    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
    
    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
