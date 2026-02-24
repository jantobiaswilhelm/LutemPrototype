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
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

/**
 * Seeds/syncs local H2 database from production data.
 * Only runs with 'seed' profile: -Dspring.profiles.active=local,seed
 *
 * Reads from local games-seed.json first (fast, reliable).
 * Falls back to production API if local file is missing.
 *
 * Usage:
 *   Initial seed:    mvn spring-boot:run -Dspring-boot.run.profiles=local,seed
 *   Force re-sync:   mvn spring-boot:run -Dspring-boot.run.profiles=local,seed -Dspring-boot.run.arguments=--force-reseed
 *   Refresh seed file first:
 *     curl -s https://lutemprototype-production.up.railway.app/games/all > backend/src/main/resources/games-seed.json
 */
@Configuration
@Profile("seed")
public class DataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    private static final String PROD_API_URL = "https://lutemprototype-production.up.railway.app";
    private static final String SEED_FILE = "games-seed.json";

    @Bean
    CommandLineRunner seedFromProduction(GameRepository gameRepository,
                                          ObjectMapper objectMapper,
                                          Environment env) {
        return args -> {
            boolean forceReseed = "true".equalsIgnoreCase(env.getProperty("FORCE_RESEED"))
                || java.util.Arrays.asList(args).contains("--force-reseed");

            logger.info("========== LUTEM DATA SEEDER ==========");

            long existingCount = gameRepository.count();
            if (existingCount > 0 && !forceReseed) {
                logger.warn("Local database already has {} games. Skipping seed.", existingCount);
                logger.info("To force re-sync, run with --force-reseed or set FORCE_RESEED=true");
                return;
            }

            if (forceReseed && existingCount > 0) {
                logger.info("Force re-sync enabled. Will update existing and add new games.");
            }

            try {
                List<Game> prodGames = loadGames(objectMapper);
                logger.info("Loaded {} games", prodGames.size());

                int created = 0;
                int updated = 0;
                int skipped = 0;

                for (Game prodGame : prodGames) {
                    try {
                        Optional<Game> existingOpt = Optional.empty();
                        if (prodGame.getSteamAppId() != null) {
                            existingOpt = gameRepository.findBySteamAppId(prodGame.getSteamAppId());
                        }
                        if (existingOpt.isEmpty()) {
                            existingOpt = gameRepository.findByNameIgnoreCase(prodGame.getName());
                        }

                        Game localGame = existingOpt.orElse(new Game());
                        copyGameFields(prodGame, localGame);
                        gameRepository.save(localGame);

                        if (existingOpt.isPresent()) {
                            updated++;
                        } else {
                            created++;
                        }

                        if ((created + updated) % 100 == 0) {
                            logger.info("Progress: {} created, {} updated...", created, updated);
                        }
                    } catch (Exception e) {
                        logger.warn("Skipped: {} - {}", prodGame.getName(), e.getMessage());
                        skipped++;
                    }
                }

                logger.info("========== Sync complete! ==========");
                logger.info("Created: {} | Updated: {} | Skipped: {} | Total in local DB: {}",
                    created, updated, skipped, gameRepository.count());

            } catch (Exception e) {
                logger.error("Seed failed: {}", e.getMessage(), e);
            }
        };
    }

    private List<Game> loadGames(ObjectMapper objectMapper) throws Exception {
        // Try local seed file first (classpath)
        ClassPathResource seedResource = new ClassPathResource(SEED_FILE);
        if (seedResource.exists()) {
            logger.info("Loading from local seed file: {}", SEED_FILE);
            try (InputStream is = seedResource.getInputStream()) {
                return objectMapper.readValue(is, new TypeReference<>() {});
            }
        }

        // Fallback: fetch from production API
        logger.info("No local seed file found. Fetching from production: {}", PROD_API_URL);
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(PROD_API_URL + "/games/all", String.class);
        return objectMapper.readValue(response, new TypeReference<>() {});
    }

    private void copyGameFields(Game source, Game target) {
        target.setName(source.getName());
        target.setMinMinutes(source.getMinMinutes());
        target.setMaxMinutes(source.getMaxMinutes());
        target.setEmotionalGoals(source.getEmotionalGoals());
        target.setInterruptibility(source.getInterruptibility());
        target.setEnergyRequired(source.getEnergyRequired());
        target.setAudioDependency(source.getAudioDependency());
        target.setContentRating(source.getContentRating());
        target.setNsfwLevel(source.getNsfwLevel());
        target.setBestTimeOfDay(source.getBestTimeOfDay());
        target.setSocialPreferences(source.getSocialPreferences());
        target.setGenres(source.getGenres());
        target.setDescription(source.getDescription());
        target.setImageUrl(source.getImageUrl());
        target.setStoreUrl(source.getStoreUrl());
        target.setUserRating(source.getUserRating());
        target.setAverageSatisfaction(source.getAverageSatisfaction());
        target.setSessionCount(source.getSessionCount());
        target.setSteamAppId(source.getSteamAppId());
        target.setTaggingSource(source.getTaggingSource());
        target.setTaggingConfidence(source.getTaggingConfidence());
        target.setRawgId(source.getRawgId());
        target.setSteamPositiveReviews(source.getSteamPositiveReviews());
        target.setSteamNegativeReviews(source.getSteamNegativeReviews());
        target.setMetacriticScore(source.getMetacriticScore());
        target.setPopularityScore(source.getPopularityScore());
        target.setSteamPlaytimeForever(source.getSteamPlaytimeForever());
    }
}
