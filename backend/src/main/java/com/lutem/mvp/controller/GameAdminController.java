package com.lutem.mvp.controller;

import com.lutem.mvp.model.Game;
import com.lutem.mvp.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admin/games")
public class GameAdminController {
    
    @Autowired
    private GameRepository gameRepository;
    
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
        // Don't set ID - let database auto-generate
        game.setId(null);
        return gameRepository.save(game);
    }
    
    // Bulk import from JSON
    @PostMapping("/bulk")
    public List<Game> bulkImport(@RequestBody List<Game> games) {
        // Clear IDs to prevent conflicts
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
}
