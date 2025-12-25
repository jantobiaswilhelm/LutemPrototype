package com.lutem.mvp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.dto.SteamImportResponse;
import com.lutem.mvp.dto.SteamImportResponse.*;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.User;
import com.lutem.mvp.model.UserLibrary;
import com.lutem.mvp.model.UserLibrary.LibrarySource;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.repository.UserLibraryRepository;
import com.lutem.mvp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for Steam API integration.
 * Handles fetching user's Steam library and matching against Lutem database.
 */
@Service
public class SteamService {
    
    private static final Logger logger = LoggerFactory.getLogger(SteamService.class);
    private static final String STEAM_API_BASE = "https://api.steampowered.com";
    
    @Value("${steam.api.key:}")
    private String steamApiKey;
    
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final UserLibraryRepository userLibraryRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public SteamService(GameRepository gameRepository, 
                        UserRepository userRepository,
                        UserLibraryRepository userLibraryRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.userLibraryRepository = userLibraryRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Check if Steam API is configured.
     */
    public boolean isConfigured() {
        return steamApiKey != null && !steamApiKey.isEmpty();
    }
    
    /**
     * Fetch and import user's Steam library.
     * 
     * @param steamId64 User's Steam ID (64-bit format)
     * @param firebaseUid Firebase UID of the authenticated user
     * @return Import results with matched and unmatched games
     */
    @Transactional
    public SteamImportResponse importSteamLibrary(String steamId64, String firebaseUid) {
        if (!isConfigured()) {
            throw new IllegalStateException("Steam API key not configured");
        }
        
        // Get or validate user
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Fetch games from Steam API
        List<SteamGame> steamGames = fetchOwnedGames(steamId64);
        
        if (steamGames.isEmpty()) {
            logger.warn("No games found for Steam ID: {}. Profile may be private.", steamId64);
            return createEmptyResponse(steamId64, "No games found. Make sure your Steam profile and game details are public.");
        }
        
        // Get all Steam App IDs from user's library
        List<Long> steamAppIds = steamGames.stream()
            .map(SteamGame::getAppId)
            .collect(Collectors.toList());
        
        // Find matching games in Lutem database
        List<Game> matchedLutemGames = gameRepository.findBySteamAppIdIn(steamAppIds);
        
        // Create lookup map for quick matching
        Map<Long, Game> lutemGamesByAppId = matchedLutemGames.stream()
            .collect(Collectors.toMap(Game::getSteamAppId, g -> g));
        
        // Separate matched and unmatched
        List<MatchedGame> matched = new ArrayList<>();
        List<UnmatchedGame> unmatched = new ArrayList<>();
        int alreadyInLibrary = 0;
        
        for (SteamGame steamGame : steamGames) {
            Game lutemGame = lutemGamesByAppId.get(steamGame.getAppId());
            
            if (lutemGame != null) {
                // Check if already in user's library
                boolean exists = userLibraryRepository
                    .existsByUserIdAndGameId(user.getId(), lutemGame.getId());
                
                if (!exists) {
                    // Add to user's library
                    UserLibrary libraryEntry = new UserLibrary(
                        user, lutemGame, steamGame.getAppId(),
                        steamGame.getPlaytimeForever(), steamGame.getPlaytime2Weeks()
                    );
                    userLibraryRepository.save(libraryEntry);
                } else {
                    alreadyInLibrary++;
                }
                
                matched.add(new MatchedGame(
                    steamGame.getAppId(),
                    steamGame.getName(),
                    lutemGame.getId(),
                    lutemGame.getImageUrl(),
                    steamGame.getPlaytimeForever(),
                    steamGame.getPlaytime2Weeks()
                ));
            } else {
                unmatched.add(new UnmatchedGame(
                    steamGame.getAppId(),
                    steamGame.getName(),
                    steamGame.getPlaytimeForever(),
                    steamGame.getPlaytime2Weeks(),
                    steamGame.getIconUrl()
                ));
            }
        }
        
        // Sort unmatched by playtime (most played first)
        unmatched.sort((a, b) -> {
            int playtimeA = a.getPlaytimeForever() != null ? a.getPlaytimeForever() : 0;
            int playtimeB = b.getPlaytimeForever() != null ? b.getPlaytimeForever() : 0;
            return Integer.compare(playtimeB, playtimeA);
        });
        
        ImportStats stats = new ImportStats(
            steamGames.size(),
            matched.size(),
            unmatched.size(),
            alreadyInLibrary
        );
        
        logger.info("Steam import for user {}: {} total, {} matched, {} unmatched, {} already in library",
            firebaseUid, stats.getTotal(), stats.getMatched(), stats.getUnmatched(), stats.getAlreadyInLibrary());
        
        return new SteamImportResponse(matched, unmatched, stats, steamId64);
    }
    
    /**
     * Fetch owned games from Steam API.
     */
    private List<SteamGame> fetchOwnedGames(String steamId64) {
        String url = String.format(
            "%s/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s&include_appinfo=true&include_played_free_games=true",
            STEAM_API_BASE, steamApiKey, steamId64
        );
        
        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode gamesNode = root.path("response").path("games");
            
            if (gamesNode.isMissingNode() || !gamesNode.isArray()) {
                return Collections.emptyList();
            }
            
            List<SteamGame> games = new ArrayList<>();
            for (JsonNode gameNode : gamesNode) {
                SteamGame game = new SteamGame();
                game.setAppId(gameNode.path("appid").asLong());
                game.setName(gameNode.path("name").asText());
                game.setPlaytimeForever(gameNode.path("playtime_forever").asInt(0));
                game.setPlaytime2Weeks(gameNode.has("playtime_2weeks") ? 
                    gameNode.path("playtime_2weeks").asInt() : null);
                
                // Build icon URL if available
                String iconHash = gameNode.path("img_icon_url").asText();
                if (!iconHash.isEmpty()) {
                    game.setIconUrl(String.format(
                        "https://media.steampowered.com/steamcommunity/public/images/apps/%d/%s.jpg",
                        game.getAppId(), iconHash
                    ));
                }
                
                games.add(game);
            }
            
            logger.debug("Fetched {} games from Steam for ID: {}", games.size(), steamId64);
            return games;
            
        } catch (HttpClientErrorException e) {
            logger.error("Steam API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch Steam library: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching Steam library", e);
            throw new RuntimeException("Failed to fetch Steam library: " + e.getMessage());
        }
    }
    
    /**
     * Create empty response for error cases.
     */
    private SteamImportResponse createEmptyResponse(String steamId, String message) {
        SteamImportResponse response = new SteamImportResponse(
            Collections.emptyList(),
            Collections.emptyList(),
            new ImportStats(0, 0, 0, 0),
            steamId
        );
        response.setMessage(message);
        return response;
    }
    
    /**
     * Internal DTO for Steam API response parsing.
     */
    private static class SteamGame {
        private Long appId;
        private String name;
        private Integer playtimeForever;
        private Integer playtime2Weeks;
        private String iconUrl;
        
        public Long getAppId() { return appId; }
        public void setAppId(Long appId) { this.appId = appId; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Integer getPlaytimeForever() { return playtimeForever; }
        public void setPlaytimeForever(Integer playtimeForever) { this.playtimeForever = playtimeForever; }
        
        public Integer getPlaytime2Weeks() { return playtime2Weeks; }
        public void setPlaytime2Weeks(Integer playtime2Weeks) { this.playtime2Weeks = playtime2Weeks; }
        
        public String getIconUrl() { return iconUrl; }
        public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    }
}
