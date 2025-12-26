package com.lutem.mvp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for fetching game details from Steam Store API.
 * Provides enrichment data for AI tagging.
 */
@Service
public class SteamStoreService {
    
    private static final Logger logger = LoggerFactory.getLogger(SteamStoreService.class);
    private static final String STEAM_STORE_API = "https://store.steampowered.com/api/appdetails";
    
    // Simple in-memory cache to avoid hammering Steam API
    private final Map<Long, SteamAppDetails> cache = new ConcurrentHashMap<>();
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Rate limiting: track last request time
    private long lastRequestTime = 0;
    private static final long MIN_REQUEST_INTERVAL_MS = 1500; // 1.5 seconds between requests
    
    public SteamStoreService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Get Steam Store details for a game.
     * Returns cached data if available.
     * 
     * @param steamAppId Steam application ID
     * @return SteamAppDetails or null if not found/error
     */
    public SteamAppDetails getAppDetails(Long steamAppId) {
        // Check cache first
        if (cache.containsKey(steamAppId)) {
            logger.debug("Cache hit for Steam App ID: {}", steamAppId);
            return cache.get(steamAppId);
        }
        
        // Rate limiting
        enforceRateLimit();
        
        try {
            String url = String.format("%s?appids=%d", STEAM_STORE_API, steamAppId);
            logger.debug("Fetching Steam Store data for app: {}", steamAppId);
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode appNode = root.path(String.valueOf(steamAppId));
            
            if (!appNode.path("success").asBoolean(false)) {
                logger.warn("Steam Store API returned unsuccessful for app: {}", steamAppId);
                return null;
            }
            
            JsonNode data = appNode.path("data");
            SteamAppDetails details = parseAppDetails(steamAppId, data);
            
            // Cache the result
            if (details != null) {
                cache.put(steamAppId, details);
            }
            
            return details;
            
        } catch (HttpClientErrorException e) {
            logger.error("Steam Store API error for app {}: {}", steamAppId, e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Error fetching Steam Store data for app {}", steamAppId, e);
            return null;
        }
    }
    
    private void enforceRateLimit() {
        long now = System.currentTimeMillis();
        long elapsed = now - lastRequestTime;
        
        if (elapsed < MIN_REQUEST_INTERVAL_MS) {
            try {
                Thread.sleep(MIN_REQUEST_INTERVAL_MS - elapsed);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        lastRequestTime = System.currentTimeMillis();
    }
    
    private SteamAppDetails parseAppDetails(Long steamAppId, JsonNode data) {
        SteamAppDetails details = new SteamAppDetails();
        details.setSteamAppId(steamAppId);
        details.setName(data.path("name").asText(null));
        details.setShortDescription(data.path("short_description").asText(null));
        details.setDetailedDescription(data.path("detailed_description").asText(null));
        details.setHeaderImage(data.path("header_image").asText(null));
        
        // Parse genres
        List<String> genres = new ArrayList<>();
        JsonNode genresNode = data.path("genres");
        if (genresNode.isArray()) {
            for (JsonNode genre : genresNode) {
                genres.add(genre.path("description").asText());
            }
        }
        details.setGenres(genres);
        
        // Parse categories (Single-player, Multi-player, Co-op, etc.)
        List<String> categories = new ArrayList<>();
        JsonNode categoriesNode = data.path("categories");
        if (categoriesNode.isArray()) {
            for (JsonNode category : categoriesNode) {
                categories.add(category.path("description").asText());
            }
        }
        details.setCategories(categories);
        
        // Parse metacritic
        JsonNode metacriticNode = data.path("metacritic");
        if (!metacriticNode.isMissingNode()) {
            details.setMetacriticScore(metacriticNode.path("score").asInt(0));
        }
        
        // Parse recommendations count (total reviews)
        JsonNode recommendationsNode = data.path("recommendations");
        if (!recommendationsNode.isMissingNode()) {
            details.setRecommendationsTotal(recommendationsNode.path("total").asInt(0));
        }
        
        // Parse type (game, dlc, etc.)
        details.setType(data.path("type").asText("game"));
        
        // Parse release date
        JsonNode releaseDateNode = data.path("release_date");
        if (!releaseDateNode.isMissingNode()) {
            details.setReleaseDate(releaseDateNode.path("date").asText(null));
            details.setComingSoon(releaseDateNode.path("coming_soon").asBoolean(false));
        }
        
        return details;
    }
    
    /**
     * Clear the cache (for testing or memory management).
     */
    public void clearCache() {
        cache.clear();
    }
    
    /**
     * Get cache size.
     */
    public int getCacheSize() {
        return cache.size();
    }

    
    /**
     * DTO for Steam Store app details.
     */
    public static class SteamAppDetails {
        private Long steamAppId;
        private String name;
        private String shortDescription;
        private String detailedDescription;
        private String headerImage;
        private List<String> genres = new ArrayList<>();
        private List<String> categories = new ArrayList<>();
        private Integer metacriticScore;
        private Integer recommendationsTotal;
        private String type;
        private String releaseDate;
        private boolean comingSoon;
        
        // Getters and setters
        public Long getSteamAppId() { return steamAppId; }
        public void setSteamAppId(Long steamAppId) { this.steamAppId = steamAppId; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getShortDescription() { return shortDescription; }
        public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
        
        public String getDetailedDescription() { return detailedDescription; }
        public void setDetailedDescription(String detailedDescription) { this.detailedDescription = detailedDescription; }
        
        public String getHeaderImage() { return headerImage; }
        public void setHeaderImage(String headerImage) { this.headerImage = headerImage; }
        
        public List<String> getGenres() { return genres; }
        public void setGenres(List<String> genres) { this.genres = genres; }
        
        public List<String> getCategories() { return categories; }
        public void setCategories(List<String> categories) { this.categories = categories; }
        
        public Integer getMetacriticScore() { return metacriticScore; }
        public void setMetacriticScore(Integer metacriticScore) { this.metacriticScore = metacriticScore; }
        
        public Integer getRecommendationsTotal() { return recommendationsTotal; }
        public void setRecommendationsTotal(Integer recommendationsTotal) { this.recommendationsTotal = recommendationsTotal; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getReleaseDate() { return releaseDate; }
        public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }
        
        public boolean isComingSoon() { return comingSoon; }
        public void setComingSoon(boolean comingSoon) { this.comingSoon = comingSoon; }
        
        /**
         * Helper to check if this is likely a real game vs DLC/video/etc.
         */
        public boolean isGame() {
            return "game".equalsIgnoreCase(type);
        }
    }
}
