package com.lutem.mvp.repository;

import com.lutem.mvp.model.UserLibrary;
import com.lutem.mvp.model.UserLibrary.LibrarySource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserLibraryRepository extends JpaRepository<UserLibrary, Long> {
    
    /**
     * Find all library entries for a user.
     */
    List<UserLibrary> findByUserId(Long userId);
    
    /**
     * Find all library entries for a user by Google ID (Firebase UID).
     */
    @Query("SELECT ul FROM UserLibrary ul WHERE ul.user.googleId = :googleId")
    List<UserLibrary> findByUserGoogleId(@Param("googleId") String googleId);
    
    /**
     * Find a specific game in user's library.
     */
    Optional<UserLibrary> findByUserIdAndGameId(Long userId, Long gameId);
    
    /**
     * Find by user ID and Steam App ID.
     */
    Optional<UserLibrary> findByUserIdAndSteamAppId(Long userId, Long steamAppId);
    
    /**
     * Find all entries from a specific source for a user.
     */
    List<UserLibrary> findByUserIdAndSource(Long userId, LibrarySource source);
    
    /**
     * Check if user owns a specific game.
     */
    boolean existsByUserIdAndGameId(Long userId, Long gameId);
    
    /**
     * Count games in user's library.
     */
    long countByUserId(Long userId);
    
    /**
     * Count games from Steam in user's library.
     */
    @Query("SELECT COUNT(ul) FROM UserLibrary ul WHERE ul.user.id = :userId AND ul.source = 'STEAM'")
    long countSteamGamesByUserId(@Param("userId") Long userId);
    
    /**
     * Find user's library entries where the game is fully tagged (for recommendations).
     */
    @Query("SELECT ul FROM UserLibrary ul " +
           "WHERE ul.user.id = :userId " +
           "AND ul.game.taggingSource IS NOT NULL " +
           "AND ul.game.taggingSource != 'PENDING'")
    List<UserLibrary> findTaggedGamesByUserId(@Param("userId") Long userId);
    
    /**
     * Delete all library entries for a user from a specific source.
     */
    void deleteByUserIdAndSource(Long userId, LibrarySource source);
}
