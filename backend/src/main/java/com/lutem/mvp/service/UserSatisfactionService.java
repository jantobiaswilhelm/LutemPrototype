package com.lutem.mvp.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.lutem.mvp.dto.SatisfactionStats;
import com.lutem.mvp.dto.SatisfactionStats.GameRatingSummary;
import com.lutem.mvp.dto.WeeklySummary;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Service for computing user satisfaction statistics from Firestore session data.
 * Queries the users/{uid}/sessions collection and aggregates feedback data.
 */
@Service
public class UserSatisfactionService {
    
    private final Firestore firestore;
    
    @Autowired
    public UserSatisfactionService(Firestore firestore) {
        this.firestore = firestore;
    }
    
    /**
     * Get comprehensive satisfaction stats for a user
     */
    public SatisfactionStats getSatisfactionStats(String uid) throws ExecutionException, InterruptedException {
        if (firestore == null) {
            System.err.println("⚠️ Firestore not available");
            return createEmptyStats();
        }
        
        // Query all sessions for this user
        CollectionReference sessionsRef = firestore.collection("users").document(uid).collection("sessions");
        ApiFuture<QuerySnapshot> future = sessionsRef.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        
        if (documents.isEmpty()) {
            return createEmptyStats();
        }
        
        return computeStats(documents);
    }
    
    /**
     * Get weekly summary for user dashboard
     */
    public WeeklySummary getWeeklySummary(String uid) throws ExecutionException, InterruptedException {
        if (firestore == null) {
            System.err.println("⚠️ Firestore not available");
            return createEmptyWeeklySummary();
        }
        
        // Calculate week boundaries
        LocalDateTime weekEnd = LocalDateTime.now();
        LocalDateTime weekStart = weekEnd.minusDays(7);
        Date weekStartDate = Date.from(weekStart.atZone(ZoneId.systemDefault()).toInstant());
        
        // Query sessions from last 7 days
        CollectionReference sessionsRef = firestore.collection("users").document(uid).collection("sessions");
        ApiFuture<QuerySnapshot> future = sessionsRef
            .whereGreaterThanOrEqualTo("timestamp", weekStartDate)
            .get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        
        return computeWeeklySummary(documents, weekStart, weekEnd);
    }
    
    /**
     * Compute weekly summary from session documents
     */
    private WeeklySummary computeWeeklySummary(List<QueryDocumentSnapshot> documents, 
            LocalDateTime weekStart, LocalDateTime weekEnd) {
        
        WeeklySummary summary = new WeeklySummary();
        summary.setWeekStart(weekStart);
        summary.setWeekEnd(weekEnd);
        
        if (documents.isEmpty()) {
            summary.setSessionsThisWeek(0);
            summary.setSessionsWithFeedback(0);
            summary.setAverageSatisfaction(0);
            summary.setTotalPlaytimeMinutes(0);
            summary.setMoodDistribution(new HashMap<>());
            return summary;
        }
        
        int sessionsWithFeedback = 0;
        int totalPlaytime = 0;
        double ratingSum = 0;
        int ratingCount = 0;
        Map<String, Integer> moodCounts = new HashMap<>();
        Map<Long, Integer> gamePlayCounts = new HashMap<>();
        Map<Long, String> gameNames = new HashMap<>();
        
        for (QueryDocumentSnapshot doc : documents) {
            Map<String, Object> data = doc.getData();
            
            // Rating
            Number rating = (Number) data.get("rating");
            if (rating != null) {
                sessionsWithFeedback++;
                ratingSum += rating.doubleValue();
                ratingCount++;
            }
            
            // Duration
            Number duration = (Number) data.get("actualDuration");
            if (duration != null) {
                totalPlaytime += duration.intValue();
            }
            
            // Mood/goal distribution
            String mood = (String) data.get("desiredMood");
            if (mood != null) {
                moodCounts.merge(mood.toLowerCase(), 1, Integer::sum);
            }
            
            // Track most played game
            Number gameIdNum = (Number) data.get("gameId");
            String gameName = (String) data.get("gameName");
            if (gameIdNum != null) {
                Long gameId = gameIdNum.longValue();
                gamePlayCounts.merge(gameId, 1, Integer::sum);
                if (gameName != null) {
                    gameNames.put(gameId, gameName);
                }
            }
        }
        
        summary.setSessionsThisWeek(documents.size());
        summary.setSessionsWithFeedback(sessionsWithFeedback);
        summary.setAverageSatisfaction(ratingCount > 0 ? ratingSum / ratingCount : 0);
        summary.setTotalPlaytimeMinutes(totalPlaytime);
        summary.setMoodDistribution(moodCounts);
        
        // Find most played game
        if (!gamePlayCounts.isEmpty()) {
            Map.Entry<Long, Integer> mostPlayed = gamePlayCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);
            if (mostPlayed != null) {
                summary.setMostPlayedGameId(mostPlayed.getKey());
                summary.setMostPlayedGame(gameNames.get(mostPlayed.getKey()));
                summary.setMostPlayedCount(mostPlayed.getValue());
            }
        }
        
