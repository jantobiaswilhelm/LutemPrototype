package com.lutem.mvp.controller;

import com.lutem.mvp.dto.SteamImportResponse;
import com.lutem.mvp.dto.UserLibraryGameDTO;
import com.lutem.mvp.service.SteamService;
import com.lutem.mvp.service.UserLibraryService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Steam integration endpoints.
 * Requires JWT authentication (via JwtAuthFilter).
 */
@RestController
@RequestMapping("/api/steam")
public class SteamController {
    
    private static final Logger logger = LoggerFactory.getLogger(SteamController.class);
    
    private final SteamService steamService;
    private final UserLibraryService userLibraryService;
    
    public SteamController(SteamService steamService, UserLibraryService userLibraryService) {
        this.steamService = steamService;
        this.userLibraryService = userLibraryService;
    }
    
    /**
     * Check if Steam integration is available.
     * Public endpoint - no auth required.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        boolean configured = steamService.isConfigured();
        return ResponseEntity.ok(Map.of(
            "configured", configured,
            "message", configured ? 
                "Steam integration is ready" : 
                "Steam API key not configured. Set STEAM_API_KEY environment variable."
        ));
    }
    
    /**
     * Import user's Steam library.
     * Requires JWT authentication.
     * 
     * If user logged in via Steam, uses their Steam ID automatically.
     * If user logged in via Google, requires steamId in request body.
     */
    @PostMapping("/import")
    public ResponseEntity<?> importLibrary(
            @RequestBody(required = false) Map<String, String> request,
            HttpServletRequest httpRequest) {
        
        Long userId = (Long) httpRequest.getAttribute("userId");
        String authSteamId = (String) httpRequest.getAttribute("steamId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "Authentication required"
            ));
        }
        
        // Determine Steam ID to use
        String steamId64;
        if (authSteamId != null && !authSteamId.isEmpty()) {
            // User logged in via Steam - use their Steam ID
            steamId64 = authSteamId;
            logger.info("Using authenticated Steam ID: {}", steamId64);
        } else {
            // User logged in via Google - need Steam ID from request
            String steamInput = request != null ? request.get("steamId") : null;
            if (steamInput == null || steamInput.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing steamId",
                    "message", "Please provide your Steam ID or profile URL"
                ));
            }
            try {
                steamId64 = steamService.resolveSteamId(steamInput);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid Steam ID",
                    "message", e.getMessage()
                ));
            }
        }
        
        try {
            logger.info("Starting Steam import for user {} with Steam ID {}", userId, steamId64);
            SteamImportResponse response = steamService.importSteamLibraryByUserId(steamId64, userId);
            return ResponseEntity.ok(response);
            
        } catch (IllegalStateException e) {
            logger.error("Steam API not configured", e);
            return ResponseEntity.status(503).body(Map.of(
                "error", "Service unavailable",
                "message", "Steam integration is not configured on this server"
            ));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Bad request",
                "message", e.getMessage()
            ));
        } catch (RuntimeException e) {
            logger.error("Steam import failed", e);
            return ResponseEntity.status(502).body(Map.of(
                "error", "Steam API error",
                "message", "Failed to fetch data from Steam. " +
                          "Make sure your Steam profile and game details are set to public."
            ));
        }
    }
    
    /**
     * Get user's imported library summary.
     * Requires JWT authentication.
     */
    @GetMapping("/library")
    public ResponseEntity<?> getLibrarySummary(HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "Authentication required"
            ));
        }
        
        try {
            Map<String, Object> summary = userLibraryService.getLibrarySummaryByUserId(userId);
            List<UserLibraryGameDTO> games = userLibraryService.getUserLibraryByUserId(userId);
            
            return ResponseEntity.ok(Map.of(
                "summary", summary,
                "games", games
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Bad request",
                "message", e.getMessage()
            ));
        }
    }
}
