package com.lutem.mvp.dto;

import java.util.Map;
import java.util.List;

/**
 * User satisfaction statistics computed from Firestore session data.
 * Used to personalize recommendations based on historical preferences.
 */
public class SatisfactionStats {
    
    private int totalSessions;
    private int completedSessions;
    private int skippedSessions;
    private double averageRating;
    private int totalPlaytimeMinutes;
    
    // Game-specific stats: gameId -> average rating
    private Map<Long, Double> ratingsByGame;
    
    // Genre stats: genre -> average rating
    private Map<String, Double> ratingsByGenre;
    
    // Emotional tag frequency: tag -> count
    private Map<String, Integer> emotionalTagCounts;
    
    // Most common emotional tags (sorted by frequency)
    private List<String> topEmotionalTags;
    
    // Session length preferences: "short" (< 30min), "medium" (30-60), "long" (60+)
    private Map<String, Integer> sessionLengthDistribution;
    private String preferredSessionLength;
    
    // Time of day patterns: timeOfDay -> average rating
    private Map<String, Double> ratingsByTimeOfDay;
    private String bestTimeOfDay;
    
    // Day of week patterns: dayOfWeek -> session count
    private Map<String, Integer> sessionsByDayOfWeek;
    
    // Top rated games
    private List<GameRatingSummary> topRatedGames;
    
    // Constructors
    public SatisfactionStats() {}
    
    // Getters and Setters
    public int getTotalSessions() { return totalSessions; }
    public void setTotalSessions(int totalSessions) { this.totalSessions = totalSessions; }
    
    public int getCompletedSessions() { return completedSessions; }
    public void setCompletedSessions(int completedSessions) { this.completedSessions = completedSessions; }
    
    public int getSkippedSessions() { return skippedSessions; }
    public void setSkippedSessions(int skippedSessions) { this.skippedSessions = skippedSessions; }
    
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
    
    public int getTotalPlaytimeMinutes() { return totalPlaytimeMinutes; }
    public void setTotalPlaytimeMinutes(int totalPlaytimeMinutes) { this.totalPlaytimeMinutes = totalPlaytimeMinutes; }
    
    public Map<Long, Double> getRatingsByGame() { return ratingsByGame; }
    public void setRatingsByGame(Map<Long, Double> ratingsByGame) { this.ratingsByGame = ratingsByGame; }
    
    public Map<String, Double> getRatingsByGenre() { return ratingsByGenre; }
    public void setRatingsByGenre(Map<String, Double> ratingsByGenre) { this.ratingsByGenre = ratingsByGenre; }
    
    public Map<String, Integer> getEmotionalTagCounts() { return emotionalTagCounts; }
    public void setEmotionalTagCounts(Map<String, Integer> emotionalTagCounts) { this.emotionalTagCounts = emotionalTagCounts; }
    
    public List<String> getTopEmotionalTags() { return topEmotionalTags; }
    public void setTopEmotionalTags(List<String> topEmotionalTags) { this.topEmotionalTags = topEmotionalTags; }
    
    public Map<String, Integer> getSessionLengthDistribution() { return sessionLengthDistribution; }
    public void setSessionLengthDistribution(Map<String, Integer> sessionLengthDistribution) { this.sessionLengthDistribution = sessionLengthDistribution; }
    
    public String getPreferredSessionLength() { return preferredSessionLength; }
    public void setPreferredSessionLength(String preferredSessionLength) { this.preferredSessionLength = preferredSessionLength; }
    
    public Map<String, Double> getRatingsByTimeOfDay() { return ratingsByTimeOfDay; }
    public void setRatingsByTimeOfDay(Map<String, Double> ratingsByTimeOfDay) { this.ratingsByTimeOfDay = ratingsByTimeOfDay; }
    
    public String getBestTimeOfDay() { return bestTimeOfDay; }
    public void setBestTimeOfDay(String bestTimeOfDay) { this.bestTimeOfDay = bestTimeOfDay; }
    
    public Map<String, Integer> getSessionsByDayOfWeek() { return sessionsByDayOfWeek; }
    public void setSessionsByDayOfWeek(Map<String, Integer> sessionsByDayOfWeek) { this.sessionsByDayOfWeek = sessionsByDayOfWeek; }
    
    public List<GameRatingSummary> getTopRatedGames() { return topRatedGames; }
    public void setTopRatedGames(List<GameRatingSummary> topRatedGames) { this.topRatedGames = topRatedGames; }
    
    /**
     * Inner class for game rating summary
     */
    public static class GameRatingSummary {
        private Long gameId;
        private String gameName;
        private double averageRating;
        private int sessionCount;
        
        public GameRatingSummary() {}
        
        public GameRatingSummary(Long gameId, String gameName, double averageRating, int sessionCount) {
            this.gameId = gameId;
            this.gameName = gameName;
            this.averageRating = averageRating;
            this.sessionCount = sessionCount;
        }
        
        public Long getGameId() { return gameId; }
        public void setGameId(Long gameId) { this.gameId = gameId; }
        
        public String getGameName() { return gameName; }
        public void setGameName(String gameName) { this.gameName = gameName; }
        
        public double getAverageRating() { return averageRating; }
        public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
        
        public int getSessionCount() { return sessionCount; }
        public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; }
    }
}
