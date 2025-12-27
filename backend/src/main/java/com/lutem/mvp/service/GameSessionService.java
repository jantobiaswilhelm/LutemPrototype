package com.lutem.mvp.service;

import com.lutem.mvp.model.Game;
import com.lutem.mvp.model.GameSession;
import com.lutem.mvp.repository.GameSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GameSessionService {
    
    private final GameSessionRepository repository;
    
    public GameSessionService(GameSessionRepository repository) {
        this.repository = repository;
    }
    
    /**
     * Record a recommendation given to user
     */
    @Transactional
    public GameSession recordRecommendation(
        Game game, 
        Integer availableMinutes, 
        String desiredMood
    ) {
        GameSession session = new GameSession(game, availableMinutes, desiredMood);
        return repository.save(session);
    }
    
    /**
     * Record user feedback for a session
     */
    @Transactional
    public Optional<GameSession> recordFeedback(Long sessionId, Integer satisfactionScore) {
        return repository.findById(sessionId)
            .map(session -> {
                session.setSatisfactionScore(satisfactionScore);
                session.setFeedbackAt(LocalDateTime.now());
                return repository.save(session);
            });
    }
    
    /**
     * Record when user actually starts playing (clicks "Start Session" or "Launch in Steam")
     */
    @Transactional
    public Optional<GameSession> startSession(Long sessionId) {
        return repository.findById(sessionId)
            .map(session -> {
                session.setStartedAt(LocalDateTime.now());
                return repository.save(session);
            });
    }
    
    /**
     * Record when user ends/completes a session (optional - for future use)
     */
    @Transactional
    public Optional<GameSession> endSession(Long sessionId) {
        return repository.findById(sessionId)
            .map(session -> {
                session.setEndedAt(LocalDateTime.now());
                return repository.save(session);
            });
    }
    
    /**
     * Get average satisfaction for a game (for improving recommendations)
     */
    public Double getAverageSatisfaction(Long gameId) {
        return repository.getAverageSatisfactionForGame(gameId);
    }
    
    /**
     * Get recent sessions for a user by legacy userId (for weekly recap)
     */
    public List<GameSession> getRecentSessions(String legacyUserId, int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        return repository.getRecentSessions(legacyUserId, since);
    }
    
    /**
     * Get all sessions with feedback (for analytics)
     */
    public List<GameSession> getAllRatedSessions() {
        return repository.findBySatisfactionScoreIsNotNull();
    }
    
    /**
     * Create a session when user selects an alternative game.
     * Immediately marks as started since user is about to launch it.
     */
    @Transactional
    public GameSession createAlternativeSession(Game game) {
        GameSession session = new GameSession(game, null, "alternative_selection");
        session.setStartedAt(LocalDateTime.now());
        return repository.save(session);
    }
}
