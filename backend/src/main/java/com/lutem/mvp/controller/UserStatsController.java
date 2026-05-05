package com.lutem.mvp.controller;

import com.lutem.mvp.dto.SatisfactionStats;
import com.lutem.mvp.dto.WeeklySummary;
import com.lutem.mvp.service.UserSatisfactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

/**
 * REST controller for user satisfaction statistics.
 * Exposes endpoints for frontend to display gaming insights.
 */
@RestController
@RequestMapping("/api/users")
public class UserStatsController {

    private static final Logger logger = LoggerFactory.getLogger(UserStatsController.class);

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
    public ResponseEntity<SatisfactionStats> getSatisfactionStats(
            @PathVariable String uid,
            HttpServletRequest request) {
        if (!isOwner(request, uid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            SatisfactionStats stats = satisfactionService.getSatisfactionStats(uid);
            return ResponseEntity.ok(stats);
        } catch (ExecutionException | InterruptedException e) {
            logger.error("Error fetching satisfaction stats for {}: {}", uid, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get weekly summary for a user.
     * Used by dashboard to display recent activity recap.
     *
     * @param uid Firebase user ID
     * @return Weekly activity summary
     */
    @GetMapping("/{uid}/summary/weekly")
    public ResponseEntity<WeeklySummary> getWeeklySummary(
            @PathVariable String uid,
            HttpServletRequest request) {
        if (!isOwner(request, uid)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        try {
            WeeklySummary summary = satisfactionService.getWeeklySummary(uid);
            return ResponseEntity.ok(summary);
        } catch (ExecutionException | InterruptedException e) {
            logger.error("Error fetching weekly summary for {}: {}", uid, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private boolean isOwner(HttpServletRequest request, String uid) {
        String authenticatedUid = (String) request.getAttribute("firebaseUid");
        return authenticatedUid != null && authenticatedUid.equals(uid);
    }
}
