package com.lutem.mvp.repository;

import com.lutem.mvp.model.GameSession;
import com.lutem.mvp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    
    // Find sessions by legacy user id (IP or "anonymous")
    List<GameSession> findByLegacyUserId(String legacyUserId);
    
    // Find sessions by User entity
    List<GameSession> findByUser(User user);
    
    // Find sessions with feedback only
    List<GameSession> findBySatisfactionScoreIsNotNull();
    
    // Find sessions for a specific game
    List<GameSession> findByGameId(Long gameId);
    
    // Find sessions in a date range
    List<GameSession> findByRecommendedAtBetween(
        LocalDateTime start, 
        LocalDateTime end
    );
    
    // Get average satisfaction for a game
    @Query("SELECT AVG(s.satisfactionScore) FROM GameSession s " +
           "WHERE s.game.id = :gameId AND s.satisfactionScore IS NOT NULL")
    Double getAverageSatisfactionForGame(@Param("gameId") Long gameId);
    
    // Get recent sessions by legacy user id (for weekly recap)
    @Query("SELECT s FROM GameSession s " +
           "WHERE s.legacyUserId = :legacyUserId " +
           "AND s.recommendedAt >= :since " +
           "ORDER BY s.recommendedAt DESC")
    List<GameSession> getRecentSessions(
        @Param("legacyUserId") String legacyUserId,
        @Param("since") LocalDateTime since
    );
    
    // Get recent sessions by User entity (for authenticated users)
    @Query("SELECT s FROM GameSession s " +
           "WHERE s.user = :user " +
           "AND s.recommendedAt >= :since " +
           "ORDER BY s.recommendedAt DESC")
    List<GameSession> getRecentSessionsForUser(
        @Param("user") User user,
        @Param("since") LocalDateTime since
    );

    // Get started sessions ordered by start time (for history page)
    @Query("SELECT s FROM GameSession s " +
           "WHERE s.startedAt IS NOT NULL " +
           "ORDER BY s.startedAt DESC " +
           "LIMIT :limit")
    List<GameSession> findStartedSessionsOrderByStartedAtDesc(@Param("limit") int limit);

    // Get started sessions for a specific user (by legacy user id)
    @Query("SELECT s FROM GameSession s " +
           "WHERE s.startedAt IS NOT NULL " +
           "AND s.legacyUserId = :legacyUserId " +
           "ORDER BY s.startedAt DESC " +
           "LIMIT :limit")
    List<GameSession> findStartedSessionsForUserOrderByStartedAtDesc(
        @Param("legacyUserId") String legacyUserId,
        @Param("limit") int limit
    );
}
