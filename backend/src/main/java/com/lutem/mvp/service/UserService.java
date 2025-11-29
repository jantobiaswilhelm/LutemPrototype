package com.lutem.mvp.service;

import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for managing User entities.
 */
@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Find or create a user by Firebase UID.
     * Creates new user on first login, updates lastLoginAt on subsequent logins.
     */
    @Transactional
    public User findOrCreateByFirebaseUid(String firebaseUid, String email, String displayName) {
        Optional<User> existingUser = userRepository.findByFirebaseUid(firebaseUid);
        
        if (existingUser.isPresent()) {
            // Update last login time
            User user = existingUser.get();
            user.setLastLoginAt(LocalDateTime.now());
            // Update email/displayName if changed
            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);
            }
            if (displayName != null && !displayName.equals(user.getDisplayName())) {
                user.setDisplayName(displayName);
            }
            return userRepository.save(user);
        } else {
            // Create new user
            User newUser = new User(firebaseUid, email, displayName);
            return userRepository.save(newUser);
        }
    }
    
    /**
     * Find user by Firebase UID
     */
    public Optional<User> findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid);
    }
    
    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
