package com.lutem.mvp.repository;

import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.TaggingSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    
    // Existing methods
    List<Game> findByNameContainingIgnoreCase(String name);
    Optional<Game> findByNameIgnoreCase(String name);
    List<Game> findByMinMinutesLessThanEqualAndMaxMinutesGreaterThanEqual(int max, int min);
    
    // === Steam Integration Methods (Phase S1-S3) ===
    
    /**
     * Find a game by its Steam App ID.
     */
    Optional<Game> findBySteamAppId(Long steamAppId);
    
    /**
     * Find all games that have a Steam App ID set.
     */
    List<Game> findBySteamAppIdNotNull();
    
    /**
     * Find all games matching any of the given Steam App IDs.
     */
    @Query("SELECT g FROM Game g WHERE g.steamAppId IN :steamAppIds")
    List<Game> findBySteamAppIdIn(@Param("steamAppIds") List<Long> steamAppIds);
    
    /**
     * Find all games by tagging source.
     */
    List<Game> findByTaggingSource(TaggingSource taggingSource);
    
    /**
     * Find all fully tagged games (for recommendations).
     * Excludes PENDING games.
     */
    @Query("SELECT g FROM Game g WHERE g.taggingSource IS NOT NULL AND g.taggingSource != 'PENDING'")
    List<Game> findAllFullyTagged();
    
    /**
     * Find untagged/pending games that need AI tagging.
     */
    @Query("SELECT g FROM Game g WHERE g.taggingSource = 'PENDING' OR g.taggingSource IS NULL")
    List<Game> findAllPendingTagging();
    
    /**
     * Check if a Steam App ID already exists in the database.
     */
    boolean existsBySteamAppId(Long steamAppId);

    // === Paginated Queries ===

    /**
     * Find all games with pagination support.
     */
    Page<Game> findAll(Pageable pageable);

    /**
     * Find all fully tagged games with pagination (for large game lists).
     */
    @Query("SELECT g FROM Game g WHERE g.taggingSource IS NOT NULL AND g.taggingSource != 'PENDING'")
    Page<Game> findAllFullyTaggedPaged(Pageable pageable);

    /**
     * Search games by name with pagination.
     */
    Page<Game> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Count fully tagged games.
     */
    @Query("SELECT COUNT(g) FROM Game g WHERE g.taggingSource IS NOT NULL AND g.taggingSource != 'PENDING'")
    long countFullyTagged();
}
