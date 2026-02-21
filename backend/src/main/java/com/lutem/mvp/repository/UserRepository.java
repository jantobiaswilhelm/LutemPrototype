package com.lutem.mvp.repository;

import com.lutem.mvp.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entities.
 * Supports dual auth: Steam and Google (Firebase).
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by Steam ID (64-bit Steam ID)
     */
    Optional<User> findBySteamId(String steamId);
    
    /**
     * Find user by Google/Firebase UID
     */
    Optional<User> findByGoogleId(String googleId);
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if user exists by Steam ID
     */
    boolean existsBySteamId(String steamId);
    
    /**
     * Check if user exists by Google/Firebase UID
     */
    boolean existsByGoogleId(String googleId);
    
    /**
     * Search users by display name (case-insensitive, partial match)
     * Excludes the searching user from results
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.displayName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "AND u.id != :excludeUserId " +
           "ORDER BY u.displayName")
    List<User> searchByDisplayName(
        @Param("query") String query,
        @Param("excludeUserId") Long excludeUserId,
        Pageable pageable
    );
}
