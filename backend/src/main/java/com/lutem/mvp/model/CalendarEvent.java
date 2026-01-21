package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    // Owner of the event (who created it)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    // Visibility setting for social features
    @Enumerated(EnumType.STRING)
    private EventVisibility visibility = EventVisibility.PRIVATE;

    // Maximum participants (null = unlimited, for GAME events)
    private Integer maxParticipants;

    // Participants (for GAME events)
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventParticipant> participants = new ArrayList<>();

    public enum EventType {
        TASK, GAME
    }

    public enum EventVisibility {
        PRIVATE,       // Only visible to owner
        FRIENDS_ONLY,  // Visible to friends
        PUBLIC         // Visible to all users
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

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public EventVisibility getVisibility() { return visibility != null ? visibility : EventVisibility.PRIVATE; }
    public void setVisibility(EventVisibility visibility) { this.visibility = visibility; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public List<EventParticipant> getParticipants() { return participants; }
    public void setParticipants(List<EventParticipant> participants) { this.participants = participants; }

    // Helper methods
    public boolean isOwnedBy(User user) {
        return owner != null && owner.getId().equals(user.getId());
    }

    public boolean canBeViewedBy(User user, boolean isFriend) {
        if (owner == null) return true; // Legacy events without owner
        if (isOwnedBy(user)) return true;

        switch (visibility) {
            case PUBLIC:
                return true;
            case FRIENDS_ONLY:
                return isFriend;
            case PRIVATE:
            default:
                return false;
        }
    }

    public int getParticipantCount() {
        return (int) participants.stream()
            .filter(p -> p.getStatus() == EventParticipant.ParticipantStatus.JOINED)
            .count();
    }

    public boolean hasSpaceForMore() {
        if (maxParticipants == null) return true;
        return getParticipantCount() < maxParticipants;
    }
}
