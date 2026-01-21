package com.lutem.mvp.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.repository.GameRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    private static final String PROD_API_URL = "https://lutemprototype-production.up.railway.app";

    @Bean
    CommandLineRunner seedFromProduction(GameRepository gameRepository,
                                          ObjectMapper objectMapper,
                                          Environment env) {
        return args -> {
            logger.info("========== LUTEM DATA SEEDER - Production Sync ==========");

            // Check if we should skip (already have data)
            long existingCount = gameRepository.count();
            if (existingCount > 0) {
                logger.warn("Local database already has {} games. Skipping seed process.", existingCount);
                logger.info("To force re-seed, clear your H2 database first.");
                return;
            }

            try {
                logger.info("Fetching games from production: {}", PROD_API_URL);

                RestTemplate restTemplate = new RestTemplate();
                String response = restTemplate.getForObject(
                    PROD_API_URL + "/games/all",
                    String.class
                );

                List<Game> prodGames = objectMapper.readValue(
                    response,
                    new TypeReference<List<Game>>() {}
                );

                logger.info("Retrieved {} games from production", prodGames.size());

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

                        // Progress indicator every 50 games
                        if (saved % 50 == 0) {
                            logger.debug("Seeded {} games...", saved);
                        }
                    } catch (Exception e) {
                        logger.warn("Skipped: {} - {}", prodGame.getName(), e.getMessage());
                        skipped++;
                    }
                }

                logger.info("========== Seed complete! ==========");
                logger.info("Saved: {} games | Skipped: {} games | Total in local DB: {}",
                    saved, skipped, gameRepository.count());

            } catch (Exception e) {
                logger.error("Seed failed: {}. Make sure production backend is accessible.", e.getMessage(), e);
            }
        };
    }
}
