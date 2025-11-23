package com.lutem.mvp.dto;

public class SessionFeedback {
    private Long sessionId; // ID of the session to provide feedback for
    private Long gameId; // Backward compatibility - can be removed later
    private int satisfactionScore; // 1-5 rating
    
    // Constructors
    public SessionFeedback() {}
    
    public SessionFeedback(Long gameId, int satisfactionScore) {
        this.gameId = gameId;
        this.satisfactionScore = satisfactionScore;
    }
    
    public SessionFeedback(Long sessionId, Long gameId, int satisfactionScore) {
        this.sessionId = sessionId;
        this.gameId = gameId;
        this.satisfactionScore = satisfactionScore;
    }
    
    // Getters and Setters
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    
    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    
    public int getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(int satisfactionScore) { 
        this.satisfactionScore = satisfactionScore; 
    }
}
