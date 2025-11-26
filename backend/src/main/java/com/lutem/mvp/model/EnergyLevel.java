package com.lutem.mvp.model;

public enum EnergyLevel {
    LOW("Low", "Exhausted - need something light", "🔋"),
    MEDIUM("Medium", "Normal - ready for moderate challenge", "🔋🔋"),
    HIGH("High", "Sharp - bring on complexity", "🔋🔋🔋");

    private final String displayName;
    private final String description;
    private final String emoji;

    EnergyLevel(String displayName, String description, String emoji) {
        this.displayName = displayName;
        this.description = description;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getEmoji() { return emoji; }
}
