package com.lutem.mvp.service;

import com.lutem.mvp.model.*;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.repository.GameSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for GameSessionService.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class GameSessionServiceTest {

    @Autowired
    private GameSessionService sessionService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private GameSessionRepository sessionRepository;

    private Game testGame;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();
        gameRepository.deleteAll();

        testGame = new Game();
        testGame.setName("Test Game");
        testGame.setMinMinutes(15);
        testGame.setMaxMinutes(30);
        testGame.setEmotionalGoals(Arrays.asList(EmotionalGoal.UNWIND));
        testGame.setInterruptibility(Interruptibility.HIGH);
        testGame.setEnergyRequired(EnergyLevel.LOW);
        testGame.setTaggingSource(TaggingSource.MANUAL);
        testGame = gameRepository.save(testGame);
    }

    @Test
    void recordRecommendation_ShouldCreateSession() {
        GameSession session = sessionService.recordRecommendation(testGame, 30, "unwind");

        assertNotNull(session);
        assertNotNull(session.getId());
        assertEquals(testGame.getId(), session.getGame().getId());
        assertEquals(30, session.getAvailableMinutes());
        assertEquals("unwind", session.getDesiredMood());
        assertNotNull(session.getRecommendedAt());
    }

    @Test
    void startSession_ShouldUpdateStartedAt() {
        GameSession session = sessionService.recordRecommendation(testGame, 30, "unwind");

        Optional<GameSession> started = sessionService.startSession(session.getId());

        assertTrue(started.isPresent());
        assertNotNull(started.get().getStartedAt());
    }

    @Test
    void startSession_WithInvalidId_ShouldReturnEmpty() {
        Optional<GameSession> result = sessionService.startSession(999999L);
        assertTrue(result.isEmpty());
    }

    @Test
    void recordFeedback_ShouldUpdateSatisfaction() {
        GameSession session = sessionService.recordRecommendation(testGame, 30, "unwind");
        sessionService.startSession(session.getId());

        Optional<GameSession> updated = sessionService.recordFeedback(session.getId(), 5);

        assertTrue(updated.isPresent());
        assertEquals(5, updated.get().getSatisfactionScore());
        assertNotNull(updated.get().getFeedbackAt());
    }

    @Test
    void endSession_ShouldUpdateEndedAt() {
        GameSession session = sessionService.recordRecommendation(testGame, 30, "unwind");
        sessionService.startSession(session.getId());

        Optional<GameSession> ended = sessionService.endSession(session.getId());

        assertTrue(ended.isPresent());
        assertNotNull(ended.get().getEndedAt());
    }

    @Test
    void getAverageSatisfaction_ShouldCalculateCorrectly() {
        // Create multiple sessions with feedback
        GameSession session1 = sessionService.recordRecommendation(testGame, 30, "unwind");
        sessionService.recordFeedback(session1.getId(), 4);

        GameSession session2 = sessionService.recordRecommendation(testGame, 30, "unwind");
        sessionService.recordFeedback(session2.getId(), 5);

        GameSession session3 = sessionService.recordRecommendation(testGame, 30, "unwind");
        sessionService.recordFeedback(session3.getId(), 3);

        Double average = sessionService.getAverageSatisfaction(testGame.getId());

        assertNotNull(average);
        assertEquals(4.0, average, 0.01); // (4+5+3)/3 = 4.0
    }

    @Test
    void getAverageSatisfaction_WithNoSessions_ShouldReturnNull() {
        Double average = sessionService.getAverageSatisfaction(testGame.getId());
        assertNull(average);
    }

    @Test
    void createAlternativeSession_ShouldCreateAndStart() {
        GameSession session = sessionService.createAlternativeSession(testGame);

        assertNotNull(session);
        assertNotNull(session.getId());
        assertNotNull(session.getStartedAt()); // Should be auto-started
        assertEquals(testGame.getId(), session.getGame().getId());
    }
}
