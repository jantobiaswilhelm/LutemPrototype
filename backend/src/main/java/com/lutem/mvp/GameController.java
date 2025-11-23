package com.lutem.mvp;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class GameController {
    
    // In-memory storage
    private List<Game> games;
    private Map<Long, List<Integer>> feedbackMap;
    
    public GameController() {
        initializeGames();
        feedbackMap = new HashMap<>();
    }
    
    private void initializeGames() {
        games = new ArrayList<>();
        Long id = 1L;
        
        // CASUAL GAMES (5-30 min)
        
        // 1. Unpacking - Unwind, Progress Oriented
        games.add(new Game(id++, "Unpacking", 10, 20,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.MIDDAY, TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO),
            "Puzzle",
            "Zen unpacking simulator with cozy vibes",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg"
        ));

        // 2. Dorfromantik - Unwind, Locking in
        games.add(new Game(id++, "Dorfromantik", 15, 25,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.LOCKING_IN),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Puzzle",
            "Peaceful tile-placement puzzle game",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1455840/header.jpg"
        ));

        // 3. Tetris Effect - Recharge, Challenge
        games.add(new Game(id++, "Tetris Effect", 5, 20,
            Arrays.asList(EmotionalGoal.RECHARGE, EmotionalGoal.CHALLENGE),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Arcade",
            "Classic Tetris with stunning audiovisuals",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1003590/header.jpg"
        ));

        // 4. Dead Cells - Challenge, Progress Oriented
        games.add(new Game(id++, "Dead Cells", 15, 25,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            "Roguelike",
            "Fast-paced roguelike action platformer",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg"
        ));

        // 5. Rocket League - Challenge, Recharge
        games.add(new Game(id++, "Rocket League", 10, 15,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            "Sports",
            "Soccer with rocket-powered cars",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg"
        ));

        // 6. Baba Is You - Locking in, Challenge
        games.add(new Game(id++, "Baba Is You", 15, 25,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            "Puzzle",
            "Brain-teasing puzzle game with rule manipulation",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/736260/header.jpg"
        ));

        // MID-RANGE GAMES (30-60 min)

        // 7. Hades - Challenge, Progress Oriented, Locking in
        games.add(new Game(id++, "Hades", 30, 45,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            "Roguelike",
            "Action roguelike with compelling story",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg"
        ));

        // 8. Stardew Valley - Unwind, Progress Oriented, Adventure Time
        games.add(new Game(id++, "Stardew Valley", 30, 60,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Farming Sim",
            "Relaxing farming and life simulation",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg"
        ));

        // 9. Slay the Spire - Locking in, Challenge, Progress Oriented
        games.add(new Game(id++, "Slay the Spire", 30, 60,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Card Game",
            "Strategic deck-building roguelike",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/646570/header.jpg"
        ));

        // 10. Apex Legends - Challenge, Recharge
        games.add(new Game(id++, "Apex Legends", 30, 45,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.RECHARGE),
            Interruptibility.LOW,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            "Battle Royale",
            "Fast-paced team-based battle royale",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg"
        ));

        // 11. PowerWash Simulator - Unwind, Progress Oriented
        games.add(new Game(id++, "PowerWash Simulator", 30, 45,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.EVENING, TimeOfDay.LATE_NIGHT),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Simulation",
            "Meditative cleaning simulator",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1290000/header.jpg"
        ));

        // 12. Into the Breach - Locking in, Challenge
        games.add(new Game(id++, "Into the Breach", 30, 50,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.CHALLENGE),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            "Strategy",
            "Turn-based tactical combat puzzle",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/590380/header.jpg"
        ));

        // LONG-FORM GAMES (60+ min)

        // 13. The Witcher 3 - Adventure Time, Locking in
        games.add(new Game(id++, "The Witcher 3", 60, 120,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO),
            "RPG",
            "Epic story-driven open-world RPG",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg"
        ));

        // 14. Minecraft - Adventure Time, Unwind, Progress Oriented
        games.add(new Game(id++, "Minecraft", 60, 180,
            Arrays.asList(EmotionalGoal.ADVENTURE_TIME, EmotionalGoal.UNWIND, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.BOTH),
            "Sandbox",
            "Creative building and exploration",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1366220/header.jpg"
        ));

        // 15. Dark Souls III - Challenge, Locking in
        games.add(new Game(id++, "Dark Souls III", 60, 120,
            Arrays.asList(EmotionalGoal.CHALLENGE, EmotionalGoal.LOCKING_IN),
            Interruptibility.MEDIUM,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COOP),
            "Action RPG",
            "Challenging action RPG with precise combat",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg"
        ));

        // 16. Civilization VI - Locking in, Progress Oriented
        games.add(new Game(id++, "Civilization VI", 60, 180,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.HIGH,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.SOLO, SocialPreference.COMPETITIVE),
            "Strategy",
            "Turn-based historical strategy game",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg"
        ));

        // 17. A Short Hike - Unwind, Adventure Time
        games.add(new Game(id++, "A Short Hike", 5, 30,
            Arrays.asList(EmotionalGoal.UNWIND, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.LOW,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Adventure",
            "Cozy exploration game in a beautiful park",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1055540/header.jpg"
        ));

        // 18. Loop Hero - Locking in, Progress Oriented
        games.add(new Game(id++, "Loop Hero", 30, 50,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.PROGRESS_ORIENTED),
            Interruptibility.MEDIUM,
            EnergyLevel.MEDIUM,
            Arrays.asList(TimeOfDay.ANY),
            Arrays.asList(SocialPreference.SOLO),
            "Strategy",
            "Unique auto-battler with deck-building",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1282730/header.jpg"
        ));

        // 19. Valorant - Challenge
        games.add(new Game(id++, "Valorant", 35, 50,
            Arrays.asList(EmotionalGoal.CHALLENGE),
            Interruptibility.LOW,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING),
            Arrays.asList(SocialPreference.COMPETITIVE, SocialPreference.COOP),
            "Tactical FPS",
            "Character-based tactical shooter",
            "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5c61e5e37cdf83d8/621d7e23b50e930c28e29c98/VAL_YR1_Ep1_Store-Thumbnail_1920x1080.jpg"
        ));

        // 20. The Witness - Locking in, Adventure Time
        games.add(new Game(id++, "The Witness", 30, 60,
            Arrays.asList(EmotionalGoal.LOCKING_IN, EmotionalGoal.ADVENTURE_TIME),
            Interruptibility.HIGH,
            EnergyLevel.HIGH,
            Arrays.asList(TimeOfDay.MORNING, TimeOfDay.AFTERNOON),
            Arrays.asList(SocialPreference.SOLO),
            "Puzzle",
            "Beautiful island filled with environmental puzzles",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/210970/header.jpg"
        ));
    }

    // GET /games
    @GetMapping("/games")
    public List<Game> getAllGames() {
        System.out.println("=================================");
        System.out.println("GET /games called!");
        System.out.println("Total games: " + games.size());
        if (!games.isEmpty()) {
            Game firstGame = games.get(0);
            System.out.println("First game: " + firstGame.getName());
            System.out.println("Has emotionalGoals? " + (firstGame.getEmotionalGoals() != null));
            System.out.println("Has energyRequired? " + (firstGame.getEnergyRequired() != null));
        }
        System.out.println("=================================");
        return games;
    }
    
    // POST /recommendations with multi-dimensional scoring
    @PostMapping("/recommendations")
    public RecommendationResponse getRecommendation(@RequestBody RecommendationRequest request) {
        // Score all games
        Map<Game, ScoringResult> scoredGames = new HashMap<>();
        
        for (Game game : games) {
            ScoringResult result = scoreGame(game, request);
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

        // Get top 3
        Game topRecommendation = rankedGames.get(0).getKey();
        String topReason = rankedGames.get(0).getValue().reason;
        
        List<Game> alternatives = new ArrayList<>();
        List<String> alternativeReasons = new ArrayList<>();
        
        for (int i = 1; i < Math.min(3, rankedGames.size()); i++) {
            alternatives.add(rankedGames.get(i).getKey());
            alternativeReasons.add(rankedGames.get(i).getValue().reason);
        }

        return new RecommendationResponse(topRecommendation, alternatives, topReason, alternativeReasons);
    }

    private ScoringResult scoreGame(Game game, RecommendationRequest request) {
        double score = 0.0;
        List<String> matchReasons = new ArrayList<>();

        // 1. TIME MATCH (30%)
        if (game.getMinMinutes() > request.getAvailableMinutes()) {
            return new ScoringResult(0.0, "Too long for available time");
        }
        
        if (game.getMaxMinutes() <= request.getAvailableMinutes()) {
            score += 30.0;
            matchReasons.add("fits your " + request.getAvailableMinutes() + " min");
        } else if (game.getMinMinutes() <= request.getAvailableMinutes()) {
            score += 20.0;
            matchReasons.add("playable in " + request.getAvailableMinutes() + " min");
        }

        // 2. EMOTIONAL GOAL MATCH (25%)
        if (request.getDesiredEmotionalGoals() != null && !request.getDesiredEmotionalGoals().isEmpty()) {
            for (EmotionalGoal goal : request.getDesiredEmotionalGoals()) {
                if (game.hasEmotionalGoal(goal)) {
                    score += 25.0 / request.getDesiredEmotionalGoals().size();
                    matchReasons.add(goal.getDisplayName().toLowerCase());
                }
            }
        }

        // 3. INTERRUPTIBILITY MATCH (20%)
        if (request.getRequiredInterruptibility() != null) {
            if (game.getInterruptibility() == request.getRequiredInterruptibility()) {
                score += 20.0;
                matchReasons.add(game.getInterruptibility().getDisplayName().toLowerCase());
            } else if (game.getInterruptibility().ordinal() >= request.getRequiredInterruptibility().ordinal()) {
                score += 15.0;
                matchReasons.add("flexible pausing");
            } else {
                score -= 10.0;
            }
        }

        // 4. ENERGY LEVEL MATCH (15%)
        if (request.getCurrentEnergyLevel() != null) {
            if (game.getEnergyRequired() == request.getCurrentEnergyLevel()) {
                score += 15.0;
                matchReasons.add(game.getEnergyRequired().getDisplayName().toLowerCase() + " energy");
            } else if (game.getEnergyRequired().ordinal() < request.getCurrentEnergyLevel().ordinal()) {
                score += 12.0;
                matchReasons.add("light on energy");
            } else {
                score -= 5.0;
            }
        }

        // 5. TIME OF DAY MATCH (5%)
        if (request.getTimeOfDay() != null) {
            if (game.isSuitableForTimeOfDay(request.getTimeOfDay())) {
                score += 5.0;
                matchReasons.add("good for " + request.getTimeOfDay().getDisplayName().toLowerCase());
            }
        }

        // 6. SOCIAL PREFERENCE MATCH (5%)
        if (request.getSocialPreference() != null) {
            if (game.matchesSocialPreference(request.getSocialPreference())) {
                score += 5.0;
                matchReasons.add(request.getSocialPreference().getDisplayName().toLowerCase());
            } else {
                score -= 5.0;
            }
        }

        // 7. SATISFACTION BONUS (max 10%)
        double avg = getAverageSatisfaction(game.getId());
        if (game.getSessionCount() > 0) {
            score += (avg / 5.0) * 10.0;
            if (avg >= 4.0) {
                matchReasons.add("highly rated by you");
            }
        }

        String reason = "Perfect for: " + String.join(", ", matchReasons);
        return new ScoringResult(score, reason);
    }

    private RecommendationResponse createNoMatchResponse() {
        Game fallback = new Game();
        fallback.setId(0L);
        fallback.setName("No perfect match found");
        fallback.setDescription("Try adjusting your preferences");
        
        return new RecommendationResponse(fallback, new ArrayList<>(), 
            "No games match your current criteria", new ArrayList<>());
    }

    // POST /sessions/feedback
    @PostMapping("/sessions/feedback")
    public Map<String, String> submitFeedback(@RequestBody SessionFeedback feedback) {
        feedbackMap.computeIfAbsent(feedback.getGameId(), k -> new ArrayList<>())
                   .add(feedback.getSatisfactionScore());
        
        // Update game's average satisfaction
        games.stream()
            .filter(g -> g.getId().equals(feedback.getGameId()))
            .findFirst()
            .ifPresent(game -> {
                double avg = getAverageSatisfaction(game.getId());
                game.setAverageSatisfaction(avg);
                game.setSessionCount(feedbackMap.get(game.getId()).size());
            });
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Feedback recorded");
        return response;
    }

    private double getAverageSatisfaction(Long gameId) {
        List<Integer> scores = feedbackMap.get(gameId);
        if (scores == null || scores.isEmpty()) {
            return 3.0;
        }
        return scores.stream().mapToInt(Integer::intValue).average().orElse(3.0);
    }

    // Helper class for scoring
    private static class ScoringResult {
        double score;
        String reason;

        ScoringResult(double score, String reason) {
            this.score = score;
            this.reason = reason;
        }
    }
}
