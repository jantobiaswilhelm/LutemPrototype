package com.lutem.mvp.model;

public enum ContentRating {
    EVERYONE("Everyone", "Suitable for all ages", "👶"),
    TEEN("Teen 13+", "Mild violence, some language", "🧒"),
    MATURE("Mature 17+", "Violence, blood, strong language", "🔞"),
    ADULT("Adults Only 18+", "Intense violence, graphic content, or adult themes", "⛔");

    private final String displayName;
    private final String description;
    private final String emoji;

    ContentRating(String displayName, String description, String emoji) {
        this.displayName = displayName;
        this.description = description;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getEmoji() { return emoji; }
}
