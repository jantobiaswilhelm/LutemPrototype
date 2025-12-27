package com.lutem.mvp.service;

import com.lutem.mvp.dto.UserLibraryGameDTO;
import com.lutem.mvp.model.User;
import com.lutem.mvp.model.UserLibrary;
import com.lutem.mvp.repository.UserLibraryRepository;
import com.lutem.mvp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing user game libraries.
 */
@Service
public class UserLibraryService {
    
    private final UserLibraryRepository userLibraryRepository;
    private final UserRepository userRepository;
    
    public UserLibraryService(UserLibraryRepository userLibraryRepository,
                              UserRepository userRepository) {
        this.userLibraryRepository = userLibraryRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Get all games in user's library by user ID.
     */
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getUserLibraryByUserId(Long userId) {
        List<UserLibrary> entries = userLibraryRepository.findByUserId(userId);
        return entries.stream()
            .map(UserLibraryGameDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Get library summary/stats for a user by user ID.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getLibrarySummaryByUserId(Long userId) {
        long totalGames = userLibraryRepository.countByUserId(userId);
        long steamGames = userLibraryRepository.countSteamGamesByUserId(userId);
        List<UserLibrary> taggedEntries = userLibraryRepository.findTaggedGamesByUserId(userId);
        
        return Map.of(
            "totalGames", totalGames,
            "steamGames", steamGames,
            "taggedGames", taggedEntries.size(),
            "untaggedGames", totalGames - taggedEntries.size()
        );
    }
    
    /**
     * Get only fully tagged games by user ID (for recommendations).
     */
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getTaggedGamesByUserId(Long userId) {
        List<UserLibrary> entries = userLibraryRepository.findTaggedGamesByUserId(userId);
        return entries.stream()
            .map(UserLibraryGameDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Get pending (untagged) games in user's library.
     * These are games imported from Steam that haven't been AI-tagged yet.
     */
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getPendingGamesByUserId(Long userId) {
        List<UserLibrary> entries = userLibraryRepository.findPendingGamesByUserId(userId);
        return entries.stream()
            .map(UserLibraryGameDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    // =====================================================
    // Legacy methods using firebaseUid (for backwards compatibility)
    // =====================================================
    
    /**
     * @deprecated Use getUserLibraryByUserId instead
     */
    @Deprecated
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getUserLibrary(String firebaseUid) {
        User user = userRepository.findByGoogleId(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getUserLibraryByUserId(user.getId());
    }
    
    /**
     * @deprecated Use getLibrarySummaryByUserId instead
     */
    @Deprecated
    @Transactional(readOnly = true)
    public Map<String, Object> getLibrarySummary(String firebaseUid) {
        User user = userRepository.findByGoogleId(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getLibrarySummaryByUserId(user.getId());
    }
    
    /**
     * @deprecated Use getTaggedGamesByUserId instead
     */
    @Deprecated
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getTaggedGames(String firebaseUid) {
        User user = userRepository.findByGoogleId(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return getTaggedGamesByUserId(user.getId());
    }
}
