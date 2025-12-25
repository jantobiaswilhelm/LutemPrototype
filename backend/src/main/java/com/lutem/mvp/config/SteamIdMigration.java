package com.lutem.mvp.config;

import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.TaggingSource;
import com.lutem.mvp.repository.GameRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Migrates existing games to have Steam App IDs extracted from their store URLs.
 * Also sets taggingSource to MANUAL for all existing curated games.
 * 
 * Runs after GameDataLoader (Order 2 vs Order 1).
 */
@Component
@Order(2)
public class SteamIdMigration implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(SteamIdMigration.class);
    
    // Pattern to extract Steam App ID from store URL
    // e.g., https://store.steampowered.com/app/1135690/Unpacking/ -> 1135690
    private static final Pattern STEAM_APP_ID_PATTERN = 
        Pattern.compile("store\\.steampowered\\.com/app/(\\d+)");
    
    // Pattern for image URLs
    // e.g., https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg
    private static final Pattern STEAM_IMAGE_ID_PATTERN = 
        Pattern.compile("steam/apps/(\\d+)");
    
    private final GameRepository gameRepository;
    
    public SteamIdMigration(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        List<Game> games = gameRepository.findAll();
        int updated = 0;
        
        for (Game game : games) {
            boolean needsUpdate = false;
            
            // Set tagging source if not set
            if (game.getTaggingSource() == null) {
                game.setTaggingSource(TaggingSource.MANUAL);
                needsUpdate = true;
            }
            
            // Extract Steam App ID if not set
            if (game.getSteamAppId() == null) {
                Long steamAppId = extractSteamAppId(game);
                if (steamAppId != null) {
                    game.setSteamAppId(steamAppId);
                    needsUpdate = true;
                    logger.debug("Extracted Steam App ID {} for game: {}", steamAppId, game.getName());
                }
            }
            
            if (needsUpdate) {
                gameRepository.save(game);
                updated++;
            }
        }
        
        if (updated > 0) {
            logger.info("✅ Steam ID migration: Updated {} games with Steam App IDs and tagging source", updated);
        } else {
            logger.info("✓ Steam ID migration: All games already have Steam App IDs");
        }
        
        // Log stats
        long withSteamId = gameRepository.findBySteamAppIdNotNull().size();
        logger.info("📊 Games with Steam App ID: {}/{}", withSteamId, games.size());
    }
    
    /**
     * Extract Steam App ID from game's store URL or image URL.
     */
    private Long extractSteamAppId(Game game) {
        // Try store URL first
        if (game.getStoreUrl() != null) {
            Matcher matcher = STEAM_APP_ID_PATTERN.matcher(game.getStoreUrl());
            if (matcher.find()) {
                return Long.parseLong(matcher.group(1));
            }
        }
        
        // Fall back to image URL
        if (game.getImageUrl() != null) {
            Matcher matcher = STEAM_IMAGE_ID_PATTERN.matcher(game.getImageUrl());
            if (matcher.find()) {
                return Long.parseLong(matcher.group(1));
            }
        }
        
        return null;
    }
}
