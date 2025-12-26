package com.lutem.mvp.dto;

import com.lutem.mvp.model.ContentRating;
import com.lutem.mvp.model.EmotionalGoal;
import com.lutem.mvp.model.EnergyLevel;
import com.lutem.mvp.model.Interruptibility;
import com.lutem.mvp.model.SocialPreference;
import com.lutem.mvp.model.TimeOfDay;
import java.util.List;

public class RecommendationRequest {
    private int availableMinutes;
    
    // Multi-dimensional preferences
    private List<EmotionalGoal> desiredEmotionalGoals;
    private Interruptibility requiredInterruptibility;
    private EnergyLevel currentEnergyLevel;
    private TimeOfDay timeOfDay;
    private SocialPreference socialPreference;
    
    // Audio/Content filtering (new)
    private String audioAvailability;  // 'full', 'low', 'muted'
    private ContentRating maxContentRating;
    private Boolean allowNsfw;
    
    // Genre preferences (optional)
    private List<String> preferredGenres;
    
    // Optional: let user indicate if time is inferred or selected
    private boolean timeOfDayInferred;
    
    // Firebase user ID for personalized satisfaction-based scoring
    private String userId;

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

    public List<String> getPreferredGenres() { return preferredGenres; }
    public void setPreferredGenres(List<String> preferredGenres) { 
        this.preferredGenres = preferredGenres; 
    }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    // Audio/Content filtering getters and setters
    public String getAudioAvailability() { return audioAvailability; }
    public void setAudioAvailability(String audioAvailability) { 
        this.audioAvailability = audioAvailability; 
    }
    
    public ContentRating getMaxContentRating() { return maxContentRating; }
    public void setMaxContentRating(ContentRating maxContentRating) { 
        this.maxContentRating = maxContentRating; 
    }
    
    public Boolean getAllowNsfw() { return allowNsfw; }
    public void setAllowNsfw(Boolean allowNsfw) { this.allowNsfw = allowNsfw; }
    
    // Helper method for backward compatibility - gets first emotional goal
    public String getDesiredMood() {
        if (desiredEmotionalGoals != null && !desiredEmotionalGoals.isEmpty()) {
            return desiredEmotionalGoals.get(0).name().toLowerCase();
        }
        return null;
    }
}
