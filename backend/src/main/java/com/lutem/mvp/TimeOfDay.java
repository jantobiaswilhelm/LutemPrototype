package com.lutem.mvp;

public enum TimeOfDay {
    MORNING("Morning", "6am - 12pm", "🌅"),
    MIDDAY("Midday", "12pm - 3pm", "☀️"),
    AFTERNOON("Afternoon", "3pm - 6pm", "🌤️"),
    EVENING("Evening", "6pm - 12am", "🌆"),
    LATE_NIGHT("Late Night", "12am - 6am", "🌙"),
    ANY("Anytime", "Suitable for any time", "🕐");

    private final String displayName;
    private final String timeRange;
    private final String emoji;

    TimeOfDay(String displayName, String timeRange, String emoji) {
        this.displayName = displayName;
        this.timeRange = timeRange;
        this.emoji = emoji;
    }

    public String getDisplayName() { return displayName; }
    public String getTimeRange() { return timeRange; }
    public String getEmoji() { return emoji; }
}
