package com.lutem.mvp.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Weekly summary statistics for the user dashboard.
 * Lighter weight than SatisfactionStats - focused on recent activity recap.
 */
public class WeeklySummary {
    
    private int sessionsThisWeek;
    private int sessionsWithFeedback;
    private double averageSatisfaction;
    private int totalPlaytimeMinutes;
    
    // Most played game info
    private String mostPlayedGame;
    private Long mostPlayedGameId;
    private int mostPlayedCount;
    
    // Mood distribution: "relax" -> 3, "focus" -> 2, "challenge" -> 1
    private Map<String, Integer> moodDistribution;
    
    // Week boundaries
    private LocalDateTime weekStart;
    private LocalDateTime weekEnd;
    
    // Constructors
    public WeeklySummary() {}
    
    // Getters and Setters
    public int getSessionsThisWeek() { return sessionsThisWeek; }
    public void setSessionsThisWeek(int sessionsThisWeek) { this.sessionsThisWeek = sessionsThisWeek; }
    
    public int getSessionsWithFeedback() { return sessionsWithFeedback; }
    public void setSessionsWithFeedback(int sessionsWithFeedback) { this.sessionsWithFeedback = sessionsWithFeedback; }
    
    public double getAverageSatisfaction() { return averageSatisfaction; }
    public void setAverageSatisfaction(double averageSatisfaction) { this.averageSatisfaction = averageSatisfaction; }
    
    public int getTotalPlaytimeMinutes() { return totalPlaytimeMinutes; }
    public void setTotalPlaytimeMinutes(int totalPlaytimeMinutes) { this.totalPlaytimeMinutes = totalPlaytimeMinutes; }
    
    public String getMostPlayedGame() { return mostPlayedGame; }
    public void setMostPlayedGame(String mostPlayedGame) { this.mostPlayedGame = mostPlayedGame; }
    
    public Long getMostPlayedGameId() { return mostPlayedGameId; }
    public void setMostPlayedGameId(Long mostPlayedGameId) { this.mostPlayedGameId = mostPlayedGameId; }
    
    public int getMostPlayedCount() { return mostPlayedCount; }
    public void setMostPlayedCount(int mostPlayedCount) { this.mostPlayedCount = mostPlayedCount; }
    
    public Map<String, Integer> getMoodDistribution() { return moodDistribution; }
    public void setMoodDistribution(Map<String, Integer> moodDistribution) { this.moodDistribution = moodDistribution; }
    
    public LocalDateTime getWeekStart() { return weekStart; }
    public void setWeekStart(LocalDateTime weekStart) { this.weekStart = weekStart; }
    
    public LocalDateTime getWeekEnd() { return weekEnd; }
    public void setWeekEnd(LocalDateTime weekEnd) { this.weekEnd = weekEnd; }
}
