package com.lutem.mvp.dto;

import java.util.List;

/**
 * Response DTO for Steam library import operation.
 */
public class SteamImportResponse {
    
    private List<MatchedGame> matched;
    private List<UnmatchedGame> unmatched;
    private ImportStats stats;
    private String steamId;
    private String message;
    
    // Constructors
    public SteamImportResponse() {}
    
    public SteamImportResponse(List<MatchedGame> matched, List<UnmatchedGame> unmatched, 
                                ImportStats stats, String steamId) {
        this.matched = matched;
        this.unmatched = unmatched;
        this.stats = stats;
        this.steamId = steamId;
        this.message = String.format("Found %d of your %d Steam games in Lutem's curated library!", 
                                     stats.getMatched(), stats.getTotal());
    }
    
    // Inner classes
    public static class MatchedGame {
        private Long steamAppId;
        private String name;
        private Long lutemGameId;
        private String imageUrl;
        private Integer playtimeForever;
        private Integer playtime2Weeks;
        
        public MatchedGame() {}
        
        public MatchedGame(Long steamAppId, String name, Long lutemGameId, 
                          String imageUrl, Integer playtimeForever, Integer playtime2Weeks) {
            this.steamAppId = steamAppId;
            this.name = name;
            this.lutemGameId = lutemGameId;
            this.imageUrl = imageUrl;
            this.playtimeForever = playtimeForever;
            this.playtime2Weeks = playtime2Weeks;
        }
        
        // Getters and Setters
        public Long getSteamAppId() { return steamAppId; }
        public void setSteamAppId(Long steamAppId) { this.steamAppId = steamAppId; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Long getLutemGameId() { return lutemGameId; }
        public void setLutemGameId(Long lutemGameId) { this.lutemGameId = lutemGameId; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        
        public Integer getPlaytimeForever() { return playtimeForever; }
        public void setPlaytimeForever(Integer playtimeForever) { this.playtimeForever = playtimeForever; }
        
        public Integer getPlaytime2Weeks() { return playtime2Weeks; }
        public void setPlaytime2Weeks(Integer playtime2Weeks) { this.playtime2Weeks = playtime2Weeks; }
    }
    
    public static class UnmatchedGame {
        private Long steamAppId;
        private String name;
        private Integer playtimeForever;
        private Integer playtime2Weeks;
        private String iconUrl;
        
        public UnmatchedGame() {}
        
        public UnmatchedGame(Long steamAppId, String name, Integer playtimeForever, 
                            Integer playtime2Weeks, String iconUrl) {
            this.steamAppId = steamAppId;
            this.name = name;
            this.playtimeForever = playtimeForever;
            this.playtime2Weeks = playtime2Weeks;
            this.iconUrl = iconUrl;
        }
        
        // Getters and Setters
        public Long getSteamAppId() { return steamAppId; }
        public void setSteamAppId(Long steamAppId) { this.steamAppId = steamAppId; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Integer getPlaytimeForever() { return playtimeForever; }
        public void setPlaytimeForever(Integer playtimeForever) { this.playtimeForever = playtimeForever; }
        
        public Integer getPlaytime2Weeks() { return playtime2Weeks; }
        public void setPlaytime2Weeks(Integer playtime2Weeks) { this.playtime2Weeks = playtime2Weeks; }
        
        public String getIconUrl() { return iconUrl; }
        public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    }
    
    public static class ImportStats {
        private int total;
        private int matched;
        private int unmatched;
        private int alreadyInLibrary;
        private int newlyCreated; // Games created with PENDING status
        
        public ImportStats() {}
        
        public ImportStats(int total, int matched, int unmatched, int alreadyInLibrary) {
            this.total = total;
            this.matched = matched;
            this.unmatched = unmatched;
            this.alreadyInLibrary = alreadyInLibrary;
            this.newlyCreated = 0;
        }
        
        public ImportStats(int total, int matched, int unmatched, int alreadyInLibrary, int newlyCreated) {
            this.total = total;
            this.matched = matched;
            this.unmatched = unmatched;
            this.alreadyInLibrary = alreadyInLibrary;
            this.newlyCreated = newlyCreated;
        }
        
        // Getters and Setters
        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
        
        public int getMatched() { return matched; }
        public void setMatched(int matched) { this.matched = matched; }
        
        public int getUnmatched() { return unmatched; }
        public void setUnmatched(int unmatched) { this.unmatched = unmatched; }
        
        public int getAlreadyInLibrary() { return alreadyInLibrary; }
        public void setAlreadyInLibrary(int alreadyInLibrary) { this.alreadyInLibrary = alreadyInLibrary; }
        
        public int getNewlyCreated() { return newlyCreated; }
        public void setNewlyCreated(int newlyCreated) { this.newlyCreated = newlyCreated; }
    }
    
    // Main class Getters and Setters
    public List<MatchedGame> getMatched() { return matched; }
    public void setMatched(List<MatchedGame> matched) { this.matched = matched; }
    
    public List<UnmatchedGame> getUnmatched() { return unmatched; }
    public void setUnmatched(List<UnmatchedGame> unmatched) { this.unmatched = unmatched; }
    
    public ImportStats getStats() { return stats; }
    public void setStats(ImportStats stats) { this.stats = stats; }
    
    public String getSteamId() { return steamId; }
    public void setSteamId(String steamId) { this.steamId = steamId; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
