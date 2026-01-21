package com.lutem.mvp.repository;

import com.lutem.mvp.model.Friendship;
import com.lutem.mvp.model.Friendship.FriendshipStatus;
import com.lutem.mvp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    /**
     * Find all accepted friendships for a user (either as requester or addressee)
     */
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user OR f.addressee = :user) " +
           "AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendships(@Param("user") User user);

    /**
     * Find pending friend requests received by a user
     */
    @Query("SELECT f FROM Friendship f WHERE " +
           "f.addressee = :user AND f.status = 'PENDING' " +
           "ORDER BY f.createdAt DESC")
    List<Friendship> findPendingRequestsForUser(@Param("user") User user);

    /**
     * Find pending friend requests sent by a user
     */
    @Query("SELECT f FROM Friendship f WHERE " +
           "f.requester = :user AND f.status = 'PENDING' " +
           "ORDER BY f.createdAt DESC")
    List<Friendship> findPendingRequestsByUser(@Param("user") User user);

    /**
     * Find any existing friendship between two users (regardless of who initiated)
     */
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user1 AND f.addressee = :user2) OR " +
           "(f.requester = :user2 AND f.addressee = :user1)")
    Optional<Friendship> findFriendshipBetween(
        @Param("user1") User user1,
        @Param("user2") User user2
    );

    /**
     * Check if two users are friends (accepted friendship exists)
     */
    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE " +
           "((f.requester = :user1 AND f.addressee = :user2) OR " +
           "(f.requester = :user2 AND f.addressee = :user1)) " +
           "AND f.status = 'ACCEPTED'")
    boolean areFriends(@Param("user1") User user1, @Param("user2") User user2);

    /**
     * Check if user1 has blocked user2 (or vice versa)
     */
    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE " +
           "((f.requester = :user1 AND f.addressee = :user2) OR " +
           "(f.requester = :user2 AND f.addressee = :user1)) " +
           "AND f.status = 'BLOCKED'")
    boolean isBlocked(@Param("user1") User user1, @Param("user2") User user2);

    /**
     * Get friend IDs for a user (for efficient queries)
     */
    @Query("SELECT CASE WHEN f.requester.id = :userId THEN f.addressee.id ELSE f.requester.id END " +
           "FROM Friendship f WHERE " +
           "(f.requester.id = :userId OR f.addressee.id = :userId) " +
           "AND f.status = 'ACCEPTED'")
    List<Long> findFriendIds(@Param("userId") Long userId);

    /**
     * Count pending requests for a user (for notification badge)
     */
    @Query("SELECT COUNT(f) FROM Friendship f WHERE " +
           "f.addressee = :user AND f.status = 'PENDING'")
    long countPendingRequests(@Param("user") User user);
}