        return summary;
    }
    
    /**
     * Create empty weekly summary
     */
    private WeeklySummary createEmptyWeeklySummary() {
        WeeklySummary summary = new WeeklySummary();
        summary.setSessionsThisWeek(0);
        summary.setSessionsWithFeedback(0);
        summary.setAverageSatisfaction(0);
        summary.setTotalPlaytimeMinutes(0);
        summary.setMoodDistribution(new HashMap<>());
        summary.setWeekStart(LocalDateTime.now().minusDays(7));
        summary.setWeekEnd(LocalDateTime.now());
        return summary;
    }

    /**
     * Compute all statistics from session documents
     */
    private SatisfactionStats computeStats(List<QueryDocumentSnapshot> documents) {
        SatisfactionStats stats = new SatisfactionStats();
        
        int completed = 0;
        int skipped = 0;
        int totalPlaytime = 0;
        double ratingSum = 0;
        int ratingCount = 0;
        
        // Maps for aggregation
        Map<Long, List<Double>> gameRatings = new HashMap<>();
        Map<String, List<Double>> genreRatings = new HashMap<>();
        Map<String, Integer> tagCounts = new HashMap<>();
        Map<String, Integer> lengthDist = new HashMap<>();
        Map<String, List<Double>> timeOfDayRatings = new HashMap<>();
        Map<String, Integer> dayOfWeekCounts = new HashMap<>();
        Map<Long, String> gameNames = new HashMap<>();
        
        for (QueryDocumentSnapshot doc : documents) {
            Map<String, Object> data = doc.getData();
            String status = (String) data.get("status");
            
            if ("COMPLETED".equals(status)) {
                completed++;
                processCompletedSession(data, gameRatings, genreRatings, tagCounts, 
                    lengthDist, timeOfDayRatings, dayOfWeekCounts, gameNames);
                
                // Rating
                Number rating = (Number) data.get("rating");
                if (rating != null) {
                    ratingSum += rating.doubleValue();
                    ratingCount++;
                }
                
                // Duration
                Number duration = (Number) data.get("actualDuration");
                if (duration != null) {
                    totalPlaytime += duration.intValue();
                }
            } else if ("SKIPPED".equals(status)) {
                skipped++;
            }
        }
        
        stats.setTotalSessions(documents.size());
        stats.setCompletedSessions(completed);
        stats.setSkippedSessions(skipped);
        stats.setTotalPlaytimeMinutes(totalPlaytime);
        stats.setAverageRating(ratingCount > 0 ? ratingSum / ratingCount : 0);

        // Aggregate game ratings
        Map<Long, Double> avgRatingsByGame = new HashMap<>();
        for (Map.Entry<Long, List<Double>> entry : gameRatings.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(d -> d).average().orElse(0);
            avgRatingsByGame.put(entry.getKey(), avg);
        }
        stats.setRatingsByGame(avgRatingsByGame);
        
        // Aggregate genre ratings
        Map<String, Double> avgRatingsByGenre = new HashMap<>();
        for (Map.Entry<String, List<Double>> entry : genreRatings.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(d -> d).average().orElse(0);
            avgRatingsByGenre.put(entry.getKey(), avg);
        }
        stats.setRatingsByGenre(avgRatingsByGenre);
        
        // Emotional tags
        stats.setEmotionalTagCounts(tagCounts);
        List<String> topTags = tagCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
        stats.setTopEmotionalTags(topTags);
        
        // Session length distribution
        stats.setSessionLengthDistribution(lengthDist);
        stats.setPreferredSessionLength(findMaxKey(lengthDist));
        
        // Time of day patterns
        Map<String, Double> avgByTimeOfDay = new HashMap<>();
        for (Map.Entry<String, List<Double>> entry : timeOfDayRatings.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(d -> d).average().orElse(0);
            avgByTimeOfDay.put(entry.getKey(), avg);
        }
        stats.setRatingsByTimeOfDay(avgByTimeOfDay);
        stats.setBestTimeOfDay(findMaxKeyByValue(avgByTimeOfDay));
        
        // Day of week
        stats.setSessionsByDayOfWeek(dayOfWeekCounts);

        // Top rated games
        List<GameRatingSummary> topGames = gameRatings.entrySet().stream()
            .filter(e -> e.getValue().size() >= 1) // At least 1 session
            .map(e -> new GameRatingSummary(
                e.getKey(),
                gameNames.getOrDefault(e.getKey(), "Unknown"),
                e.getValue().stream().mapToDouble(d -> d).average().orElse(0),
                e.getValue().size()
            ))
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .limit(5)
            .collect(Collectors.toList());
        stats.setTopRatedGames(topGames);
        
        return stats;
    }
    
    /**
     * Process a completed session and update aggregation maps
     */
    @SuppressWarnings("unchecked")
    private void processCompletedSession(Map<String, Object> data,
            Map<Long, List<Double>> gameRatings,
            Map<String, List<Double>> genreRatings,
            Map<String, Integer> tagCounts,
            Map<String, Integer> lengthDist,
            Map<String, List<Double>> timeOfDayRatings,
            Map<String, Integer> dayOfWeekCounts,
            Map<Long, String> gameNames) {
        
        Number gameIdNum = (Number) data.get("gameId");
        Long gameId = gameIdNum != null ? gameIdNum.longValue() : null;
        String gameName = (String) data.get("gameName");
        String genre = (String) data.get("gameGenre");
        Number rating = (Number) data.get("rating");
        Number duration = (Number) data.get("actualDuration");
        List<String> tags = (List<String>) data.get("emotionalTags");
        String timeOfDay = (String) data.get("timeOfDay");
        String dayOfWeek = (String) data.get("dayOfWeek");

        // Store game name
        if (gameId != null && gameName != null) {
            gameNames.put(gameId, gameName);
        }
        
        // Game ratings
        if (gameId != null && rating != null) {
            gameRatings.computeIfAbsent(gameId, k -> new ArrayList<>()).add(rating.doubleValue());
        }
        
        // Genre ratings
        if (genre != null && rating != null) {
            genreRatings.computeIfAbsent(genre, k -> new ArrayList<>()).add(rating.doubleValue());
        }
        
        // Emotional tags
        if (tags != null) {
            for (String tag : tags) {
                tagCounts.merge(tag, 1, Integer::sum);
            }
        }
        
        // Session length category
        if (duration != null) {
            int mins = duration.intValue();
            String category;
            if (mins < 30) category = "short";
            else if (mins < 60) category = "medium";
            else category = "long";
            lengthDist.merge(category, 1, Integer::sum);
        }
        
        // Time of day ratings
        if (timeOfDay != null && rating != null) {
            timeOfDayRatings.computeIfAbsent(timeOfDay, k -> new ArrayList<>()).add(rating.doubleValue());
        }
        
        // Day of week counts
        if (dayOfWeek != null) {
            dayOfWeekCounts.merge(dayOfWeek, 1, Integer::sum);
        }
    }

    /**
     * Find the key with highest count
     */
    private String findMaxKey(Map<String, Integer> map) {
        return map.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
    }
    
    /**
     * Find the key with highest value (for double maps)
     */
    private String findMaxKeyByValue(Map<String, Double> map) {
        return map.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
    }
    
    /**
     * Create empty stats for users with no sessions
     */
    private SatisfactionStats createEmptyStats() {
        SatisfactionStats stats = new SatisfactionStats();
        stats.setTotalSessions(0);
        stats.setCompletedSessions(0);
        stats.setSkippedSessions(0);
        stats.setAverageRating(0);
        stats.setTotalPlaytimeMinutes(0);
        stats.setRatingsByGame(new HashMap<>());
        stats.setRatingsByGenre(new HashMap<>());
        stats.setEmotionalTagCounts(new HashMap<>());
        stats.setTopEmotionalTags(new ArrayList<>());
        stats.setSessionLengthDistribution(new HashMap<>());
        stats.setRatingsByTimeOfDay(new HashMap<>());
        stats.setSessionsByDayOfWeek(new HashMap<>());
        stats.setTopRatedGames(new ArrayList<>());
        return stats;
    }
    
    /**
     * Get average rating for a specific game (used by recommendation engine)
     */
    public Double getGameRating(String uid, Long gameId) throws ExecutionException, InterruptedException {
        SatisfactionStats stats = getSatisfactionStats(uid);
        return stats.getRatingsByGame().get(gameId);
    }
    
    /**
     * Get user's top emotional tags (used by recommendation engine)
     */
    public List<String> getTopEmotionalTags(String uid) throws ExecutionException, InterruptedException {
        SatisfactionStats stats = getSatisfactionStats(uid);
        return stats.getTopEmotionalTags();
    }
}
