package com.lutem.mvp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.dto.SteamImportResponse;
import com.lutem.mvp.dto.SteamImportResponse.*;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.TaggingSource;
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
     * Resolve Steam input to a 64-bit Steam ID.
     * Accepts:
     * - Direct Steam ID (76561198012345678)
     * - Profile URL (https://steamcommunity.com/profiles/76561198012345678)
     * - Vanity URL (https://steamcommunity.com/id/gabelogannewell)
     * - Just the vanity name (gabelogannewell)
     * 
     * @param input User input (ID, URL, or vanity name)
     * @return 64-bit Steam ID
     */
    public String resolveSteamId(String input) {
        if (input == null || input.trim().isEmpty()) {
            throw new IllegalArgumentException("Steam ID or URL is required");
        }
        
        input = input.trim();
        
        // Pattern 1: Direct 64-bit Steam ID (17 digits)
        if (input.matches("^\\d{17}$")) {
            return input;
        }
        
        // Pattern 2: Profile URL with Steam ID
        // https://steamcommunity.com/profiles/76561198012345678
        java.util.regex.Pattern profilePattern = java.util.regex.Pattern.compile(
            "steamcommunity\\.com/profiles/(\\d{17})"
        );
        java.util.regex.Matcher profileMatcher = profilePattern.matcher(input);
        if (profileMatcher.find()) {
            return profileMatcher.group(1);
        }
        
        // Pattern 3: Vanity URL
        // https://steamcommunity.com/id/gabelogannewell
        java.util.regex.Pattern vanityPattern = java.util.regex.Pattern.compile(
            "steamcommunity\\.com/id/([a-zA-Z0-9_-]+)"
        );
        java.util.regex.Matcher vanityMatcher = vanityPattern.matcher(input);
        if (vanityMatcher.find()) {
            String vanityName = vanityMatcher.group(1);
            return resolveVanityUrl(vanityName);
        }
        
        // Pattern 4: Just the vanity name (no URL)
        if (input.matches("^[a-zA-Z0-9_-]+$") && !input.matches("^\\d+$")) {
            return resolveVanityUrl(input);
        }
        
        throw new IllegalArgumentException(
            "Invalid Steam ID format. Use your 17-digit Steam ID or profile URL."
        );
    }
    
    /**
     * Resolve a Steam vanity URL name to 64-bit Steam ID.
     */
    private String resolveVanityUrl(String vanityName) {
        if (!isConfigured()) {
            throw new IllegalStateException("Steam API key not configured");
        }
        
        String url = String.format(
            "%s/ISteamUser/ResolveVanityURL/v1/?key=%s&vanityurl=%s",
            STEAM_API_BASE, steamApiKey, vanityName
        );
        
        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode responseNode = root.path("response");
            
            int success = responseNode.path("success").asInt();
            if (success == 1) {
                String steamId = responseNode.path("steamid").asText();
                logger.debug("Resolved vanity URL '{}' to Steam ID: {}", vanityName, steamId);
                return steamId;
            } else {
                String message = responseNode.path("message").asText("Profile not found");
                throw new IllegalArgumentException("Could not find Steam profile: " + vanityName + ". " + message);
            }
        } catch (HttpClientErrorException e) {
            logger.error("Steam API error resolving vanity URL: {}", e.getMessage());
            throw new RuntimeException("Failed to resolve Steam profile: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw e; // Re-throw our own exceptions
        } catch (Exception e) {
            logger.error("Error resolving vanity URL", e);
            throw new RuntimeException("Failed to resolve Steam profile: " + e.getMessage());
        }
    }
    
    /**
     * Get player profile summary from Steam API.
     * 
     * @param steamId64 Steam 64-bit ID
     * @return Map containing profile data (personaname, avatarfull, etc.)
     */
    public Map<String, String> getPlayerSummary(String steamId64) {
        if (!isConfigured()) {
            throw new IllegalStateException("Steam API key not configured");
        }
        
        String url = String.format(
            "%s/ISteamUser/GetPlayerSummaries/v2/?key=%s&steamids=%s",
            STEAM_API_BASE, steamApiKey, steamId64
        );
        
        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode players = root.path("response").path("players");
            
            if (players.isArray() && players.size() > 0) {
                JsonNode player = players.get(0);
                Map<String, String> profile = new HashMap<>();
                profile.put("steamid", player.path("steamid").asText());
                profile.put("personaname", player.path("personaname").asText());
                profile.put("avatar", player.path("avatar").asText());
                profile.put("avatarmedium", player.path("avatarmedium").asText());
                profile.put("avatarfull", player.path("avatarfull").asText());
                profile.put("profileurl", player.path("profileurl").asText());
                return profile;
            }
            
            return Collections.emptyMap();
            
        } catch (Exception e) {
            logger.error("Failed to fetch player summary for {}: {}", steamId64, e.getMessage());
            return Collections.emptyMap();
        }
    }
    
    /**
     * Fetch and import user's Steam library by user ID.
     * 
     * @param steamId64 User's Steam ID (64-bit format)
     * @param userId Database ID of the authenticated user
     * @return Import results with matched and unmatched games
     */
    @Transactional
    public SteamImportResponse importSteamLibraryByUserId(String steamId64, Long userId) {
        if (!isConfigured()) {
            throw new IllegalStateException("Steam API key not configured");
        }
        
        // Get user by ID
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return doImportSteamLibrary(steamId64, user);
    }
    
    /**
     * Fetch and import user's Steam library.
     * 
     * @param steamId64 User's Steam ID (64-bit format)
     * @param firebaseUid Firebase UID of the authenticated user
     * @return Import results with matched and unmatched games
     * @deprecated Use importSteamLibraryByUserId instead
     */
    @Deprecated
    @Transactional
    public SteamImportResponse importSteamLibrary(String steamId64, String firebaseUid) {
        if (!isConfigured()) {
            throw new IllegalStateException("Steam API key not configured");
        }
        
        // Get or validate user
        User user = userRepository.findByGoogleId(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return doImportSteamLibrary(steamId64, user);
    }
    
    /**
     * Internal method to import Steam library for a user.
     * Phase S-Import: Now creates Game entities for ALL Steam games (matched and unmatched).
     */
    private SteamImportResponse doImportSteamLibrary(String steamId64, User user) {
        
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
        
        // Find matching games in Lutem database (both curated and previously imported)
        List<Game> existingLutemGames = gameRepository.findBySteamAppIdIn(steamAppIds);
        
        // Create lookup map for quick matching
        Map<Long, Game> lutemGamesByAppId = existingLutemGames.stream()
            .collect(Collectors.toMap(Game::getSteamAppId, g -> g));
        
        // Separate matched and unmatched, track newly created
        List<MatchedGame> matched = new ArrayList<>();
        List<UnmatchedGame> unmatched = new ArrayList<>();
        int alreadyInLibrary = 0;
        int newlyCreated = 0;
        
        for (SteamGame steamGame : steamGames) {
            Game lutemGame = lutemGamesByAppId.get(steamGame.getAppId());
            
            if (lutemGame != null) {
                // Game already exists in Lutem database (curated or previously imported)
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
                // Phase S-Import: Create new Game entity for unmatched Steam games
                // Check one more time it doesn't exist (race condition protection)
                if (!gameRepository.existsBySteamAppId(steamGame.getAppId())) {
                    Game newGame = new Game();
                    newGame.setName(steamGame.getName());
                    newGame.setSteamAppId(steamGame.getAppId());
                    newGame.setImageUrl("https://cdn.cloudflare.steamstatic.com/steam/apps/" 
                        + steamGame.getAppId() + "/header.jpg");
                    newGame.setStoreUrl("https://store.steampowered.com/app/" 
                        + steamGame.getAppId());
                    newGame.setTaggingSource(TaggingSource.PENDING);
                    newGame.setSteamPlaytimeForever(steamGame.getPlaytimeForever());
                    // Leave all Lutem attributes (emotionalGoals, interruptibility, etc.) as null/empty
                    
                    newGame = gameRepository.save(newGame);
                    newlyCreated++;
                    
                    // Create UserLibrary entry linking user to the new game
                    UserLibrary libraryEntry = new UserLibrary(
                        user, newGame, steamGame.getAppId(),
                        steamGame.getPlaytimeForever(), steamGame.getPlaytime2Weeks()
                    );
                    userLibraryRepository.save(libraryEntry);
                    
                    // Add to matched list since it's now in the database
                    matched.add(new MatchedGame(
                        steamGame.getAppId(),
                        steamGame.getName(),
                        newGame.getId(),
                        newGame.getImageUrl(),
                        steamGame.getPlaytimeForever(),
                        steamGame.getPlaytime2Weeks()
                    ));
                    
                    logger.debug("Created new PENDING game: {} (Steam App ID: {})", 
                        steamGame.getName(), steamGame.getAppId());
                } else {
                    // Game was created by another concurrent request, fetch and link
                    Game existingGame = gameRepository.findBySteamAppId(steamGame.getAppId()).orElse(null);
                    if (existingGame != null) {
                        boolean exists = userLibraryRepository
                            .existsByUserIdAndGameId(user.getId(), existingGame.getId());
                        if (!exists) {
                            UserLibrary libraryEntry = new UserLibrary(
                                user, existingGame, steamGame.getAppId(),
                                steamGame.getPlaytimeForever(), steamGame.getPlaytime2Weeks()
                            );
                            userLibraryRepository.save(libraryEntry);
                        }
                        matched.add(new MatchedGame(
                            steamGame.getAppId(),
                            steamGame.getName(),
                            existingGame.getId(),
                            existingGame.getImageUrl(),
                            steamGame.getPlaytimeForever(),
                            steamGame.getPlaytime2Weeks()
                        ));
                    }
                }
                
                // Still track in unmatched for response (shows which games need AI tagging)
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
            alreadyInLibrary,
            newlyCreated
        );
        
        logger.info("Steam import for user {}: {} total, {} matched, {} unmatched, {} already in library, {} newly created",
            user.getId(), stats.getTotal(), stats.getMatched(), stats.getUnmatched(), 
            stats.getAlreadyInLibrary(), stats.getNewlyCreated());
        
        SteamImportResponse response = new SteamImportResponse(matched, unmatched, stats, steamId64);
        
        // Update message to reflect newly imported games
        if (newlyCreated > 0) {
            response.setMessage(String.format(
                "Imported %d games! %d matched with Lutem database, %d new games imported (pending AI tagging).",
                stats.getTotal(), stats.getMatched() - newlyCreated, newlyCreated));
        }
        
        return response;
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
