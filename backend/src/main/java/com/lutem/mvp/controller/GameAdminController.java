package com.lutem.mvp.controller;

import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.TaggingSource;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.repository.GameSessionRepository;
import com.lutem.mvp.repository.UserLibraryRepository;
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
    private GameSessionRepository gameSessionRepository;
    
    @Autowired
    private UserLibraryRepository userLibraryRepository;
    
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
    
    // Wipe entire database (games + related data)
    @DeleteMapping("/wipe")
    public Map<String, String> wipeDatabase() {
        // Delete in order due to foreign keys
        userLibraryRepository.deleteAll();
        gameSessionRepository.deleteAll();
        gameRepository.deleteAll();
        Map<String, String> result = new HashMap<>();
        result.put("status", "wiped");
        return result;
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
     * Reset all games to PENDING status for re-tagging.
     */
    @PostMapping("/reset-tags")
    public Map<String, Object> resetAllTags() {
        List<Game> allGames = gameRepository.findAll();
        for (Game game : allGames) {
            game.setTaggingSource(TaggingSource.PENDING);
            game.setTaggingConfidence(null);
        }
        gameRepository.saveAll(allGames);
        
        Map<String, Object> result = new HashMap<>();
        result.put("reset", allGames.size());
        return result;
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
    
    // ========== IMPORT/SYNC ENDPOINT ==========
    
    /**
     * Import/sync games from another environment (e.g., production → local).
     * Matches by steamAppId (preferred) or name, updates tag-related fields.
     * 
     * Usage:
     *   1. Export: curl https://production/games > games.json
     *   2. Import: curl -X POST http://localhost:8080/admin/games/import -H "Content-Type: application/json" -d @games.json
     */
    @PostMapping("/import")
    public Map<String, Object> importGames(@RequestBody List<Game> games) {
        int updated = 0;
        int skipped = 0;
        int created = 0;
        List<String> errors = new ArrayList<>();
        
        for (Game incoming : games) {
            try {
                Game existing = null;
                
                // Try to match by steamAppId first (most reliable)
                if (incoming.getSteamAppId() != null) {
                    existing = gameRepository.findBySteamAppId(incoming.getSteamAppId()).orElse(null);
                }
                
                // Fall back to name match
                if (existing == null && incoming.getName() != null) {
                    existing = gameRepository.findByNameIgnoreCase(incoming.getName()).orElse(null);
                }
                
                if (existing != null) {
                    // Update tag-related fields only
                    boolean changed = false;
                    
                    if (incoming.getEmotionalGoals() != null && !incoming.getEmotionalGoals().isEmpty()) {
                        existing.setEmotionalGoals(incoming.getEmotionalGoals());
                        changed = true;
                    }
                    if (incoming.getInterruptibility() != null) {
                        existing.setInterruptibility(incoming.getInterruptibility());
                        changed = true;
                    }
                    if (incoming.getAudioDependency() != null) {
                        existing.setAudioDependency(incoming.getAudioDependency());
                        changed = true;
                    }
                    if (incoming.getContentRating() != null) {
                        existing.setContentRating(incoming.getContentRating());
                        changed = true;
                    }
                    if (incoming.getNsfwLevel() != null) {
                        existing.setNsfwLevel(incoming.getNsfwLevel());
                        changed = true;
                    }
                    if (incoming.getEnergyRequired() != null) {
                        existing.setEnergyRequired(incoming.getEnergyRequired());
                        changed = true;
                    }
                    if (incoming.getTaggingSource() != null) {
                        existing.setTaggingSource(incoming.getTaggingSource());
                        changed = true;
                    }
                    if (incoming.getTaggingConfidence() != null) {
                        existing.setTaggingConfidence(incoming.getTaggingConfidence());
                        changed = true;
                    }
                    
                    if (changed) {
                        gameRepository.save(existing);
                        updated++;
                    } else {
                        skipped++;
                    }
                } else {
                    // Game doesn't exist locally - optionally create it
                    incoming.setId(null);
                    gameRepository.save(incoming);
                    created++;
                }
            } catch (Exception e) {
                errors.add(incoming.getName() + ": " + e.getMessage());
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("updated", updated);
        result.put("created", created);
        result.put("skipped", skipped);
        result.put("errors", errors);
        result.put("total", games.size());
        
        return result;
    }
    
    // Debug: Check database counts
    @GetMapping("/debug/counts")
    public Map<String, Object> getDebugCounts() {
        Map<String, Object> counts = new HashMap<>();
        counts.put("games", gameRepository.count());
        counts.put("userLibrary", userLibraryRepository.count());
        return counts;
    }
}
