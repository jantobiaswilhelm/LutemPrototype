package com.lutem.mvp.model;

public enum SocialPreference {
    SOLO("Solo", "Single-player experience", "🧍"),
    COOP("Co-op", "Play with friends cooperatively", "👥"),
    COMPETITIVE("Competitive", "Play against others", "⚔️"),
    BOTH("Solo/Multiplayer", "Supports both modes", "🎮");

    private final String displayName;
    private final String description;
    private final String emoji;

    SocialPreference(String displayName, String description, String emoji) {
        this.displayName = displayName;
        this.description = description;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getEmoji() { return emoji; }
}
