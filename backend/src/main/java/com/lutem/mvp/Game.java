package com.lutem.mvp;

import java.util.List;

public class Game {
    private Long id;
    private String name;
    private int minMinutes;
    private int maxMinutes;
    private List<String> moodTags;
    private String interruptibility;
    
    // Constructors
    public Game() {}
    
    public Game(Long id, String name, int minMinutes, int maxMinutes, 
                List<String> moodTags, String interruptibility) {
        this.id = id;
        this.name = name;
        this.minMinutes = minMinutes;
        this.maxMinutes = maxMinutes;
        this.moodTags = moodTags;
        this.interruptibility = interruptibility;
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
    
    public List<String> getMoodTags() { return moodTags; }
    public void setMoodTags(List<String> moodTags) { this.moodTags = moodTags; }
    
    public String getInterruptibility() { return interruptibility; }
    public void setInterruptibility(String interruptibility) { 
        this.interruptibility = interruptibility; 
    }
}
