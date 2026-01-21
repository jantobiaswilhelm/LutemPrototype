package com.lutem.mvp.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory rate limiter to prevent API abuse.
 * Uses a sliding window approach based on client IP.
 *
 * Note: For production at scale, consider using Redis-based rate limiting.
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitInterceptor.class);

    @Value("${lutem.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    @Value("${lutem.rate-limit.enabled:true}")
    private boolean enabled;

    // Map of IP -> (timestamp_minute -> request_count)
    private final Map<String, Map<Long, AtomicInteger>> requestCounts = new ConcurrentHashMap<>();

    // Cleanup old entries every 5 minutes
    private long lastCleanup = System.currentTimeMillis();
    private static final long CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        if (!enabled) {
            return true;
        }

        // Skip rate limiting for OPTIONS requests (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String clientIp = getClientIp(request);
        long currentMinute = System.currentTimeMillis() / 60000;

        // Periodic cleanup of old entries
        cleanupOldEntries();

        // Get or create counter for this IP and minute
        Map<Long, AtomicInteger> ipCounts = requestCounts.computeIfAbsent(clientIp, k -> new ConcurrentHashMap<>());
        AtomicInteger count = ipCounts.computeIfAbsent(currentMinute, k -> new AtomicInteger(0));

        int currentCount = count.incrementAndGet();

        // Check if over limit
        if (currentCount > requestsPerMinute) {
            logger.warn("Rate limit exceeded for IP: {} ({} requests/min)", clientIp, currentCount);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Rate limit exceeded. Please try again later.\", \"retryAfterSeconds\": 60}");
            return false;
        }

        // Add rate limit headers
        response.setHeader("X-RateLimit-Limit", String.valueOf(requestsPerMinute));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(Math.max(0, requestsPerMinute - currentCount)));

        return true;
    }

    /**
     * Extract client IP, handling proxies.
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP in the chain (original client)
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }

    /**
     * Clean up old minute entries to prevent memory leaks.
     */
    private void cleanupOldEntries() {
        long now = System.currentTimeMillis();
        if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
            return;
        }

        lastCleanup = now;
        long currentMinute = now / 60000;
        long oldestAllowedMinute = currentMinute - 2; // Keep last 2 minutes

        requestCounts.forEach((ip, minuteCounts) -> {
            minuteCounts.keySet().removeIf(minute -> minute < oldestAllowedMinute);
        });

        // Remove IPs with no recent requests
        requestCounts.entrySet().removeIf(entry -> entry.getValue().isEmpty());

        logger.debug("Rate limiter cleanup complete. Tracking {} IPs", requestCounts.size());
    }
}
