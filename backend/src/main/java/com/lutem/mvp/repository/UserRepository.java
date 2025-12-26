package com.lutem.mvp.repository;

import com.lutem.mvp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
     * @deprecated Use findByGoogleId() instead
     */
    @Deprecated
    default Optional<User> findByFirebaseUid(String firebaseUid) {
        return findByGoogleId(firebaseUid);
    }
    
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
     * @deprecated Use existsByGoogleId() instead
     */
    @Deprecated
    default boolean existsByFirebaseUid(String firebaseUid) {
        return existsByGoogleId(firebaseUid);
    }
}
