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
     * Get all games in user's library.
     */
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getUserLibrary(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<UserLibrary> entries = userLibraryRepository.findByUserId(user.getId());
        
        return entries.stream()
            .map(UserLibraryGameDTO::fromEntity)
            .collect(Collectors.toList());
    }
    
    /**
     * Get library summary/stats for a user.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getLibrarySummary(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        long totalGames = userLibraryRepository.countByUserId(user.getId());
        long steamGames = userLibraryRepository.countSteamGamesByUserId(user.getId());
        List<UserLibrary> taggedEntries = userLibraryRepository.findTaggedGamesByUserId(user.getId());
        
        return Map.of(
            "totalGames", totalGames,
            "steamGames", steamGames,
            "taggedGames", taggedEntries.size(),
            "untaggedGames", totalGames - taggedEntries.size()
        );
    }
    
    /**
     * Get only fully tagged games (for recommendations).
     */
    @Transactional(readOnly = true)
    public List<UserLibraryGameDTO> getTaggedGames(String firebaseUid) {
        User user = userRepository.findByFirebaseUid(firebaseUid)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<UserLibrary> entries = userLibraryRepository.findTaggedGamesByUserId(user.getId());
        
        return entries.stream()
            .map(UserLibraryGameDTO::fromEntity)
            .collect(Collectors.toList());
    }
}
