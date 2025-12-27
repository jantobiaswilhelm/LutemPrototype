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
    
    // User reference (optional - null for anonymous users)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id_fk")
    private User user;
    
    // Legacy user tracking (IP or "anonymous" for backward compatibility)
    @Column(name = "user_id")
    private String legacyUserId;
    
    // Context when recommendation was made
    @Column(name = "available_minutes")
    private Integer availableMinutes;
    
    @Column(name = "desired_mood")
    private String desiredMood; // "relax", "focus", "challenge"
    
    @Column(name = "recommended_at", nullable = false)
    private LocalDateTime recommendedAt;
    
    // Session lifecycle timestamps
    @Column(name = "started_at")
    private LocalDateTime startedAt; // When user clicked "Start Session"
    
    @Column(name = "ended_at")
    private LocalDateTime endedAt; // When session was marked complete (optional)
    
    // Feedback (null until user rates)
    @Column(name = "satisfaction_score")
    private Integer satisfactionScore; // 1-5
    
    @Column(name = "feedback_at")
    private LocalDateTime feedbackAt;
    
    // Constructors
    public GameSession() {
        this.recommendedAt = LocalDateTime.now();
        this.legacyUserId = "anonymous"; // Default for anonymous users
    }
    
    public GameSession(Game game, Integer availableMinutes, String desiredMood) {
        this();
        this.game = game;
        this.availableMinutes = availableMinutes;
        this.desiredMood = desiredMood;
    }
    
    public GameSession(Game game, Integer availableMinutes, String desiredMood, User user) {
        this(game, availableMinutes, desiredMood);
        this.user = user;
        this.legacyUserId = user != null ? user.getFirebaseUid() : "anonymous";
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Game getGame() { return game; }
    public void setGame(Game game) { this.game = game; }
    
    public User getUser() { return user; }
    public void setUser(User user) { 
        this.user = user;
        if (user != null) {
            this.legacyUserId = user.getFirebaseUid();
        }
    }
    
    // Legacy getter/setter for backward compatibility
    public String getUserId() { return legacyUserId; }
    public void setUserId(String userId) { this.legacyUserId = userId; }
    
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
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { 
        this.startedAt = startedAt; 
    }
    
    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { 
        this.endedAt = endedAt; 
    }
    
    // Helper method
    public boolean hasFeedback() {
        return satisfactionScore != null;
    }
    
    public boolean wasStarted() {
        return startedAt != null;
    }
}
