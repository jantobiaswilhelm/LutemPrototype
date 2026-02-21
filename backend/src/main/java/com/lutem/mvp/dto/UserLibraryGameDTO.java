package com.lutem.mvp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.TaggingSource;
import com.lutem.mvp.model.UserLibrary;

import java.time.LocalDateTime;

/**
 * DTO for user library game entries.
 */
public class UserLibraryGameDTO {
    
    private Long libraryEntryId;
    private Long gameId;
    private String gameName;
    private String imageUrl;
    private String source;
    private Long steamAppId;
    private Integer playtimeForever;
    private Integer playtime2Weeks;
    private LocalDateTime addedAt;
    @JsonProperty("isTagged")
    private boolean isTagged;
    private String taggingSource;
    
    // Constructors
    public UserLibraryGameDTO() {}
    
    public static UserLibraryGameDTO fromEntity(UserLibrary entry) {
        UserLibraryGameDTO dto = new UserLibraryGameDTO();
        Game game = entry.getGame();
        
        dto.setLibraryEntryId(entry.getId());
        dto.setGameId(game.getId());
        dto.setGameName(game.getName());
        dto.setImageUrl(game.getImageUrl());
        dto.setSource(entry.getSource().name());
        dto.setSteamAppId(entry.getSteamAppId());
        dto.setPlaytimeForever(entry.getSteamPlaytimeForever());
        dto.setPlaytime2Weeks(entry.getSteamPlaytime2Weeks());
        dto.setAddedAt(entry.getAddedAt());
        dto.setTagged(game.isFullyTagged());
        dto.setTaggingSource(game.getTaggingSource() != null ? 
            game.getTaggingSource().name() : null);
        
        return dto;
    }
    
    // Getters and Setters
    public Long getLibraryEntryId() { return libraryEntryId; }
    public void setLibraryEntryId(Long libraryEntryId) { this.libraryEntryId = libraryEntryId; }
    
    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    
    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public Long getSteamAppId() { return steamAppId; }
    public void setSteamAppId(Long steamAppId) { this.steamAppId = steamAppId; }
    
    public Integer getPlaytimeForever() { return playtimeForever; }
    public void setPlaytimeForever(Integer playtimeForever) { this.playtimeForever = playtimeForever; }
    
    public Integer getPlaytime2Weeks() { return playtime2Weeks; }
    public void setPlaytime2Weeks(Integer playtime2Weeks) { this.playtime2Weeks = playtime2Weeks; }
    
    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
    
    public boolean isTagged() { return isTagged; }
    public void setTagged(boolean tagged) { isTagged = tagged; }
    
    public String getTaggingSource() { return taggingSource; }
    public void setTaggingSource(String taggingSource) { this.taggingSource = taggingSource; }
}
