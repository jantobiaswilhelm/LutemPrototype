package com.lutem.mvp;

public class RecommendationRequest {
    private int availableMinutes;
    private String desiredMood;
    
    // Constructors
    public RecommendationRequest() {}
    
    public RecommendationRequest(int availableMinutes, String desiredMood) {
        this.availableMinutes = availableMinutes;
        this.desiredMood = desiredMood;
    }
    
    // Getters and Setters
    public int getAvailableMinutes() { return availableMinutes; }
    public void setAvailableMinutes(int availableMinutes) { 
        this.availableMinutes = availableMinutes; 
    }
    
    public String getDesiredMood() { return desiredMood; }
    public void setDesiredMood(String desiredMood) { 
        this.desiredMood = desiredMood; 
    }
}
