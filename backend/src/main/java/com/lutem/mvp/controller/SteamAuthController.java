package com.lutem.mvp.controller;

import com.lutem.mvp.model.User;
import com.lutem.mvp.service.AuthService;
import com.lutem.mvp.service.SteamService;
import com.lutem.mvp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Controller for Steam OpenID 2.0 authentication.
 * 
 * Flow:
 * 1. User clicks "Login with Steam" → GET /auth/steam/login
 * 2. Redirect to Steam OpenID login page
 * 3. User logs in on Steam
 * 4. Steam redirects back to /auth/steam/callback with claimed_id
 * 5. Validate response with Steam
 * 6. Create/find user, issue JWT
 * 7. Redirect to frontend with token
 */
@RestController
@RequestMapping("/auth/steam")
public class SteamAuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(SteamAuthController.class);
    private static final String STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";
    private static final Pattern STEAM_ID_PATTERN = Pattern.compile("https://steamcommunity\\.com/openid/id/(\\d+)");
    
    private final UserService userService;
    private final SteamService steamService;
    private final AuthService authService;

    @Value("${steam.return-url:http://localhost:8080/auth/steam/callback}")
    private String returnUrl;

    @Value("${steam.realm:http://localhost:8080}")
    private String realm;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${lutem.dev-mode:false}")
    private boolean devMode;

    public SteamAuthController(UserService userService, SteamService steamService, AuthService authService) {
        this.userService = userService;
        this.steamService = steamService;
        this.authService = authService;
    }

    /**
     * Initiate Steam OpenID login.
     * Redirects user to Steam's login page.
     */
    @GetMapping("/login")
    public void login(HttpServletResponse response) throws Exception {
        String openIdUrl = STEAM_OPENID_URL + "?" +
            "openid.ns=" + encode("http://specs.openid.net/auth/2.0") +
            "&openid.mode=checkid_setup" +
            "&openid.return_to=" + encode(returnUrl) +
            "&openid.realm=" + encode(realm) +
            "&openid.identity=" + encode("http://specs.openid.net/auth/2.0/identifier_select") +
            "&openid.claimed_id=" + encode("http://specs.openid.net/auth/2.0/identifier_select");
        
        logger.info("Redirecting to Steam OpenID login");
        response.sendRedirect(openIdUrl);
    }
    
    /**
     * Handle Steam OpenID callback.
     * Validates the response, creates/finds user, issues JWT.
     */
    @GetMapping("/callback")
    public void callback(HttpServletRequest request, HttpServletResponse response) throws Exception {
        logger.info("Steam callback received");
        
        // Get the claimed_id from Steam's response
        String claimedId = request.getParameter("openid.claimed_id");
        if (claimedId == null) {
            logger.error("No claimed_id in Steam response");
            redirectWithError(response, "Steam login failed: no claimed_id");
            return;
        }
        
        // Extract Steam ID from claimed_id (must exactly match Steam's URL format)
        Matcher matcher = STEAM_ID_PATTERN.matcher(claimedId);
        if (!matcher.matches()) {
            logger.error("Invalid Steam claimed_id format");
            redirectWithError(response, "Steam login failed: invalid claimed_id");
            return;
        }
        String steamId64 = matcher.group(1);
        logger.info("Extracted Steam ID: {}", steamId64);
        
        // Validate the response with Steam
        if (!validateWithSteam(request)) {
            logger.error("Steam response validation failed");
            redirectWithError(response, "Steam login failed: validation failed");
            return;
        }
        
        try {
            // Fetch Steam profile info (optional - may fail if API key not configured)
            String personaName = "Steam User";
            String avatarUrl = null;
            
            if (steamService.isConfigured()) {
                Map<String, String> profile = steamService.getPlayerSummary(steamId64);
                personaName = profile.getOrDefault("personaname", "Steam User");
                avatarUrl = profile.get("avatarfull");
            } else {
                logger.warn("Steam API key not configured - using default profile info");
            }
            
            // Find or create user
            User user = userService.findOrCreateBySteamId(steamId64, personaName, avatarUrl);
            logger.info("User authenticated: {} (ID: {})", user.getDisplayName(), user.getId());

            authService.issueTokenCookie(user, response);

            // Redirect to frontend — cookie is set, no token in URL
            String redirectUrl = frontendUrl + "/auth/callback?success=true";
            logger.info("Redirecting to frontend after Steam login");
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            logger.error("Failed to complete Steam login", e);
            redirectWithError(response, "Steam login failed: " + e.getMessage());
        }
    }

    /**
     * Validate the OpenID response by checking with Steam.
     * This prevents spoofing attacks.
     */
    private boolean validateWithSteam(HttpServletRequest request) {
        try {
            // Build validation request params
            Map<String, String> params = new HashMap<>();
            request.getParameterMap().forEach((key, values) -> {
                if (key.startsWith("openid.")) {
                    params.put(key, values[0]);
                }
            });
            params.put("openid.mode", "check_authentication");
            
            // POST to Steam for validation
            String postData = params.entrySet().stream()
                .map(e -> encode(e.getKey()) + "=" + encode(e.getValue()))
                .collect(Collectors.joining("&"));
            
            URL url = new URL(STEAM_OPENID_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            
            try (OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream())) {
                writer.write(postData);
            }
            
            // Read response
            StringBuilder responseBody = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    responseBody.append(line).append("\n");
                }
            }
            
            String result = responseBody.toString();
            boolean isValid = result.contains("is_valid:true");
            logger.info("Steam validation result: {}", isValid);
            return isValid;
            
        } catch (Exception e) {
            logger.error("Steam validation request failed", e);
            return false;
        }
    }
    
    /**
     * Redirect to frontend with error message.
     */
    private void redirectWithError(HttpServletResponse response, String error) throws Exception {
        String redirectUrl = frontendUrl + "/auth/callback?error=" + encode(error);
        response.sendRedirect(redirectUrl);
    }
    
    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
    
    /**
     * Debug endpoint to check auth config.
     * Only available when lutem.dev-mode=true
     */
    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
        if (!devMode) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
            "returnUrl", returnUrl,
            "realm", realm,
            "frontendUrl", frontendUrl,
            "steamApiConfigured", steamService.isConfigured()
        ));
    }
}
