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
        
        // 10 hardcoded games
        games.add(new Game(1L, "Dead Cells", 15, 30, 
            Arrays.asList("challenge", "focus"), "easy"));
        games.add(new Game(2L, "Tetris Effect", 5, 20, 
            Arrays.asList("relax", "focus"), "easy"));
        games.add(new Game(3L, "Stardew Valley", 20, 60, 
            Arrays.asList("relax"), "easy"));
        games.add(new Game(4L, "Hades", 20, 45, 
            Arrays.asList("challenge", "focus"), "medium"));
        games.add(new Game(5L, "Portal 2", 30, 60, 
            Arrays.asList("challenge", "focus"), "hard"));
        games.add(new Game(6L, "Rocket League", 10, 30, 
            Arrays.asList("challenge"), "easy"));
        games.add(new Game(7L, "Slay the Spire", 20, 45, 
            Arrays.asList("challenge", "focus"), "easy"));
        games.add(new Game(8L, "Civ VI", 60, 180, 
            Arrays.asList("focus", "relax"), "hard"));
        games.add(new Game(9L, "Celeste", 20, 40, 
            Arrays.asList("challenge", "focus"), "medium"));
        games.add(new Game(10L, "Cozy Grove", 15, 30, 
            Arrays.asList("relax"), "easy"));
    }
    
    // GET /games
    @GetMapping("/games")
    public List<Game> getAllGames() {
        return games;
    }
    
    // POST /recommendations
    @PostMapping("/recommendations")
    public RecommendationResponse getRecommendation(
            @RequestBody RecommendationRequest request) {
        
        // Filter by time
        List<Game> suitableGames = games.stream()
            .filter(g -> g.getMinMinutes() <= request.getAvailableMinutes() 
                      && g.getMaxMinutes() >= request.getAvailableMinutes())
            .collect(Collectors.toList());
        
        // Filter by mood
        if (request.getDesiredMood() != null && !request.getDesiredMood().isEmpty()) {
            suitableGames = suitableGames.stream()
                .filter(g -> g.getMoodTags().contains(request.getDesiredMood().toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // If no games match, return random
        if (suitableGames.isEmpty()) {
            Game randomGame = games.get(new Random().nextInt(games.size()));
            return new RecommendationResponse(randomGame, 
                "No perfect match, but this might work!");
        }
        
        // Sort by average satisfaction (if available)
        suitableGames.sort((g1, g2) -> {
            double avg1 = getAverageSatisfaction(g1.getId());
            double avg2 = getAverageSatisfaction(g2.getId());
            return Double.compare(avg2, avg1);
        });
        
        Game recommended = suitableGames.get(0);
        String reason = String.format("Fits your %d minutes and %s mood", 
            request.getAvailableMinutes(), request.getDesiredMood());
        
        return new RecommendationResponse(recommended, reason);
    }
    
    // POST /sessions/feedback
    @PostMapping("/sessions/feedback")
    public Map<String, String> submitFeedback(@RequestBody SessionFeedback feedback) {
        feedbackMap.computeIfAbsent(feedback.getGameId(), k -> new ArrayList<>())
                   .add(feedback.getSatisfactionScore());
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Feedback recorded");
        return response;
    }
    
    // Helper method
    private double getAverageSatisfaction(Long gameId) {
        List<Integer> scores = feedbackMap.get(gameId);
        if (scores == null || scores.isEmpty()) {
            return 3.0; // neutral default
        }
        return scores.stream().mapToInt(Integer::intValue).average().orElse(3.0);
    }
}
