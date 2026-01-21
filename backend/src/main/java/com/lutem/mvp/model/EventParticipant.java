package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a user's participation in a calendar event.
 * Tracks invitations and join status.
 */
@Entity
@Table(name = "event_participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "user_id"})
})
public class EventParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private CalendarEvent event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantStatus status;

    @Column(name = "invited_at")
    private LocalDateTime invitedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    // Who invited this user (null if self-joined)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by_id")
    private User invitedBy;

    public enum ParticipantStatus {
        INVITED,   // User was invited, hasn't responded
        JOINED,    // User has joined/accepted
        DECLINED,  // User declined the invitation
        LEFT       // User left after joining
    }

    // Constructors
    public EventParticipant() {}

    /**
     * Create a new participant (self-join)
     */
    public EventParticipant(CalendarEvent event, User user) {
        this.event = event;
        this.user = user;
        this.status = ParticipantStatus.JOINED;
        this.respondedAt = LocalDateTime.now();
    }

    /**
     * Create a new invited participant
     */
    public EventParticipant(CalendarEvent event, User user, User invitedBy) {
        this.event = event;
        this.user = user;
        this.invitedBy = invitedBy;
        this.status = ParticipantStatus.INVITED;
        this.invitedAt = LocalDateTime.now();
    }

    // Status change methods
    public void join() {
        this.status = ParticipantStatus.JOINED;
        this.respondedAt = LocalDateTime.now();
    }

    public void decline() {
        this.status = ParticipantStatus.DECLINED;
        this.respondedAt = LocalDateTime.now();
    }

    public void leave() {
        this.status = ParticipantStatus.LEFT;
        this.respondedAt = LocalDateTime.now();
    }

    // Helper methods
    public boolean isJoined() {
        return status == ParticipantStatus.JOINED;
    }

    public boolean isPending() {
        return status == ParticipantStatus.INVITED;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CalendarEvent getEvent() { return event; }
    public void setEvent(CalendarEvent event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ParticipantStatus getStatus() { return status; }
    public void setStatus(ParticipantStatus status) { this.status = status; }

    public LocalDateTime getInvitedAt() { return invitedAt; }
    public void setInvitedAt(LocalDateTime invitedAt) { this.invitedAt = invitedAt; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }

    public User getInvitedBy() { return invitedBy; }
    public void setInvitedBy(User invitedBy) { this.invitedBy = invitedBy; }
}
