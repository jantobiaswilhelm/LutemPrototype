package com.lutem.mvp.dto;

import com.lutem.mvp.model.User;

/**
 * Lightweight user DTO for friend lists and search results.
 * Only includes public profile information.
 */
public class UserSummaryDTO {

    private Long id;
    private String displayName;
    private String avatarUrl;
    private String authProvider;

    // Constructors
    public UserSummaryDTO() {}

    public UserSummaryDTO(User user) {
        this.id = user.getId();
        this.displayName = user.getDisplayName();
        this.avatarUrl = user.getAvatarUrl();
        this.authProvider = user.getAuthProvider();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
}
