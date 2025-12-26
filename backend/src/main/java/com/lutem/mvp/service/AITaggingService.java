package com.lutem.mvp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.model.*;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.service.SteamStoreService.SteamAppDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service for AI-powered game tagging using Claude API.
 * Analyzes game information and determines Lutem attributes.
 */
@Service
public class AITaggingService {
    
    private static final Logger logger = LoggerFactory.getLogger(AITaggingService.class);
    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    
    @Value("${anthropic.api.key:}")
    private String anthropicApiKey;
    
    @Value("${anthropic.model:claude-3-haiku-20240307}")
    private String anthropicModel;
    
    private final GameRepository gameRepository;
    private final SteamStoreService steamStoreService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public AITaggingService(GameRepository gameRepository, SteamStoreService steamStoreService) {
        this.gameRepository = gameRepository;
        this.steamStoreService = steamStoreService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Check if AI tagging service is configured.
     */
    public boolean isConfigured() {
        return anthropicApiKey != null && !anthropicApiKey.isEmpty();
    }
    
    /**
     * Tag a batch of pending games.
     * 
     * @param gameIds List of game IDs to tag, or null to tag all pending
     * @return TaggingResult with success/failure counts
     */
    @Transactional
    public TaggingResult tagGames(List<Long> gameIds) {
        if (!isConfigured()) {
            throw new IllegalStateException("Anthropic API key not configured");
        }
        
        List<Game> gamesToTag;
        if (gameIds != null && !gameIds.isEmpty()) {
            gamesToTag = gameRepository.findAllById(gameIds);
        } else {
            gamesToTag = gameRepository.findAllPendingTagging();
        }
        
        TaggingResult result = new TaggingResult();
        result.setTotal(gamesToTag.size());
        
        for (Game game : gamesToTag) {
            try {
                boolean success = tagSingleGame(game);
                if (success) {
                    result.incrementSuccess();
                    result.addTaggedGame(game);
                } else {
                    result.incrementFailed();
                    result.addFailedGame(game.getId(), "AI tagging returned no results");
                }
            } catch (Exception e) {
                logger.error("Failed to tag game {}: {}", game.getName(), e.getMessage());
                result.incrementFailed();
                result.addFailedGame(game.getId(), e.getMessage());
            }
        }
        
        logger.info("AI Tagging complete: {} success, {} failed out of {} total",
            result.getSuccessCount(), result.getFailedCount(), result.getTotal());
        
        return result;
    }

    
    /**
     * Tag a single game using AI.
     */
    private boolean tagSingleGame(Game game) {
        logger.debug("Tagging game: {} (Steam App ID: {})", game.getName(), game.getSteamAppId());
        
        // Get enrichment data from Steam Store API
        SteamAppDetails storeDetails = null;
        if (game.getSteamAppId() != null) {
            storeDetails = steamStoreService.getAppDetails(game.getSteamAppId());
        }
        
        // Build prompt
        String prompt = buildPrompt(game, storeDetails);
        
        // Call Claude API
        GameAttributes attributes = callClaudeAPI(prompt);
        
        if (attributes == null) {
            return false;
        }
        
        // Update game with AI-generated attributes
        applyAttributes(game, attributes, storeDetails);
        gameRepository.save(game);
        
        logger.info("✅ Tagged game: {} - Goals: {}, Energy: {}, Interruptibility: {}",
            game.getName(), attributes.getEmotionalGoals(), 
            attributes.getEnergyRequired(), attributes.getInterruptibility());
        
        return true;
    }
    
    private String buildPrompt(Game game, SteamAppDetails storeDetails) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a gaming expert for Lutem, matching games to players' moods and time.\n\n");
        
        prompt.append("GAME: ").append(game.getName()).append("\n");
        if (storeDetails != null) {
            if (storeDetails.getShortDescription() != null) {
                prompt.append("DESC: ").append(storeDetails.getShortDescription()).append("\n");
            }
            if (!storeDetails.getGenres().isEmpty()) {
                prompt.append("GENRES: ").append(String.join(", ", storeDetails.getGenres())).append("\n");
            }
            if (!storeDetails.getCategories().isEmpty()) {
                prompt.append("CATEGORIES: ").append(String.join(", ", storeDetails.getCategories())).append("\n");
            }
        }
        
        prompt.append("\n═══ ATTRIBUTES TO DETERMINE ═══\n\n");
        
        // 1. Emotional Goals with examples
        prompt.append("1. emotionalGoals (pick 1-3):\n");
        prompt.append("   UNWIND - Stress relief, calming (Stardew Valley, Animal Crossing, Flower)\n");
        prompt.append("   RECHARGE - Light mental break (Tetris, Mini Metro, casual puzzles)\n");
        prompt.append("   LOCKING_IN - Deep flow state (Factorio, Civilization, programming games)\n");
        prompt.append("   CHALLENGE - Skill testing, intensity (Dark Souls, competitive shooters)\n");
        prompt.append("   ADVENTURE_TIME - Exploration, discovery (Zelda, Skyrim, Outer Wilds)\n");
        prompt.append("   PROGRESS_ORIENTED - Quick wins, achievements (roguelikes, incremental games)\n\n");
        
        // 2. Interruptibility with scenarios
        prompt.append("2. interruptibility:\n");
        prompt.append("   HIGH - Stop ANY moment (turn-based, pause+save anywhere, Slay the Spire)\n");
        prompt.append("   MEDIUM - Need checkpoints/save points (most singleplayer, Hollow Knight)\n");
        prompt.append("   LOW - Can't stop easily (online competitive, long cutscenes, MMO raids)\n\n");
        
        // 3. Energy with user states
        prompt.append("3. energyRequired:\n");
        prompt.append("   LOW - Couch mode, half-asleep OK (farming sims, walking sims)\n");
        prompt.append("   MEDIUM - Alert but relaxed (RPGs, strategy, adventure)\n");
        prompt.append("   HIGH - Sharp focus needed (competitive FPS, bullet hells, rhythm games)\n\n");
        
        // 4. Time of day
        prompt.append("4. bestTimeOfDay (pick 1-3): MORNING, MIDDAY, AFTERNOON, EVENING, LATE_NIGHT, ANY\n");
        prompt.append("   (Consider: horror→LATE_NIGHT, relaxing→EVENING, competitive→ANY)\n\n");
        
        // 5. Social
        prompt.append("5. socialPreferences (pick 1-2): SOLO, COOP, COMPETITIVE, BOTH\n\n");
        
        // 6-7. Time
        prompt.append("6. minMinutes: Minimum meaningful session (5-180)\n");
        prompt.append("7. maxMinutes: Before fatigue sets in (15-480)\n\n");
        
        // 8. Audio dependency (NEW)
        prompt.append("8. audioDependency:\n");
        prompt.append("   REQUIRED - Need sound (horror, rhythm, story-heavy with voice acting)\n");
        prompt.append("   HELPFUL - Better with sound but playable muted (most games)\n");
        prompt.append("   OPTIONAL - Fine muted, podcast-friendly (strategy, idle, turn-based)\n\n");
        
        // 9. Content rating (NEW)
        prompt.append("9. contentRating:\n");
        prompt.append("   EVERYONE - All ages (Mario, Minecraft, puzzle games)\n");
        prompt.append("   TEEN - Mild violence/language (Fortnite, most JRPGs)\n");
        prompt.append("   MATURE - Blood, strong language (Call of Duty, Witcher)\n");
        prompt.append("   ADULT - Extreme violence/gore (Doom, Mortal Kombat)\n\n");
        
        // 10. NSFW level (NEW)
        prompt.append("10. nsfwLevel:\n");
        prompt.append("   NONE - No sexual content\n");
        prompt.append("   SUGGESTIVE - Fanservice, revealing outfits, innuendo\n");
        prompt.append("   EXPLICIT - Sexual content, nudity, adult scenes\n\n");
        
        prompt.append("═══ RESPOND WITH JSON ONLY ═══\n");
        prompt.append("{\"emotionalGoals\":[],\"interruptibility\":\"\",\"energyRequired\":\"\",");
        prompt.append("\"bestTimeOfDay\":[],\"socialPreferences\":[],\"minMinutes\":0,\"maxMinutes\":0,");
        prompt.append("\"audioDependency\":\"\",\"contentRating\":\"\",\"nsfwLevel\":\"\",\"confidence\":0.0}");
        
        return prompt.toString();
    }

    
    private GameAttributes callClaudeAPI(String prompt) {
        try {
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", anthropicModel);
            requestBody.put("max_tokens", 500);
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));
            
