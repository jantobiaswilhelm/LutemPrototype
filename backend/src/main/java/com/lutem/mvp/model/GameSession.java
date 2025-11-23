package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
public class GameSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    // User tracking (can be IP address or "anonymous" for MVP)
    @Column(name = "user_id")
    private String userId;
    
    // Context when recommendation was made
    @Column(name = "available_minutes")
    private Integer availableMinutes;
    
    @Column(name = "desired_mood")
    private String desiredMood; // "relax", "focus", "challenge"
    
    @Column(name = "recommended_at", nullable = false)
    private LocalDateTime recommendedAt;
    
    // Feedback (null until user rates)
    @Column(name = "satisfaction_score")
    private Integer satisfactionScore; // 1-5
    
    @Column(name = "feedback_at")
    private LocalDateTime feedbackAt;
    
    // Constructors
    public GameSession() {
        this.recommendedAt = LocalDateTime.now();
        this.userId = "anonymous"; // Default for MVP
    }
    
    public GameSession(Game game, Integer availableMinutes, String desiredMood) {
        this();
        this.game = game;
        this.availableMinutes = availableMinutes;
        this.desiredMood = desiredMood;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Game getGame() { return game; }
    public void setGame(Game game) { this.game = game; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public Integer getAvailableMinutes() { return availableMinutes; }
    public void setAvailableMinutes(Integer availableMinutes) { 
        this.availableMinutes = availableMinutes; 
    }
    
    public String getDesiredMood() { return desiredMood; }
    public void setDesiredMood(String desiredMood) { 
        this.desiredMood = desiredMood; 
    }
    
    public LocalDateTime getRecommendedAt() { return recommendedAt; }
    public void setRecommendedAt(LocalDateTime recommendedAt) { 
        this.recommendedAt = recommendedAt; 
    }
    
    public Integer getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(Integer satisfactionScore) { 
        this.satisfactionScore = satisfactionScore; 
    }
    
    public LocalDateTime getFeedbackAt() { return feedbackAt; }
    public void setFeedbackAt(LocalDateTime feedbackAt) { 
        this.feedbackAt = feedbackAt; 
    }
    
    // Helper method
    public boolean hasFeedback() {
        return satisfactionScore != null;
    }
}
