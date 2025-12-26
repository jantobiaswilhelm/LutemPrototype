package com.lutem.mvp.model;

public enum NsfwLevel {
    NONE("None", "No sexual content", "✅"),
    SUGGESTIVE("Suggestive", "Fanservice, revealing outfits, innuendo", "😏"),
    EXPLICIT("Explicit", "Sexual content, nudity, adult scenes", "🌶️");

    private final String displayName;
    private final String description;
    private final String emoji;

    NsfwLevel(String displayName, String description, String emoji) {
        this.displayName = displayName;
        this.description = description;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getEmoji() { return emoji; }
}
