package com.lutem.mvp.controller;

import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.TaggingSource;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.service.AITaggingService;
import com.lutem.mvp.service.AITaggingService.TaggingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin/games")
public class GameAdminController {
    
    @Autowired
    private GameRepository gameRepository;
    
    @Autowired
    private AITaggingService aiTaggingService;
    
    // Get all games (for admin view)
    @GetMapping
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }
    
    // Get single game by ID
    @GetMapping("/{id}")
    public Game getGameById(@PathVariable Long id) {
        return gameRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Game not found with id: " + id));
    }

    
    // Add single game
    @PostMapping
    public Game addGame(@RequestBody Game game) {
        game.setId(null);
        return gameRepository.save(game);
    }
    
    // Bulk import from JSON
    @PostMapping("/bulk")
    public List<Game> bulkImport(@RequestBody List<Game> games) {
        games.forEach(game -> game.setId(null));
        return gameRepository.saveAll(games);
    }
    
    // Update game
    @PutMapping("/{id}")
    public Game updateGame(@PathVariable Long id, @RequestBody Game game) {
        if (!gameRepository.existsById(id)) {
            throw new RuntimeException("Game not found with id: " + id);
        }
        game.setId(id);
        return gameRepository.save(game);
    }
    
    // Delete game
    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameRepository.deleteById(id);
    }
    
    // Delete all games (be careful!)
    @DeleteMapping("/all")
    public void deleteAllGames() {
        gameRepository.deleteAll();
    }

    
    // ========== AI TAGGING ENDPOINTS ==========
    
    /**
     * Get all games pending AI tagging.
     */
    @GetMapping("/pending")
    public List<Game> getPendingGames() {
        return gameRepository.findAllPendingTagging();
    }
    
    /**
     * Get game statistics by tagging source.
     */
    @GetMapping("/stats")
    public Map<String, Object> getGameStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = gameRepository.count();
        long pending = gameRepository.findByTaggingSource(TaggingSource.PENDING).size();
        long manual = gameRepository.findByTaggingSource(TaggingSource.MANUAL).size();
        long aiGenerated = gameRepository.findByTaggingSource(TaggingSource.AI_GENERATED).size();
        long userAdjusted = gameRepository.findByTaggingSource(TaggingSource.USER_ADJUSTED).size();
        long fullyTagged = gameRepository.findAllFullyTagged().size();
        
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("manual", manual);
        stats.put("aiGenerated", aiGenerated);
        stats.put("userAdjusted", userAdjusted);
        stats.put("fullyTagged", fullyTagged);
        stats.put("aiConfigured", aiTaggingService.isConfigured());
        
        return stats;
    }
    
    /**
     * Trigger AI tagging for pending games.
     * Body: { "gameIds": [1,2,3] } or { "all": true }
     */
    @PostMapping("/tag")
    public ResponseEntity<TaggingResult> tagGames(@RequestBody Map<String, Object> request) {
        if (!aiTaggingService.isConfigured()) {
            TaggingResult error = new TaggingResult();
            error.setTotal(0);
            return ResponseEntity.status(503).body(error);
        }
        
        List<Long> gameIds = null;
        
        // Check if specific game IDs provided
        if (request.containsKey("gameIds")) {
            @SuppressWarnings("unchecked")
            List<Number> ids = (List<Number>) request.get("gameIds");
            gameIds = new ArrayList<>();
            for (Number id : ids) {
                gameIds.add(id.longValue());
            }
        }
        // If "all" is true, gameIds stays null → tags all pending
        
        TaggingResult result = aiTaggingService.tagGames(gameIds);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Tag a single game by ID.
     */
    @PostMapping("/{id}/tag")
    public ResponseEntity<TaggingResult> tagSingleGame(@PathVariable Long id) {
        if (!aiTaggingService.isConfigured()) {
            TaggingResult error = new TaggingResult();
            error.setTotal(0);
            return ResponseEntity.status(503).body(error);
        }
        
        TaggingResult result = aiTaggingService.tagGames(List.of(id));
        return ResponseEntity.ok(result);
    }
}
