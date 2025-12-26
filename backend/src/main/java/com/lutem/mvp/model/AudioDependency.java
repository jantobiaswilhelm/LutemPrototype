package com.lutem.mvp.model;

public enum AudioDependency {
    REQUIRED("Audio Required", "Need sound to play properly (horror, rhythm, story)", "🔊"),
    HELPFUL("Audio Helpful", "Better with sound but playable muted", "🔉"),
    OPTIONAL("Audio Optional", "Fine muted, great for podcast gaming", "🔇");

    private final String displayName;
    private final String description;
    private final String emoji;

    AudioDependency(String displayName, String description, String emoji) {
        this.displayName = displayName;
        this.description = description;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getEmoji() { return emoji; }
}
