package com.lutem.mvp;

public class SessionFeedback {
    private Long gameId;
    private int satisfactionScore;
    
    // Constructors
    public SessionFeedback() {}
    
    public SessionFeedback(Long gameId, int satisfactionScore) {
        this.gameId = gameId;
        this.satisfactionScore = satisfactionScore;
    }
    
    // Getters and Setters
    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }
    
    public int getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(int satisfactionScore) { 
        this.satisfactionScore = satisfactionScore; 
    }
}
