package com.lutem.mvp.dto;

import com.lutem.mvp.model.GameSession;
import java.time.LocalDateTime;

/**
 * DTO for session history list items.
 * Lightweight representation of a GameSession for the frontend.
 */
public class SessionHistoryDTO {

    private Long id;
    private Long gameId;
    private String gameName;
    private String gameImageUrl;
    private LocalDateTime startedAt;
    private LocalDateTime recommendedAt;
    private Integer satisfactionScore;
    private LocalDateTime feedbackAt;
    private String desiredMood;
    private Integer availableMinutes;

    // Constructors
    public SessionHistoryDTO() {}

    public SessionHistoryDTO(GameSession session) {
        this.id = session.getId();
        this.gameId = session.getGame().getId();
        this.gameName = session.getGame().getName();
        this.gameImageUrl = session.getGame().getImageUrl();
        this.startedAt = session.getStartedAt();
        this.recommendedAt = session.getRecommendedAt();
        this.satisfactionScore = session.getSatisfactionScore();
        this.feedbackAt = session.getFeedbackAt();
        this.desiredMood = session.getDesiredMood();
        this.availableMinutes = session.getAvailableMinutes();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }

    public String getGameName() { return gameName; }
    public void setGameName(String gameName) { this.gameName = gameName; }

    public String getGameImageUrl() { return gameImageUrl; }
    public void setGameImageUrl(String gameImageUrl) { this.gameImageUrl = gameImageUrl; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getRecommendedAt() { return recommendedAt; }
    public void setRecommendedAt(LocalDateTime recommendedAt) { this.recommendedAt = recommendedAt; }

    public Integer getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(Integer satisfactionScore) { this.satisfactionScore = satisfactionScore; }

    public LocalDateTime getFeedbackAt() { return feedbackAt; }
    public void setFeedbackAt(LocalDateTime feedbackAt) { this.feedbackAt = feedbackAt; }

    public String getDesiredMood() { return desiredMood; }
    public void setDesiredMood(String desiredMood) { this.desiredMood = desiredMood; }

    public Integer getAvailableMinutes() { return availableMinutes; }
    public void setAvailableMinutes(Integer availableMinutes) { this.availableMinutes = availableMinutes; }
}
