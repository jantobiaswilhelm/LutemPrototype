package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_events")
public class CalendarEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private LocalDateTime startTime;
    
    @Column(nullable = false)
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;
    
    private Long gameId;
    
    @Column(length = 1000)
    private String description;
    
    // Source tracking for imported events
    private String sourceType; // "MANUAL", "ICS_IMPORT", "GOOGLE_CALENDAR"
    
    private String externalId; // For deduplication (e.g., Google Calendar event ID or ICS UID)
    
    public enum EventType {
        TASK, GAME
    }
    
    // Constructors
    public CalendarEvent() {}
    
    public CalendarEvent(String title, LocalDateTime startTime, LocalDateTime endTime, 
                        EventType type, Long gameId, String description) {
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.type = type;
        this.gameId = gameId;
        this.description = description;
        this.sourceType = "MANUAL";
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
    
    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    
    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
}
