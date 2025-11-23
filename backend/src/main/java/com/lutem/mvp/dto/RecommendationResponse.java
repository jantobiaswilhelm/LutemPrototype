package com.lutem.mvp.dto;

import com.lutem.mvp.model.Game;
import java.util.List;

public class RecommendationResponse {
    private Game topRecommendation;
    private List<Game> alternatives; // Top 4 alternatives
    private String reason;
    private List<String> alternativeReasons; // Reasons for each alternative
    private Integer topMatchPercentage;
    private List<Integer> alternativeMatchPercentages;
    private Long sessionId; // ID of the session record for feedback tracking

    // Constructors
    public RecommendationResponse() {}

    public RecommendationResponse(Game topRecommendation, List<Game> alternatives, 
                                  String reason, List<String> alternativeReasons) {
        this.topRecommendation = topRecommendation;
        this.alternatives = alternatives;
        this.reason = reason;
        this.alternativeReasons = alternativeReasons;
    }

    public RecommendationResponse(Game topRecommendation, List<Game> alternatives, 
                                  String reason, List<String> alternativeReasons,
                                  Integer topMatchPercentage, List<Integer> alternativeMatchPercentages) {
        this.topRecommendation = topRecommendation;
        this.alternatives = alternatives;
        this.reason = reason;
        this.alternativeReasons = alternativeReasons;
        this.topMatchPercentage = topMatchPercentage;
        this.alternativeMatchPercentages = alternativeMatchPercentages;
    }

    // Backward compatibility with old single-game constructor
    public RecommendationResponse(Game game, String reason) {
        this.topRecommendation = game;
        this.reason = reason;
        this.alternatives = List.of();
        this.alternativeReasons = List.of();
    }

    // Getters and Setters
    public Game getTopRecommendation() { return topRecommendation; }
    public void setTopRecommendation(Game topRecommendation) { 
        this.topRecommendation = topRecommendation; 
    }

    // Backward compatibility: getGame() returns topRecommendation
    public Game getGame() { return topRecommendation; }
    public void setGame(Game game) { this.topRecommendation = game; }

    public List<Game> getAlternatives() { return alternatives; }
    public void setAlternatives(List<Game> alternatives) { 
        this.alternatives = alternatives; 
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public List<String> getAlternativeReasons() { return alternativeReasons; }
    public void setAlternativeReasons(List<String> alternativeReasons) { 
        this.alternativeReasons = alternativeReasons; 
    }

    public Integer getTopMatchPercentage() { return topMatchPercentage; }
    public void setTopMatchPercentage(Integer topMatchPercentage) {
        this.topMatchPercentage = topMatchPercentage;
    }

    public List<Integer> getAlternativeMatchPercentages() { return alternativeMatchPercentages; }
    public void setAlternativeMatchPercentages(List<Integer> alternativeMatchPercentages) {
        this.alternativeMatchPercentages = alternativeMatchPercentages;
    }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
}
