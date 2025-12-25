package com.lutem.mvp.controller;

import com.lutem.mvp.dto.SteamImportResponse;
import com.lutem.mvp.dto.UserLibraryGameDTO;
import com.lutem.mvp.service.SteamService;
import com.lutem.mvp.service.UserLibraryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Steam integration endpoints.
 */
@RestController
@RequestMapping("/api/steam")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5500", "https://lutembeta.netlify.app"})
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
     * 
     * GET /api/steam/status
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
     * 
     * POST /api/steam/import
     * 
     * Request body:
     * {
     *   "steamId": "76561198012345678"  // 64-bit Steam ID
     * }
     * 
     * Headers:
     *   X-Firebase-UID: user's Firebase UID
     */
    @PostMapping("/import")
    public ResponseEntity<?> importLibrary(
            @RequestBody Map<String, String> request,
            @RequestHeader("X-Firebase-UID") String firebaseUid) {
        
        String steamId = request.get("steamId");
        
        if (steamId == null || steamId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Missing steamId",
                "message", "Please provide your 64-bit Steam ID"
            ));
        }
        
        // Validate Steam ID format (should be 17 digits)
        if (!steamId.matches("\\d{17}")) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid steamId format",
                "message", "Steam ID should be a 17-digit number (64-bit format). " +
                          "You can find it at steamid.io"
            ));
        }
        
        try {
            logger.info("Starting Steam import for user {} with Steam ID {}", firebaseUid, steamId);
            SteamImportResponse response = steamService.importSteamLibrary(steamId, firebaseUid);
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
     * 
     * GET /api/steam/library
     * 
     * Headers:
     *   X-Firebase-UID: user's Firebase UID
     */
    @GetMapping("/library")
    public ResponseEntity<?> getLibrarySummary(
            @RequestHeader("X-Firebase-UID") String firebaseUid) {
        
        try {
            Map<String, Object> summary = userLibraryService.getLibrarySummary(firebaseUid);
            List<UserLibraryGameDTO> games = userLibraryService.getUserLibrary(firebaseUid);
            
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
