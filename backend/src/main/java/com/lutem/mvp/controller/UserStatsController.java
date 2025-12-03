package com.lutem.mvp.controller;

import com.lutem.mvp.dto.SatisfactionStats;
import com.lutem.mvp.service.UserSatisfactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

/**
 * REST controller for user satisfaction statistics.
 * Exposes endpoints for frontend to display gaming insights.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:63342", 
    "https://lutem.3lands.ch", "https://lutemprototype.netlify.app"})
public class UserStatsController {
    
    private final UserSatisfactionService satisfactionService;
    
    @Autowired
    public UserStatsController(UserSatisfactionService satisfactionService) {
        this.satisfactionService = satisfactionService;
    }
    
    /**
     * Get satisfaction statistics for a user.
     * Used by Profile page to display gaming insights.
     * 
     * @param uid Firebase user ID
     * @return Comprehensive satisfaction statistics
     */
    @GetMapping("/{uid}/satisfaction-stats")
    public ResponseEntity<SatisfactionStats> getSatisfactionStats(@PathVariable String uid) {
        try {
            SatisfactionStats stats = satisfactionService.getSatisfactionStats(uid);
            return ResponseEntity.ok(stats);
        } catch (ExecutionException | InterruptedException e) {
            System.err.println("❌ Error fetching satisfaction stats for " + uid + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
