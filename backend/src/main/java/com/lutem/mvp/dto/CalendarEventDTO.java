package com.lutem.mvp.dto;

import com.lutem.mvp.model.CalendarEvent;
import com.lutem.mvp.model.CalendarEvent.EventType;
import com.lutem.mvp.model.CalendarEvent.EventVisibility;
import com.lutem.mvp.model.EventParticipant;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO for calendar events with social info.
 */
public class CalendarEventDTO {

    private Long id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private EventType type;
    private Long gameId;
    private String gameName; // Populated when gameId is set
    private String description;
    private String sourceType;

    // Social fields
    private UserSummaryDTO owner;
    private EventVisibility visibility;
    private Integer maxParticipants;
    private int participantCount;
    private List<ParticipantDTO> participants;

    // Context-specific fields (set based on current user)
    private boolean isOwner;
    private boolean hasJoined;
    private boolean canJoin;

    // Constructors
    public CalendarEventDTO() {}

    public CalendarEventDTO(CalendarEvent event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.type = event.getType();
        this.gameId = event.getGameId();
        this.description = event.getDescription();
        this.sourceType = event.getSourceType();
        this.visibility = event.getVisibility();
        this.maxParticipants = event.getMaxParticipants();
        this.participantCount = event.getParticipantCount();

        if (event.getOwner() != null) {
            this.owner = new UserSummaryDTO(event.getOwner());
        }
    }

    /**
     * Create DTO with participant list
     */
    public CalendarEventDTO(CalendarEvent event, List<EventParticipant> participants) {
        this(event);
        this.participants = participants.stream()
            .map(ParticipantDTO::new)
            .collect(Collectors.toList());
    }

    /**
     * Set context fields for a specific user
     */
    public void setUserContext(Long userId, boolean hasJoined, boolean canJoin) {
        this.isOwner = owner != null && owner.getId().equals(userId);
        this.hasJoined = hasJoined;
        this.canJoin = canJoin;
    }

    // Nested DTO for participants
    public static class ParticipantDTO {
        private Long id;
        private UserSummaryDTO user;
        private String status;
        private LocalDateTime joinedAt;

        public ParticipantDTO() {}

        public ParticipantDTO(EventParticipant participant) {
            this.id = participant.getId();
            this.user = new UserSummaryDTO(participant.getUser());
            this.status = participant.getStatus().name();
            this.joinedAt = participant.getRespondedAt();
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public UserSummaryDTO getUser() { return user; }
        public void setUser(UserSummaryDTO user) { this.user = user; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
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

    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public UserSummaryDTO getOwner() { return owner; }
    public void setOwner(UserSummaryDTO owner) { this.owner = owner; }

    public EventVisibility getVisibility() { return visibility; }
    public void setVisibility(EventVisibility visibility) { this.visibility = visibility; }

    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }

    public int getParticipantCount() { return participantCount; }
    public void setParticipantCount(int participantCount) { this.participantCount = participantCount; }

    public List<ParticipantDTO> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantDTO> participants) { this.participants = participants; }

    public boolean isOwner() { return isOwner; }
    public void setOwner(boolean owner) { isOwner = owner; }

    public boolean isHasJoined() { return hasJoined; }
    public void setHasJoined(boolean hasJoined) { this.hasJoined = hasJoined; }

    public boolean isCanJoin() { return canJoin; }
    public void setCanJoin(boolean canJoin) { this.canJoin = canJoin; }
}
