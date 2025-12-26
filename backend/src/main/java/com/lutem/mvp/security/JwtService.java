package com.lutem.mvp.security;

import com.lutem.mvp.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for JWT token generation and validation.
 * Used for session management after Steam or Google login.
 */
@Service
public class JwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    
    private final SecretKey secretKey;
    private final long expirationMs;
    
    public JwtService(
            @Value("${jwt.secret:REDACTED_JWT_SECRET}") String secret,
            @Value("${jwt.expiration-ms:604800000}") long expirationMs) { // 7 days default
        
        // Ensure secret is at least 256 bits (32 bytes)
        if (secret.length() < 32) {
            secret = secret + "0".repeat(32 - secret.length());
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
        
        logger.info("JwtService initialized with {}ms expiration", expirationMs);
    }
    
    /**
     * Generate a JWT token for a user after successful authentication.
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("displayName", user.getDisplayName());
        claims.put("authProvider", user.getAuthProvider());
        
        if (user.getSteamId() != null) {
            claims.put("steamId", user.getSteamId());
        }
        if (user.getGoogleId() != null) {
            claims.put("googleId", user.getGoogleId());
        }
        if (user.getEmail() != null) {
            claims.put("email", user.getEmail());
        }
        if (user.getAvatarUrl() != null) {
            claims.put("avatarUrl", user.getAvatarUrl());
        }
        
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }
    
    /**
     * Validate a JWT token and extract claims.
     * Returns null if token is invalid or expired.
     */
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token expired: {}", e.getMessage());
            return null;
        } catch (JwtException e) {
            logger.warn("Invalid JWT token: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Extract user ID from a valid token.
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        if (claims == null) {
            return null;
        }
        return claims.get("userId", Long.class);
    }
    
    /**
     * Check if a token is valid (not expired and properly signed).
     */
    public boolean isTokenValid(String token) {
        return validateToken(token) != null;
    }
}
