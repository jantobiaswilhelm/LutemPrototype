package com.lutem.mvp.dto;

import com.lutem.mvp.model.Friendship;
import com.lutem.mvp.model.Friendship.FriendshipStatus;

import java.time.LocalDateTime;

/**
 * DTO for friend requests (pending friendships).
 */
public class FriendRequestDTO {

    private Long id;
    private UserSummaryDTO fromUser;
    private UserSummaryDTO toUser;
    private FriendshipStatus status;
    private LocalDateTime createdAt;

    // Constructors
    public FriendRequestDTO() {}

    public FriendRequestDTO(Friendship friendship) {
        this.id = friendship.getId();
        this.fromUser = new UserSummaryDTO(friendship.getRequester());
        this.toUser = new UserSummaryDTO(friendship.getAddressee());
        this.status = friendship.getStatus();
        this.createdAt = friendship.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserSummaryDTO getFromUser() { return fromUser; }
    public void setFromUser(UserSummaryDTO fromUser) { this.fromUser = fromUser; }

    public UserSummaryDTO getToUser() { return toUser; }
    public void setToUser(UserSummaryDTO toUser) { this.toUser = toUser; }

    public FriendshipStatus getStatus() { return status; }
    public void setStatus(FriendshipStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
