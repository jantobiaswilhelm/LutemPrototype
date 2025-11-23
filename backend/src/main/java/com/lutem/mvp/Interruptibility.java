package com.lutem.mvp;

public enum Interruptibility {
    HIGH("Yes - Total flexibility", "Can pause anytime, no progress loss", "✅"),
    MEDIUM("Some pauses are fine", "Can pause at save points", "⚠️"),
    LOW("No - I'm locked in", "Cannot pause, requires full commitment", "❌");

    private final String displayName;
    private final String description;
    private final String emoji;

    Interruptibility(String displayName, String description, String emoji) {
        this.displayName = displayName;
        this.description = description;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    public String getEmoji() { return emoji; }
}
