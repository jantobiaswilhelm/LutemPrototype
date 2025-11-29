package com.lutem.mvp.repository;

import com.lutem.mvp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by Firebase UID
     */
    Optional<User> findByFirebaseUid(String firebaseUid);
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if user exists by Firebase UID
     */
    boolean existsByFirebaseUid(String firebaseUid);
}
