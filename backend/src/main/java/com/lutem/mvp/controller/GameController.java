package com.lutem.mvp.controller;

import com.lutem.mvp.model.EmotionalGoal;
import com.lutem.mvp.model.EnergyLevel;
import com.lutem.mvp.model.Interruptibility;
import com.lutem.mvp.model.SocialPreference;
import com.lutem.mvp.model.TimeOfDay;
import com.lutem.mvp.dto.RecommendationRequest;
import com.lutem.mvp.dto.RecommendationResponse;
import com.lutem.mvp.dto.SessionFeedback;
import com.lutem.mvp.dto.SatisfactionStats;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.GameSession;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.service.GameSessionService;
import com.lutem.mvp.service.UserSatisfactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class GameController {
    
    @Autowired
    private GameRepository gameRepository;
    
    @Autowired
    private GameSessionService sessionService;
    
    @Autowired(required = false)
    private UserSatisfactionService satisfactionService;
    
    // In-memory feedback storage for backward compatibility
    private Map<Long, List<Integer>> feedbackMap = new HashMap<>();

    // GET /games - Returns only fully tagged games (for frontend recommendation UI)
    @GetMapping("/games")
    public List<Game> getAllGames() {
        System.out.println("=================================");
        System.out.println("GET /games called!");
        // Only return games that can be used for recommendations
        List<Game> games = gameRepository.findAllFullyTagged();
        System.out.println("Total fully-tagged games: " + games.size());
        long pendingCount = gameRepository.findAllPendingTagging().size();
        System.out.println("Pending games needing AI tagging: " + pendingCount);
        if (!games.isEmpty()) {
            Game firstGame = games.get(0);
            System.out.println("First game: " + firstGame.getName());
            System.out.println("Has emotionalGoals? " + (firstGame.getEmotionalGoals() != null));
            System.out.println("Has energyRequired? " + (firstGame.getEnergyRequired() != null));
        }
        System.out.println("=================================");
        return games;
    }
    
    // GET /games/all - Returns ALL games including pending (for admin/library views)
    @GetMapping("/games/all")
    public List<Game> getAllGamesIncludingPending() {
        return gameRepository.findAll();
    }
    
    // POST /recommendations with multi-dimensional scoring
    @PostMapping("/recommendations")
    public RecommendationResponse getRecommendation(@RequestBody RecommendationRequest request) {
        // Backend validation
        List<String> validationErrors = validateRequest(request);
        if (!validationErrors.isEmpty()) {
            System.out.println("❌ Validation failed: " + String.join(", ", validationErrors));
            return createValidationErrorResponse(validationErrors);
        }
        
        // Load Firestore satisfaction data if user is logged in
        SatisfactionStats userStats = null;
        if (request.getUserId() != null && satisfactionService != null) {
            try {
                userStats = satisfactionService.getSatisfactionStats(request.getUserId());
                System.out.println("📊 Loaded satisfaction stats for user: " + request.getUserId() + 
                    " (" + userStats.getCompletedSessions() + " completed sessions)");
            } catch (Exception e) {
                System.err.println("⚠️ Could not load satisfaction stats: " + e.getMessage());
            }
        }
        
        // Get only fully tagged games for recommendations (excludes PENDING)
        List<Game> games = gameRepository.findAllFullyTagged();
        System.out.println("📚 Found " + games.size() + " fully tagged games for recommendations");
        
        // Filter by audio availability
        if (request.getAudioAvailability() != null) {
            games = filterByAudioAvailability(games, request.getAudioAvailability());
            System.out.println("🔊 After audio filter: " + games.size() + " games");
        }
        
        // Filter by content rating and NSFW preferences
        games = filterByContentPreferences(games, request.getMaxContentRating(), request.getAllowNsfw());
        System.out.println("🛡️ After content filter: " + games.size() + " games");
        
        // Score all games (now with personalized satisfaction data)
        Map<Game, ScoringResult> scoredGames = new HashMap<>();
        
        for (Game game : games) {
            ScoringResult result = scoreGame(game, request, userStats);
            if (result.score > 0) {
                scoredGames.put(game, result);
            }
        }

        // Sort by score (descending)
        List<Map.Entry<Game, ScoringResult>> rankedGames = scoredGames.entrySet().stream()
            .sorted(Map.Entry.<Game, ScoringResult>comparingByValue((r1, r2) -> 
                Double.compare(r2.score, r1.score)))
            .collect(Collectors.toList());

        if (rankedGames.isEmpty()) {
            return createNoMatchResponse();
        }

        // Get top 5 (1 main + 4 alternatives)
        Game topRecommendation = rankedGames.get(0).getKey();
        String topReason = rankedGames.get(0).getValue().reason;
        double topScore = rankedGames.get(0).getValue().score;
        
        List<Game> alternatives = new ArrayList<>();
        List<String> alternativeReasons = new ArrayList<>();
        List<Double> alternativeScores = new ArrayList<>();
        
        for (int i = 1; i < Math.min(5, rankedGames.size()); i++) {
            alternatives.add(rankedGames.get(i).getKey());
            alternativeReasons.add(rankedGames.get(i).getValue().reason);
            alternativeScores.add(rankedGames.get(i).getValue().score);
        }

        // Calculate match percentages
        double maxScore = topScore;
        Integer topMatchPercentage = calculateMatchPercentage(topScore, maxScore);
        
        List<Integer> alternativeMatchPercentages = new ArrayList<>();
        for (Double score : alternativeScores) {
            alternativeMatchPercentages.add(calculateMatchPercentage(score, maxScore));
        }

        // **NEW: Record this recommendation as a session in the database**
        GameSession session = sessionService.recordRecommendation(
            topRecommendation,
            request.getAvailableMinutes(),
            request.getDesiredMood() // Uses helper method from request
        );
        
        // Build response with sessionId
        RecommendationResponse response = new RecommendationResponse(
            topRecommendation, alternatives, topReason, alternativeReasons,
            topMatchPercentage, alternativeMatchPercentages
        );
        response.setSessionId(session.getId());
        
        System.out.println("✅ Recommendation created - Session ID: " + session.getId());
        
        return response;
    }

    private ScoringResult scoreGame(Game game, RecommendationRequest request, SatisfactionStats userStats) {
        double score = 0.0;
        List<String> matchReasons = new ArrayList<>();

        // 1. TIME MATCH (30%)
        if (game.getMinMinutes() > request.getAvailableMinutes()) {
            return new ScoringResult(0.0, "Too long for available time");
        }
        
        if (game.getMaxMinutes() <= request.getAvailableMinutes()) {
            score += 30.0;
            matchReasons.add("Fits your " + request.getAvailableMinutes() + "-minute window");
        } else if (game.getMinMinutes() <= request.getAvailableMinutes()) {
            score += 20.0;
            matchReasons.add("Can start in " + request.getAvailableMinutes() + " minutes");
        }

        // 2. EMOTIONAL GOAL MATCH (25%)
        if (request.getDesiredEmotionalGoals() != null && !request.getDesiredEmotionalGoals().isEmpty()) {
            for (EmotionalGoal goal : request.getDesiredEmotionalGoals()) {
                if (game.hasEmotionalGoal(goal)) {
                    score += 25.0 / request.getDesiredEmotionalGoals().size();
                    matchReasons.add("Great for " + goal.getDisplayName().toLowerCase());
                }
            }
        }

        // 3. INTERRUPTIBILITY MATCH (20%)
        if (request.getRequiredInterruptibility() != null) {
            if (game.getInterruptibility() == request.getRequiredInterruptibility()) {
                score += 20.0;
                matchReasons.add(game.getInterruptibility().getDisplayName() + " - " + getInterruptibilityDescription(game.getInterruptibility()));
            } else if (game.getInterruptibility().ordinal() >= request.getRequiredInterruptibility().ordinal()) {
                score += 15.0;
                matchReasons.add("Easy to pause when needed");
            } else {
                score -= 10.0;
            }
        }

        // 4. ENERGY LEVEL MATCH (15%)
        if (request.getCurrentEnergyLevel() != null) {
            if (game.getEnergyRequired() == request.getCurrentEnergyLevel()) {
                score += 15.0;
                matchReasons.add("Perfect match for your " + game.getEnergyRequired().getDisplayName().toLowerCase() + " energy level");
            } else if (game.getEnergyRequired().ordinal() < request.getCurrentEnergyLevel().ordinal()) {
                score += 12.0;
                matchReasons.add("Won't drain your energy");
            } else {
                score -= 5.0;
            }
        }

        // 5. TIME OF DAY MATCH (5%)
        if (request.getTimeOfDay() != null) {
            if (game.isSuitableForTimeOfDay(request.getTimeOfDay())) {
                score += 5.0;
                matchReasons.add("Ideal for " + request.getTimeOfDay().getDisplayName().toLowerCase());
            }
        }

        // 6. SOCIAL PREFERENCE MATCH (5%)
        if (request.getSocialPreference() != null) {
            if (game.matchesSocialPreference(request.getSocialPreference())) {
                score += 5.0;
                matchReasons.add("Perfect for " + request.getSocialPreference().getDisplayName().toLowerCase() + " play");
            } else {
                score -= 5.0;
            }
        }

        // 7. SATISFACTION BONUS - FIRESTORE (max 15%) 
        // Uses personalized Firestore data if available
        if (userStats != null && userStats.getRatingsByGame() != null) {
            Double userRating = userStats.getRatingsByGame().get(game.getId());
            if (userRating != null && userRating > 0) {
                score += (userRating / 5.0) * 15.0;
                if (userRating >= 4.0) {
                    matchReasons.add("You rated this " + String.format("%.1f", userRating) + "/5 ⭐");
                } else if (userRating >= 3.0) {
                    matchReasons.add("Previously enjoyed by you");
                }
            }
        } else {
            // Fallback: database/memory satisfaction
            double avg = getAverageSatisfaction(game.getId());
            if (game.getSessionCount() > 0) {
                score += (avg / 5.0) * 10.0;
                if (avg >= 4.0) {
                    matchReasons.add("You've loved this before (" + String.format("%.1f", avg) + "/5 ⭐)");
                } else if (avg >= 3.5) {
                    matchReasons.add("Previously enjoyed by you");
                }
            }
        }

        // 8. GENRE PREFERENCE BOOST (max 15%)
        if (request.getPreferredGenres() != null && !request.getPreferredGenres().isEmpty()) {
            long genreMatches = game.getGenres().stream()
                .filter(genre -> request.getPreferredGenres().stream()
                    .anyMatch(prefGenre -> prefGenre.equalsIgnoreCase(genre)))
                .count();
            
            if (genreMatches > 0) {
                double genreBonus = (genreMatches / (double) request.getPreferredGenres().size()) * 15.0;
                score += genreBonus;
                String matchedGenres = game.getGenres().stream()
                    .filter(genre -> request.getPreferredGenres().stream()
                        .anyMatch(prefGenre -> prefGenre.equalsIgnoreCase(genre)))
                    .collect(Collectors.joining(", "));
                matchReasons.add("Matches your taste: " + matchedGenres);
            }
        }
        
        // 9. GENRE SATISFACTION BOOST - FIRESTORE (max 10%)
        // If user rates certain genres highly, boost games in those genres
        if (userStats != null && userStats.getRatingsByGenre() != null) {
            for (String gameGenre : game.getGenres()) {
                Double genreRating = userStats.getRatingsByGenre().get(gameGenre);
                if (genreRating != null && genreRating >= 4.0) {
                    score += 5.0; // Boost for highly-rated genres
                    if (!matchReasons.stream().anyMatch(r -> r.contains("satisfying genre"))) {
                        matchReasons.add("Based on your history with " + gameGenre.toLowerCase() + " games");
                    }
                    break; // Only add this reason once
                }
            }
        }
        
        // 10. TIME-OF-DAY SATISFACTION PATTERN (max 5%)
        // Boost games that match patterns where user is typically satisfied
        if (userStats != null && userStats.getBestTimeOfDay() != null && request.getTimeOfDay() != null) {
            String currentTime = request.getTimeOfDay().name();
            if (currentTime.equals(userStats.getBestTimeOfDay())) {
                Double todRating = userStats.getRatingsByTimeOfDay().get(currentTime);
                if (todRating != null && todRating >= 4.0) {
                    score += 3.0;
                    matchReasons.add("You're typically satisfied gaming at this time");
                }
            }
        }

        // Build reason summary
        String reason;
        if (matchReasons.isEmpty()) {
            reason = "Available game for your time slot";
        } else if (matchReasons.size() <= 3) {
            reason = String.join(" • ", matchReasons);
        } else {
            reason = matchReasons.subList(0, 3).stream()
                .collect(Collectors.joining(" • "));
        }
        
        return new ScoringResult(score, reason);
    }

    // POST /sessions/feedback - **NEW: Saves to database**
    @PostMapping("/sessions/feedback")
    public Map<String, String> submitFeedback(@RequestBody SessionFeedback feedback) {
        Map<String, String> response = new HashMap<>();
        
        // Save to database using session ID
        if (feedback.getSessionId() != null) {
            boolean success = sessionService.recordFeedback(
                feedback.getSessionId(),
                feedback.getSatisfactionScore()
            ).isPresent();
            
            if (success) {
                System.out.println("✅ Feedback saved - Session ID: " + feedback.getSessionId() + 
                                   ", Score: " + feedback.getSatisfactionScore());
                response.put("status", "success");
                response.put("message", "Feedback recorded in database");
                return response;
            }
        }
        
        // Fallback: in-memory storage for backward compatibility
        if (feedback.getGameId() != null) {
            feedbackMap.computeIfAbsent(feedback.getGameId(), k -> new ArrayList<>())
                       .add(feedback.getSatisfactionScore());
            
            System.out.println("⚠️ Feedback saved to memory (no sessionId) - Game ID: " + 
                             feedback.getGameId() + ", Score: " + feedback.getSatisfactionScore());
            response.put("status", "success");
            response.put("message", "Feedback recorded in memory");
            return response;
        }
        
        response.put("status", "error");
        response.put("message", "No sessionId or gameId provided");
        return response;
    }

    // Helper method to get average satisfaction from both database and memory
    private double getAverageSatisfaction(Long gameId) {
        // Try database first
        Double dbAverage = sessionService.getAverageSatisfaction(gameId);
        if (dbAverage != null && dbAverage > 0) {
            return dbAverage;
        }
        
        // Fallback to in-memory
        List<Integer> scores = feedbackMap.get(gameId);
        if (scores == null || scores.isEmpty()) {
            return 0.0;
        }
        return scores.stream().mapToInt(Integer::intValue).average().orElse(0.0);
    }

    // Validation helper
    private List<String> validateRequest(RecommendationRequest request) {
        List<String> errors = new ArrayList<>();
        
        if (request.getAvailableMinutes() <= 0) {
            errors.add("availableMinutes must be positive");
        }
        
        if (request.getDesiredEmotionalGoals() == null || request.getDesiredEmotionalGoals().isEmpty()) {
            errors.add("at least one emotional goal required");
        }
        
        if (request.getRequiredInterruptibility() == null) {
            errors.add("interruptibility level required");
        }
        
        return errors;
    }

    // Error response helpers
    private RecommendationResponse createValidationErrorResponse(List<String> errors) {
        Game errorGame = new Game();
        errorGame.setId(0L);
        errorGame.setName("Validation Error");
        
        String reason = "Please check: " + String.join(", ", errors);
        return new RecommendationResponse(errorGame, new ArrayList<>(), reason, new ArrayList<>());
    }

    private RecommendationResponse createNoMatchResponse() {
        Game noMatch = new Game();
        noMatch.setId(0L);
        noMatch.setName("No Match Found");
        
        return new RecommendationResponse(
            noMatch, 
            new ArrayList<>(), 
            "Try adjusting your preferences - no games fit your current criteria",
            new ArrayList<>()
        );
    }

    // Helper to calculate match percentage
    private Integer calculateMatchPercentage(double score, double maxScore) {
        if (maxScore == 0) return 50;
        return Math.min(100, Math.max(50, (int) ((score / maxScore) * 100)));
    }

    // Helper to get interruptibility description
    private String getInterruptibilityDescription(Interruptibility level) {
        switch (level) {
            case HIGH:
                return "Pause anytime";
            case MEDIUM:
                return "Can pause between rounds";
            case LOW:
                return "Complete sessions preferred";
            default:
                return "";
        }
    }

    // Inner class for scoring results
    private static class ScoringResult implements Comparable<ScoringResult> {
        double score;
        String reason;

        ScoringResult(double score, String reason) {
            this.score = score;
            this.reason = reason;
        }

        @Override
        public int compareTo(ScoringResult other) {
            return Double.compare(other.score, this.score); // Descending order
        }
    }
    
    // Filter by audio availability
    // 'full' = show all games
    // 'low' = exclude games where audioDependency = REQUIRED
    // 'muted' = only show games where audioDependency = OPTIONAL
    private List<Game> filterByAudioAvailability(List<Game> games, String audioAvailability) {
        if (audioAvailability == null || "full".equalsIgnoreCase(audioAvailability)) {
            return games; // No filtering needed
        }
        
        return games.stream()
            .filter(game -> {
                if (game.getAudioDependency() == null) {
                    return true; // Untagged games pass through
                }
                
                if ("muted".equalsIgnoreCase(audioAvailability)) {
                    // Only OPTIONAL games can be played without sound
                    return game.getAudioDependency() == com.lutem.mvp.model.AudioDependency.OPTIONAL;
                } else if ("low".equalsIgnoreCase(audioAvailability)) {
                    // OPTIONAL and HELPFUL are OK, REQUIRED is excluded
                    return game.getAudioDependency() != com.lutem.mvp.model.AudioDependency.REQUIRED;
                }
                return true;
            })
            .collect(Collectors.toList());
    }
    
    // Filter by content rating and NSFW preferences
    private List<Game> filterByContentPreferences(List<Game> games, 
            com.lutem.mvp.model.ContentRating maxRating, Boolean allowNsfw) {
        
        return games.stream()
            .filter(game -> {
                // Filter by max content rating
                if (maxRating != null && game.getContentRating() != null) {
                    if (game.getContentRating().ordinal() > maxRating.ordinal()) {
                        return false; // Game exceeds user's max rating
                    }
                }
                
                // Filter by NSFW preference
                if (allowNsfw != null && !allowNsfw) {
                    if (game.getNsfwLevel() != null && 
                        game.getNsfwLevel() != com.lutem.mvp.model.NsfwLevel.NONE) {
                        return false; // User doesn't want NSFW content
                    }
                }
                
                return true;
            })
            .collect(Collectors.toList());
    }
}
