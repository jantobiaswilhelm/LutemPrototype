package com.lutem.mvp.service;

import com.lutem.mvp.model.User;
import com.lutem.mvp.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Shared authentication service handling JWT cookie management
 * and user response building for both Google and Steam auth flows.
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final int COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

    private final JwtService jwtService;

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * Generate a JWT for the user and set it as an httpOnly cookie.
     * Returns the generated token (for dev endpoints that need to return it).
     */
    public String issueTokenCookie(User user, HttpServletResponse response) {
        String token = jwtService.generateToken(user);

        Cookie cookie = new Cookie("lutem_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(COOKIE_MAX_AGE);
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);

        logger.info("Issued auth cookie for user {} (ID: {})", user.getDisplayName(), user.getId());
        return token;
    }

    /**
     * Clear the auth cookie (logout).
     */
    public void clearTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("lutem_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }

    /**
     * Build a standard user info map for API responses.
     */
    public Map<String, Object> buildUserResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("displayName", user.getDisplayName());
        userMap.put("email", user.getEmail() != null ? user.getEmail() : "");
        userMap.put("avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "");
        userMap.put("authProvider", user.getAuthProvider());

        if (user.getSteamId() != null) {
            userMap.put("steamId", user.getSteamId());
        }
        if (user.getGoogleId() != null) {
            userMap.put("googleId", user.getGoogleId());
        }

        return userMap;
    }
}