            // Build headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", anthropicApiKey);
            headers.set("anthropic-version", "2023-06-01");
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            // Make request
            ResponseEntity<String> response = restTemplate.exchange(
                ANTHROPIC_API_URL, HttpMethod.POST, entity, String.class
            );
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("Claude API error: {}", response.getStatusCode());
                return null;
            }
            
            // Parse response
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode contentArray = root.path("content");
            
            if (contentArray.isArray() && contentArray.size() > 0) {
                String text = contentArray.get(0).path("text").asText();
                return parseGameAttributes(text);
            }
            
            return null;
            
        } catch (Exception e) {
            logger.error("Claude API call failed: {}", e.getMessage());
            return null;
        }
    }
    
    private GameAttributes parseGameAttributes(String jsonText) {
        try {
            // Clean up potential markdown formatting
            jsonText = jsonText.trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            }
            if (jsonText.startsWith("```")) {
                jsonText = jsonText.substring(3);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            jsonText = jsonText.trim();
            
            JsonNode json = objectMapper.readTree(jsonText);
            GameAttributes attrs = new GameAttributes();
            
            // Parse emotional goals
            JsonNode goalsNode = json.path("emotionalGoals");
            if (goalsNode.isArray()) {
                List<String> goals = new ArrayList<>();
                for (JsonNode goal : goalsNode) {
                    goals.add(goal.asText());
                }
                attrs.setEmotionalGoals(goals);
            }
            
            attrs.setInterruptibility(json.path("interruptibility").asText(null));
            attrs.setEnergyRequired(json.path("energyRequired").asText(null));
            
            // Parse time of day
            JsonNode todNode = json.path("bestTimeOfDay");
            if (todNode.isArray()) {
                List<String> times = new ArrayList<>();
                for (JsonNode time : todNode) {
                    times.add(time.asText());
                }
                attrs.setBestTimeOfDay(times);
            }
            
            // Parse social preferences
            JsonNode socialNode = json.path("socialPreferences");
            if (socialNode.isArray()) {
                List<String> social = new ArrayList<>();
                for (JsonNode pref : socialNode) {
                    social.add(pref.asText());
                }
                attrs.setSocialPreferences(social);
            }
            
            attrs.setMinMinutes(json.path("minMinutes").asInt(15));
            attrs.setMaxMinutes(json.path("maxMinutes").asInt(60));
            attrs.setConfidence((float) json.path("confidence").asDouble(0.7));
            
            // New attributes
            attrs.setAudioDependency(json.path("audioDependency").asText(null));
            attrs.setContentRating(json.path("contentRating").asText(null));
            attrs.setNsfwLevel(json.path("nsfwLevel").asText(null));
            
            return attrs;
            
        } catch (Exception e) {
            logger.error("Failed to parse AI response: {}", e.getMessage());
            return null;
        }
    }

    
    private void applyAttributes(Game game, GameAttributes attrs, SteamAppDetails storeDetails) {
        // Emotional goals
        if (attrs.getEmotionalGoals() != null) {
            List<EmotionalGoal> goals = new ArrayList<>();
            for (String g : attrs.getEmotionalGoals()) {
                try {
                    goals.add(EmotionalGoal.valueOf(g.toUpperCase().replace("-", "_")));
                } catch (IllegalArgumentException e) {
                    logger.warn("Unknown emotional goal: {}", g);
                }
            }
            game.setEmotionalGoals(goals);
        }
        
        // Interruptibility
        if (attrs.getInterruptibility() != null) {
            try {
                game.setInterruptibility(Interruptibility.valueOf(attrs.getInterruptibility().toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.warn("Unknown interruptibility: {}", attrs.getInterruptibility());
            }
        }
        
        // Energy required
        if (attrs.getEnergyRequired() != null) {
            try {
                game.setEnergyRequired(EnergyLevel.valueOf(attrs.getEnergyRequired().toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.warn("Unknown energy level: {}", attrs.getEnergyRequired());
            }
        }
        
        // Best time of day
        if (attrs.getBestTimeOfDay() != null) {
            List<TimeOfDay> times = new ArrayList<>();
            for (String t : attrs.getBestTimeOfDay()) {
                try {
                    times.add(TimeOfDay.valueOf(t.toUpperCase().replace("-", "_")));
                } catch (IllegalArgumentException e) {
                    logger.warn("Unknown time of day: {}", t);
                }
            }
            game.setBestTimeOfDay(times);
        }
        
        // Social preferences
        if (attrs.getSocialPreferences() != null) {
            List<SocialPreference> social = new ArrayList<>();
            for (String s : attrs.getSocialPreferences()) {
                try {
                    social.add(SocialPreference.valueOf(s.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    logger.warn("Unknown social preference: {}", s);
                }
            }
            game.setSocialPreferences(social);
        }
        
        // Time estimates
        game.setMinMinutes(Math.max(5, Math.min(180, attrs.getMinMinutes())));
        game.setMaxMinutes(Math.max(15, Math.min(480, attrs.getMaxMinutes())));
        
        // Audio dependency (NEW)
        if (attrs.getAudioDependency() != null) {
            try {
                game.setAudioDependency(AudioDependency.valueOf(attrs.getAudioDependency().toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.warn("Unknown audio dependency: {}", attrs.getAudioDependency());
                game.setAudioDependency(AudioDependency.HELPFUL); // Safe default
            }
        }
        
        // Content rating (NEW)
        if (attrs.getContentRating() != null) {
            try {
                game.setContentRating(ContentRating.valueOf(attrs.getContentRating().toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.warn("Unknown content rating: {}", attrs.getContentRating());
                game.setContentRating(ContentRating.TEEN); // Safe default
            }
        }
        
        // NSFW level (NEW)
        if (attrs.getNsfwLevel() != null) {
            try {
                game.setNsfwLevel(NsfwLevel.valueOf(attrs.getNsfwLevel().toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.warn("Unknown NSFW level: {}", attrs.getNsfwLevel());
                game.setNsfwLevel(NsfwLevel.NONE); // Safe default
            }
        }
        
        // Tagging metadata
        game.setTaggingSource(TaggingSource.AI_GENERATED);
        game.setTaggingConfidence(attrs.getConfidence());
        
        // Enrich with Steam Store data
        if (storeDetails != null) {
            if (storeDetails.getShortDescription() != null && game.getDescription() == null) {
                game.setDescription(storeDetails.getShortDescription());
            }
            if (storeDetails.getHeaderImage() != null) {
                game.setImageUrl(storeDetails.getHeaderImage());
            }
            if (!storeDetails.getGenres().isEmpty() && game.getGenres().isEmpty()) {
                game.setGenres(storeDetails.getGenres());
            }
        }
    }

    
    // ========== DTOs ==========
    
    /**
     * Result of a batch tagging operation.
     */
    public static class TaggingResult {
        private int total;
        private int successCount;
        private int failedCount;
        private List<TaggedGameInfo> taggedGames = new ArrayList<>();
        private Map<Long, String> failedGames = new HashMap<>();
        
        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
        
        public int getSuccessCount() { return successCount; }
        public void incrementSuccess() { this.successCount++; }
        
        public int getFailedCount() { return failedCount; }
        public void incrementFailed() { this.failedCount++; }
        
        public List<TaggedGameInfo> getTaggedGames() { return taggedGames; }
        public void addTaggedGame(Game game) {
            this.taggedGames.add(new TaggedGameInfo(
                game.getId(), game.getName(), game.getSteamAppId(),
                game.getTaggingConfidence()
            ));
        }
        
        public Map<Long, String> getFailedGames() { return failedGames; }
        public void addFailedGame(Long gameId, String reason) {
            this.failedGames.put(gameId, reason);
        }
    }
    
    /**
     * Info about a successfully tagged game.
     */
    public static class TaggedGameInfo {
        private Long id;
        private String name;
        private Long steamAppId;
        private Float confidence;
        
        public TaggedGameInfo(Long id, String name, Long steamAppId, Float confidence) {
            this.id = id;
            this.name = name;
            this.steamAppId = steamAppId;
            this.confidence = confidence;
        }
        
        public Long getId() { return id; }
        public String getName() { return name; }
        public Long getSteamAppId() { return steamAppId; }
        public Float getConfidence() { return confidence; }
    }
    
    /**
     * Parsed game attributes from AI response.
     */
    private static class GameAttributes {
        private List<String> emotionalGoals;
        private String interruptibility;
        private String energyRequired;
        private List<String> bestTimeOfDay;
        private List<String> socialPreferences;
        private int minMinutes;
        private int maxMinutes;
        private float confidence;
        private String audioDependency;
        private String contentRating;
        private String nsfwLevel;
        
        public List<String> getEmotionalGoals() { return emotionalGoals; }
        public void setEmotionalGoals(List<String> emotionalGoals) { this.emotionalGoals = emotionalGoals; }
        
        public String getInterruptibility() { return interruptibility; }
        public void setInterruptibility(String interruptibility) { this.interruptibility = interruptibility; }
        
        public String getEnergyRequired() { return energyRequired; }
        public void setEnergyRequired(String energyRequired) { this.energyRequired = energyRequired; }
        
        public List<String> getBestTimeOfDay() { return bestTimeOfDay; }
        public void setBestTimeOfDay(List<String> bestTimeOfDay) { this.bestTimeOfDay = bestTimeOfDay; }
        
        public List<String> getSocialPreferences() { return socialPreferences; }
        public void setSocialPreferences(List<String> socialPreferences) { this.socialPreferences = socialPreferences; }
        
        public int getMinMinutes() { return minMinutes; }
        public void setMinMinutes(int minMinutes) { this.minMinutes = minMinutes; }
        
        public int getMaxMinutes() { return maxMinutes; }
        public void setMaxMinutes(int maxMinutes) { this.maxMinutes = maxMinutes; }
        
        public float getConfidence() { return confidence; }
        public void setConfidence(float confidence) { this.confidence = confidence; }
        
        public String getAudioDependency() { return audioDependency; }
        public void setAudioDependency(String audioDependency) { this.audioDependency = audioDependency; }
        
        public String getContentRating() { return contentRating; }
        public void setContentRating(String contentRating) { this.contentRating = contentRating; }
        
        public String getNsfwLevel() { return nsfwLevel; }
        public void setNsfwLevel(String nsfwLevel) { this.nsfwLevel = nsfwLevel; }
    }
}
