package com.lutem.mvp;

import java.util.List;
import java.util.ArrayList;

public class Game {
    private Long id;
    private String name;
    
    // Time
    private int minMinutes;
    private int maxMinutes;
    
    // Multi-dimensional attributes
    private List<EmotionalGoal> emotionalGoals;
    private Interruptibility interruptibility;
    private EnergyLevel energyRequired;
    private List<TimeOfDay> bestTimeOfDay;
    private List<SocialPreference> socialPreferences;
    
    // Metadata
    private String genre;
    private String description;
    private String imageUrl;  // Game cover art URL
    
    // Learning metrics
    private double averageSatisfaction;
    private int sessionCount;

    // Constructors
    public Game() {
        this.emotionalGoals = new ArrayList<>();
        this.bestTimeOfDay = new ArrayList<>();
        this.socialPreferences = new ArrayList<>();
        this.averageSatisfaction = 0.0;
        this.sessionCount = 0;
    }

    public Game(Long id, String name, int minMinutes, int maxMinutes, 
                List<EmotionalGoal> emotionalGoals, Interruptibility interruptibility,
                EnergyLevel energyRequired, List<TimeOfDay> bestTimeOfDay,
                List<SocialPreference> socialPreferences, String genre, String description,
                String imageUrl) {
        this.id = id;
        this.name = name;
        this.minMinutes = minMinutes;
        this.maxMinutes = maxMinutes;
        this.emotionalGoals = emotionalGoals;
        this.interruptibility = interruptibility;
        this.energyRequired = energyRequired;
        this.bestTimeOfDay = bestTimeOfDay;
        this.socialPreferences = socialPreferences;
        this.genre = genre;
        this.description = description;
        this.imageUrl = imageUrl;
        this.averageSatisfaction = 0.0;
        this.sessionCount = 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getMinMinutes() { return minMinutes; }
    public void setMinMinutes(int minMinutes) { this.minMinutes = minMinutes; }

    public int getMaxMinutes() { return maxMinutes; }
    public void setMaxMinutes(int maxMinutes) { this.maxMinutes = maxMinutes; }

    public List<EmotionalGoal> getEmotionalGoals() { return emotionalGoals; }
    public void setEmotionalGoals(List<EmotionalGoal> emotionalGoals) { 
        this.emotionalGoals = emotionalGoals; 
    }

    public Interruptibility getInterruptibility() { return interruptibility; }
    public void setInterruptibility(Interruptibility interruptibility) { 
        this.interruptibility = interruptibility; 
    }

    public EnergyLevel getEnergyRequired() { return energyRequired; }
    public void setEnergyRequired(EnergyLevel energyRequired) { 
        this.energyRequired = energyRequired; 
    }

    public List<TimeOfDay> getBestTimeOfDay() { return bestTimeOfDay; }
    public void setBestTimeOfDay(List<TimeOfDay> bestTimeOfDay) { 
        this.bestTimeOfDay = bestTimeOfDay; 
    }

    public List<SocialPreference> getSocialPreferences() { return socialPreferences; }
    public void setSocialPreferences(List<SocialPreference> socialPreferences) { 
        this.socialPreferences = socialPreferences; 
    }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public double getAverageSatisfaction() { return averageSatisfaction; }
    public void setAverageSatisfaction(double averageSatisfaction) { 
        this.averageSatisfaction = averageSatisfaction; 
    }

    public int getSessionCount() { return sessionCount; }
    public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; }

    // Helper methods
    public boolean hasEmotionalGoal(EmotionalGoal goal) {
        return emotionalGoals.contains(goal);
    }

    public boolean isSuitableForTimeOfDay(TimeOfDay timeOfDay) {
        return bestTimeOfDay.contains(timeOfDay) || bestTimeOfDay.contains(TimeOfDay.ANY);
    }

    public boolean matchesSocialPreference(SocialPreference preference) {
        return socialPreferences.contains(preference) || 
               socialPreferences.contains(SocialPreference.BOTH);
    }
}
