package com.lutem.mvp.service;

import com.lutem.mvp.model.Friendship;
import com.lutem.mvp.model.Friendship.FriendshipStatus;
import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.FriendshipRepository;
import com.lutem.mvp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    private static final Logger logger = LoggerFactory.getLogger(FriendshipService.class);

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    /**
     * Send a friend request from one user to another
     */
    @Transactional
    public Friendship sendFriendRequest(User requester, Long addresseeId) {
        // Can't friend yourself
        if (requester.getId().equals(addresseeId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        User addressee = userRepository.findById(addresseeId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + addresseeId));

        // Check if friendship already exists
        Optional<Friendship> existing = friendshipRepository.findFriendshipBetween(requester, addressee);
        if (existing.isPresent()) {
            Friendship f = existing.get();
            if (f.isAccepted()) {
                throw new IllegalStateException("Already friends with this user");
            }
            if (f.getStatus() == FriendshipStatus.PENDING) {
                // If they already sent us a request, auto-accept
                if (f.getAddressee().getId().equals(requester.getId())) {
                    f.accept();
                    logger.info("Auto-accepted friend request from {} to {}", addressee.getDisplayName(), requester.getDisplayName());
                    return friendshipRepository.save(f);
                }
                throw new IllegalStateException("Friend request already pending");
            }
            if (f.getStatus() == FriendshipStatus.BLOCKED) {
                throw new IllegalStateException("Cannot send friend request to this user");
            }
            // If declined, allow re-request by creating new
            friendshipRepository.delete(f);
        }

        Friendship friendship = new Friendship(requester, addressee);
        logger.info("Friend request sent from {} to {}", requester.getDisplayName(), addressee.getDisplayName());
        return friendshipRepository.save(friendship);
    }

    /**
     * Accept a pending friend request
     */
    @Transactional
    public Friendship acceptFriendRequest(User currentUser, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        // Only the addressee can accept
        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Cannot accept this friend request");
        }

        if (!friendship.isPending()) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendship.accept();
        logger.info("Friend request accepted: {} and {} are now friends",
            friendship.getRequester().getDisplayName(),
            friendship.getAddressee().getDisplayName());
        return friendshipRepository.save(friendship);
    }

    /**
     * Decline a pending friend request
     */
    @Transactional
    public void declineFriendRequest(User currentUser, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        // Only the addressee can decline
        if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Cannot decline this friend request");
        }

        if (!friendship.isPending()) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendship.decline();
        friendshipRepository.save(friendship);
        logger.info("Friend request declined by {}", currentUser.getDisplayName());
    }

    /**
     * Remove a friend (unfriend)
     */
    @Transactional
    public void removeFriend(User currentUser, Long friendUserId) {
        User friendUser = userRepository.findById(friendUserId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUser, friendUser)
            .orElseThrow(() -> new IllegalStateException("Not friends with this user"));

        if (!friendship.isAccepted()) {
            throw new IllegalStateException("Not friends with this user");
        }

        friendshipRepository.delete(friendship);
        logger.info("{} removed {} from friends",
            currentUser.getDisplayName(), friendUser.getDisplayName());
    }

    /**
     * Cancel a pending friend request that you sent
     */
    @Transactional
    public void cancelFriendRequest(User currentUser, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        // Only the requester can cancel
        if (!friendship.getRequester().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Cannot cancel this friend request");
        }

        if (!friendship.isPending()) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendshipRepository.delete(friendship);
        logger.info("Friend request cancelled by {}", currentUser.getDisplayName());
    }

    /**
     * Get all accepted friends for a user
     */
    public List<User> getFriends(User user) {
        return friendshipRepository.findAcceptedFriendships(user).stream()
            .map(f -> f.getOtherUser(user))
            .collect(Collectors.toList());
    }

    /**
     * Get pending friend requests received by the user
     */
    public List<Friendship> getPendingRequests(User user) {
        return friendshipRepository.findPendingRequestsForUser(user);
    }

    /**
     * Get pending friend requests sent by the user
     */
    public List<Friendship> getSentRequests(User user) {
        return friendshipRepository.findPendingRequestsByUser(user);
    }

    /**
     * Check if two users are friends
     */
    public boolean areFriends(User user1, User user2) {
        return friendshipRepository.areFriends(user1, user2);
    }

    /**
     * Get friend IDs for efficient queries
     */
    public List<Long> getFriendIds(Long userId) {
        return friendshipRepository.findFriendIds(userId);
    }

    /**
     * Get count of pending requests (for notification badge)
     */
    public long getPendingRequestCount(User user) {
        return friendshipRepository.countPendingRequests(user);
    }

    /**
     * Get friendship status between current user and another user
     */
    public Optional<Friendship> getFriendshipWith(User currentUser, Long otherUserId) {
        User otherUser = userRepository.findById(otherUserId).orElse(null);
        if (otherUser == null) return Optional.empty();
        return friendshipRepository.findFriendshipBetween(currentUser, otherUser);
    }
}
