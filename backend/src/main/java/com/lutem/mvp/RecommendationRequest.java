package com.lutem.mvp;

import java.util.List;

public class RecommendationRequest {
    private int availableMinutes;
    
    // Multi-dimensional preferences
    private List<EmotionalGoal> desiredEmotionalGoals;
    private Interruptibility requiredInterruptibility;
    private EnergyLevel currentEnergyLevel;
    private TimeOfDay timeOfDay;
    private SocialPreference socialPreference;
    
    // Optional: let user indicate if time is inferred or selected
    private boolean timeOfDayInferred;

    // Constructors
    public RecommendationRequest() {}

    public RecommendationRequest(int availableMinutes, 
                                 List<EmotionalGoal> desiredEmotionalGoals,
                                 Interruptibility requiredInterruptibility,
                                 EnergyLevel currentEnergyLevel,
                                 TimeOfDay timeOfDay,
                                 SocialPreference socialPreference) {
        this.availableMinutes = availableMinutes;
        this.desiredEmotionalGoals = desiredEmotionalGoals;
        this.requiredInterruptibility = requiredInterruptibility;
        this.currentEnergyLevel = currentEnergyLevel;
        this.timeOfDay = timeOfDay;
        this.socialPreference = socialPreference;
        this.timeOfDayInferred = false;
    }

    // Getters and Setters
    public int getAvailableMinutes() { return availableMinutes; }
    public void setAvailableMinutes(int availableMinutes) { 
        this.availableMinutes = availableMinutes; 
    }

    public List<EmotionalGoal> getDesiredEmotionalGoals() { 
        return desiredEmotionalGoals; 
    }
    public void setDesiredEmotionalGoals(List<EmotionalGoal> desiredEmotionalGoals) { 
        this.desiredEmotionalGoals = desiredEmotionalGoals; 
    }

    public Interruptibility getRequiredInterruptibility() { 
        return requiredInterruptibility; 
    }
    public void setRequiredInterruptibility(Interruptibility requiredInterruptibility) { 
        this.requiredInterruptibility = requiredInterruptibility; 
    }

    public EnergyLevel getCurrentEnergyLevel() { return currentEnergyLevel; }
    public void setCurrentEnergyLevel(EnergyLevel currentEnergyLevel) { 
        this.currentEnergyLevel = currentEnergyLevel; 
    }

    public TimeOfDay getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(TimeOfDay timeOfDay) { this.timeOfDay = timeOfDay; }

    public SocialPreference getSocialPreference() { return socialPreference; }
    public void setSocialPreference(SocialPreference socialPreference) { 
        this.socialPreference = socialPreference; 
    }

    public boolean isTimeOfDayInferred() { return timeOfDayInferred; }
    public void setTimeOfDayInferred(boolean timeOfDayInferred) { 
        this.timeOfDayInferred = timeOfDayInferred; 
    }
}
