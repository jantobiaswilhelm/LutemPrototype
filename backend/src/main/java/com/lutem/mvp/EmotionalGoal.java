package com.lutem.mvp;

public enum EmotionalGoal {
    UNWIND("Unwind and relax", "😌", "Low stress, calming, meditative"),
    RECHARGE("Recharge Energy", "🔋", "Light engagement, mental break, refreshing"),
    LOCKING_IN("Locking in", "🎯", "Active focus, deep concentration, flow state"),
    CHALLENGE("Challenge Myself", "⚡", "High intensity, skill testing, competitive"),
    ADVENTURE_TIME("Adventure Time", "🗺️", "Discovery, exploration, trying new things"),
    PROGRESS_ORIENTED("Progress Oriented", "🏆", "Achievement-focused, building momentum, quick wins");

    private final String displayName;
    private final String emoji;
    private final String description;

    EmotionalGoal(String displayName, String emoji, String description) {
        this.displayName = displayName;
        this.emoji = emoji;
        this.description = description;
    }

    public String getDisplayName() { return displayName; }
    public String getEmoji() { return emoji; }
    public String getDescription() { return description; }
}
