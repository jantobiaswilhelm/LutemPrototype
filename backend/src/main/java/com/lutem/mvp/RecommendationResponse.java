package com.lutem.mvp;

public class RecommendationResponse {
    private Game game;
    private String reason;
    
    // Constructors
    public RecommendationResponse() {}
    
    public RecommendationResponse(Game game, String reason) {
        this.game = game;
        this.reason = reason;
    }
    
    // Getters and Setters
    public Game getGame() { return game; }
    public void setGame(Game game) { this.game = game; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
