package com.lutem.mvp.repository;

import com.lutem.mvp.model.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    
    // Find sessions by user
    List<GameSession> findByUserId(String userId);
    
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
    
    // Get recent sessions (for weekly recap)
    @Query("SELECT s FROM GameSession s " +
           "WHERE s.userId = :userId " +
           "AND s.recommendedAt >= :since " +
           "ORDER BY s.recommendedAt DESC")
    List<GameSession> getRecentSessions(
        @Param("userId") String userId,
        @Param("since") LocalDateTime since
    );
}
