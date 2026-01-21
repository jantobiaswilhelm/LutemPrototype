package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a friendship relationship between two users.
 * The requester initiates, the addressee receives the request.
 */
@Entity
@Table(name = "friendships", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"requester_id", "addressee_id"})
})
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addressee_id", nullable = false)
    private User addressee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendshipStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum FriendshipStatus {
        PENDING,    // Request sent, awaiting response
        ACCEPTED,   // Both users are friends
        DECLINED,   // Request was declined
        BLOCKED     // User blocked the other
    }

    // Constructors
    public Friendship() {
        this.createdAt = LocalDateTime.now();
        this.status = FriendshipStatus.PENDING;
    }

    public Friendship(User requester, User addressee) {
        this();
        this.requester = requester;
        this.addressee = addressee;
    }

    // Helper methods
    public boolean isPending() {
        return status == FriendshipStatus.PENDING;
    }

    public boolean isAccepted() {
        return status == FriendshipStatus.ACCEPTED;
    }

    public void accept() {
        this.status = FriendshipStatus.ACCEPTED;
        this.updatedAt = LocalDateTime.now();
    }

    public void decline() {
        this.status = FriendshipStatus.DECLINED;
        this.updatedAt = LocalDateTime.now();
    }

    public void block() {
        this.status = FriendshipStatus.BLOCKED;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Get the other user in this friendship from the perspective of the given user.
     */
    public User getOtherUser(User currentUser) {
        if (requester.getId().equals(currentUser.getId())) {
            return addressee;
        }
        return requester;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public User getAddressee() {
        return addressee;
    }

    public void setAddressee(User addressee) {
        this.addressee = addressee;
    }

    public FriendshipStatus getStatus() {
        return status;
    }

    public void setStatus(FriendshipStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
