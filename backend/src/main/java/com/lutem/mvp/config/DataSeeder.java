package com.lutem.mvp.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.repository.GameRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * Seeds local H2 database from production PostgreSQL via API.
 * Only runs with 'seed' profile: -Dspring.profiles.active=local,seed
 * 
 * Usage:
 *   1. Make sure production backend is running
 *   2. Run with: mvn spring-boot:run -Dspring-boot.run.profiles=local,seed
 *   3. Or set SPRING_PROFILES_ACTIVE=local,seed
 */
@Configuration
@Profile("seed")
public class DataSeeder {

    private static final String PROD_API_URL = "https://lutemprototype-production.up.railway.app";
    
    @Bean
    CommandLineRunner seedFromProduction(GameRepository gameRepository, 
                                          ObjectMapper objectMapper,
                                          Environment env) {
        return args -> {
            System.out.println("╔════════════════════════════════════════════════════════╗");
            System.out.println("║           LUTEM DATA SEEDER - Production Sync          ║");
            System.out.println("╚════════════════════════════════════════════════════════╝");
            
            // Check if we should skip (already have data)
            long existingCount = gameRepository.count();
            if (existingCount > 0) {
                System.out.println("⚠️  Local database already has " + existingCount + " games.");
                System.out.println("    To force re-seed, clear your H2 database first.");
                System.out.println("    Skipping seed process...");
                return;
            }
            
            try {
                System.out.println("\n📡 Fetching games from production: " + PROD_API_URL);
                
                RestTemplate restTemplate = new RestTemplate();
                String response = restTemplate.getForObject(
                    PROD_API_URL + "/games/all", 
                    String.class
                );
                
                List<Game> prodGames = objectMapper.readValue(
                    response, 
                    new TypeReference<List<Game>>() {}
                );
                
                System.out.println("✅ Retrieved " + prodGames.size() + " games from production\n");
                
                // Save each game (without ID to let H2 auto-generate)
                int saved = 0;
                int skipped = 0;
                
                for (Game prodGame : prodGames) {
                    try {
                        // Create fresh game without ID
                        Game localGame = new Game();
                        localGame.setName(prodGame.getName());
                        localGame.setMinMinutes(prodGame.getMinMinutes());
                        localGame.setMaxMinutes(prodGame.getMaxMinutes());
                        localGame.setEmotionalGoals(prodGame.getEmotionalGoals());
                        localGame.setInterruptibility(prodGame.getInterruptibility());
                        localGame.setEnergyRequired(prodGame.getEnergyRequired());
                        localGame.setAudioDependency(prodGame.getAudioDependency());
                        localGame.setContentRating(prodGame.getContentRating());
                        localGame.setNsfwLevel(prodGame.getNsfwLevel());
                        localGame.setBestTimeOfDay(prodGame.getBestTimeOfDay());
                        localGame.setSocialPreferences(prodGame.getSocialPreferences());
                        localGame.setGenres(prodGame.getGenres());
                        localGame.setDescription(prodGame.getDescription());
                        localGame.setImageUrl(prodGame.getImageUrl());
                        localGame.setStoreUrl(prodGame.getStoreUrl());
                        localGame.setUserRating(prodGame.getUserRating());
                        localGame.setAverageSatisfaction(prodGame.getAverageSatisfaction());
                        localGame.setSessionCount(prodGame.getSessionCount());
                        localGame.setSteamAppId(prodGame.getSteamAppId());
                        localGame.setTaggingSource(prodGame.getTaggingSource());
                        localGame.setTaggingConfidence(prodGame.getTaggingConfidence());
                        localGame.setRawgId(prodGame.getRawgId());
                        localGame.setSteamPositiveReviews(prodGame.getSteamPositiveReviews());
                        localGame.setSteamNegativeReviews(prodGame.getSteamNegativeReviews());
                        localGame.setMetacriticScore(prodGame.getMetacriticScore());
                        localGame.setPopularityScore(prodGame.getPopularityScore());
                        localGame.setSteamPlaytimeForever(prodGame.getSteamPlaytimeForever());
                        
                        gameRepository.save(localGame);
                        saved++;
                        
                        // Progress indicator
                        if (saved % 10 == 0) {
                            System.out.print(".");
                        }
                    } catch (Exception e) {
                        System.out.println("\n⚠️  Skipped: " + prodGame.getName() + " - " + e.getMessage());
                        skipped++;
                    }
                }
                
                System.out.println("\n");
                System.out.println("════════════════════════════════════════════════════════");
                System.out.println("✅ Seed complete!");
                System.out.println("   Saved:   " + saved + " games");
                System.out.println("   Skipped: " + skipped + " games");
                System.out.println("   Total in local DB: " + gameRepository.count());
                System.out.println("════════════════════════════════════════════════════════");
                
            } catch (Exception e) {
                System.err.println("\n❌ Seed failed: " + e.getMessage());
                System.err.println("   Make sure production backend is accessible.");
                e.printStackTrace();
            }
        };
    }
}
