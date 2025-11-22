package com.lutem.mvp;

public enum EmotionalGoal {
    UNWIND("Unwind", "🛋️", "Low stress, calming, meditative"),
    RECHARGE("Recharge", "⚡", "Light engagement, mental break, refreshing"),
    ENGAGE("Engage", "🧠", "Active thinking, problem-solving, flow state"),
    CHALLENGE("Challenge", "🎯", "High intensity, skill testing, competitive"),
    EXPLORE("Explore", "🗺️", "Discovery, creativity, low-pressure wandering"),
    ACHIEVE("Achieve", "🏆", "Progress-focused, satisfying completion, quick wins");

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
