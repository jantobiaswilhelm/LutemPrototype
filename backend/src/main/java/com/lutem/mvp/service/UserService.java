package com.lutem.mvp.service;

import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for managing User entities.
 * Supports dual auth: Steam OpenID and Google (Firebase).
 */
@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * Find or create a user by Steam ID.
     * Used when authenticating via Steam OpenID.
     */
    @Transactional
    public User findOrCreateBySteamId(String steamId, String personaName, String avatarUrl) {
        Optional<User> existingUser = userRepository.findBySteamId(steamId);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setLastLoginAt(LocalDateTime.now());
            // Update profile info if changed
            if (personaName != null && !personaName.equals(user.getDisplayName())) {
                user.setDisplayName(personaName);
            }
            if (avatarUrl != null && !avatarUrl.equals(user.getAvatarUrl())) {
                user.setAvatarUrl(avatarUrl);
            }
            return userRepository.save(user);
        } else {
            User newUser = User.fromSteam(steamId, personaName, avatarUrl);
            return userRepository.save(newUser);
        }
    }
    
    /**
     * Find or create a user by Google/Firebase UID.
     * Creates new user on first login, updates lastLoginAt on subsequent logins.
     */
    @Transactional
    public User findOrCreateByGoogleId(String googleId, String email, String displayName) {
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setLastLoginAt(LocalDateTime.now());
            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);
            }
            if (displayName != null && !displayName.equals(user.getDisplayName())) {
                user.setDisplayName(displayName);
            }
            return userRepository.save(user);
        } else {
            User newUser = new User(googleId, email, displayName);
            return userRepository.save(newUser);
        }
    }
    
    /**
     * Find user by Steam ID
     */
    public Optional<User> findBySteamId(String steamId) {
        return userRepository.findBySteamId(steamId);
    }
    
    /**
     * Find user by Google/Firebase UID
     */
    public Optional<User> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }
    
    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Link a Steam account to an existing user.
     * Used when a Google user wants to connect their Steam account.
     */
    @Transactional
    public User linkSteamAccount(Long userId, String steamId, String avatarUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        
        // Check if Steam ID is already linked to another account
        Optional<User> existingWithSteam = userRepository.findBySteamId(steamId);
        if (existingWithSteam.isPresent() && !existingWithSteam.get().getId().equals(userId)) {
            throw new IllegalStateException("Steam account already linked to another user");
        }
        
        user.setSteamId(steamId);
        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl);
        }
        return userRepository.save(user);
    }
}
