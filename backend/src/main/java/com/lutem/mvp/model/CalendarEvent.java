package com.lutem.mvp.model;

import java.time.LocalDateTime;

public class CalendarEvent {
    private Long id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private EventType type; // TASK or GAME
    private Long gameId; // null if type=TASK
    private String description;
    
    public enum EventType {
        TASK, GAME
    }
    
    // Constructors
    public CalendarEvent() {}
    
    public CalendarEvent(Long id, String title, LocalDateTime startTime, 
                        LocalDateTime endTime, EventType type, Long gameId, String description) {
        this.id = id;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.type = type;
        this.gameId = gameId;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public EventType getType() { return type; }
    public void setType(EventType type) { this.type = type; }
    
    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
