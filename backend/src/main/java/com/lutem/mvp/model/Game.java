package com.lutem.mvp.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;
import com.lutem.mvp.*;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    // Time
    private int minMinutes;
    private int maxMinutes;
    
    // Multi-dimensional attributes - stored as comma-separated strings
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_emotional_goals", joinColumns = @JoinColumn(name = "game_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "emotional_goal")
    private List<EmotionalGoal> emotionalGoals = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private Interruptibility interruptibility;
    
    @Enumerated(EnumType.STRING)
    private EnergyLevel energyRequired;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_time_of_day", joinColumns = @JoinColumn(name = "game_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "time_of_day")
    private List<TimeOfDay> bestTimeOfDay = new ArrayList<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_social_preferences", joinColumns = @JoinColumn(name = "game_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "social_preference")
    private List<SocialPreference> socialPreferences = new ArrayList<>();
    
    // Metadata
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_genres", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "genre")
    private List<String> genres = new ArrayList<>();
    
    @Column(length = 1000)
    private String description;
    
    private String imageUrl;
    private String storeUrl;
    private double userRating;
    
    // Learning metrics
    private double averageSatisfaction;
    private int sessionCount;

    // Constructors
    public Game() {
        this.emotionalGoals = new ArrayList<>();
        this.bestTimeOfDay = new ArrayList<>();
        this.socialPreferences = new ArrayList<>();
        this.genres = new ArrayList<>();
        this.averageSatisfaction = 0.0;
        this.sessionCount = 0;
    }

    public Game(Long id, String name, int minMinutes, int maxMinutes, 
                List<EmotionalGoal> emotionalGoals, Interruptibility interruptibility,
                EnergyLevel energyRequired, List<TimeOfDay> bestTimeOfDay,
                List<SocialPreference> socialPreferences, List<String> genres, String description,
                String imageUrl, String storeUrl, double userRating) {
        this.id = id;
        this.name = name;
        this.minMinutes = minMinutes;
        this.maxMinutes = maxMinutes;
        this.emotionalGoals = emotionalGoals;
        this.interruptibility = interruptibility;
        this.energyRequired = energyRequired;
        this.bestTimeOfDay = bestTimeOfDay;
        this.socialPreferences = socialPreferences;
        this.genres = genres;
        this.description = description;
        this.imageUrl = imageUrl;
        this.storeUrl = storeUrl;
        this.userRating = userRating;
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

    public List<String> getGenres() { return genres; }
    public void setGenres(List<String> genres) { this.genres = genres; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStoreUrl() { return storeUrl; }
    public void setStoreUrl(String storeUrl) { this.storeUrl = storeUrl; }

    public double getUserRating() { return userRating; }
    public void setUserRating(double userRating) { this.userRating = userRating; }

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
