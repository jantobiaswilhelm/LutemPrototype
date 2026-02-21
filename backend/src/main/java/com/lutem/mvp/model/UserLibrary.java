package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a user's ownership of a game in their library.
 * Links users to games they own (imported from Steam or manually added).
 */
@Entity
@Table(name = "user_library",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "game_id"}),
       indexes = {
           @Index(name = "idx_library_user", columnList = "user_id"),
           @Index(name = "idx_library_steam_app_id", columnList = "steamAppId")
       })
public class UserLibrary {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    /**
     * Source platform of the game ownership.
     */
    @Enumerated(EnumType.STRING)
    private LibrarySource source;
    
    /**
     * Steam app ID if imported from Steam.
     */
    private Long steamAppId;
    
    /**
     * User's playtime on Steam (in minutes).
     */
    private Integer steamPlaytimeForever;
    
    /**
     * User's recent playtime on Steam (last 2 weeks, in minutes).
     */
    private Integer steamPlaytime2Weeks;
    
    /**
     * When this game was added to user's Lutem library.
     */
    @Column(nullable = false)
    private LocalDateTime addedAt;
    
    /**
     * When the Steam data was last synced.
     */
    private LocalDateTime lastSyncedAt;
    
    // Constructors
    public UserLibrary() {
        this.addedAt = LocalDateTime.now();
    }
    
    public UserLibrary(User user, Game game, LibrarySource source) {
        this.user = user;
        this.game = game;
        this.source = source;
        this.addedAt = LocalDateTime.now();
    }
    
    // Steam-specific constructor
    public UserLibrary(User user, Game game, Long steamAppId, 
                       Integer playtimeForever, Integer playtime2Weeks) {
        this.user = user;
        this.game = game;
        this.source = LibrarySource.STEAM;
        this.steamAppId = steamAppId;
        this.steamPlaytimeForever = playtimeForever;
        this.steamPlaytime2Weeks = playtime2Weeks;
        this.addedAt = LocalDateTime.now();
        this.lastSyncedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Game getGame() { return game; }
    public void setGame(Game game) { this.game = game; }
    
    public LibrarySource getSource() { return source; }
    public void setSource(LibrarySource source) { this.source = source; }
    
    public Long getSteamAppId() { return steamAppId; }
    public void setSteamAppId(Long steamAppId) { this.steamAppId = steamAppId; }
    
    public Integer getSteamPlaytimeForever() { return steamPlaytimeForever; }
    public void setSteamPlaytimeForever(Integer steamPlaytimeForever) { 
        this.steamPlaytimeForever = steamPlaytimeForever; 
    }
    
    public Integer getSteamPlaytime2Weeks() { return steamPlaytime2Weeks; }
    public void setSteamPlaytime2Weeks(Integer steamPlaytime2Weeks) { 
        this.steamPlaytime2Weeks = steamPlaytime2Weeks; 
    }
    
    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
    
    public LocalDateTime getLastSyncedAt() { return lastSyncedAt; }
    public void setLastSyncedAt(LocalDateTime lastSyncedAt) { 
        this.lastSyncedAt = lastSyncedAt; 
    }
    
    /**
     * Enum for library source platforms
     */
    public enum LibrarySource {
        STEAM,
        MANUAL,      // User manually added
        EPIC,        // Future: Epic Games Store
        GOG,         // Future: GOG
        XBOX,        // Future: Xbox/Game Pass
        PLAYSTATION  // Future: PlayStation
    }
}
