package com.lutem.mvp.config;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory rate limiter to prevent API abuse.
 * Uses a sliding window approach based on client IP.
 *
 * Features:
 * - Configurable requests-per-minute limit
 * - Scheduled cleanup to prevent memory leaks
 * - Max tracked IPs cap to bound memory usage
 * - X-Forwarded-For / X-Real-IP proxy support
 * - Rate limit headers on responses
 *
 * Note: For multi-instance deployment, replace with Redis-backed rate limiting.
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitInterceptor.class);

    /**
     * Maximum number of tracked IPs before evicting oldest entries.
     * Prevents unbounded memory growth under attack.
     */
    private static final int MAX_TRACKED_IPS = 10_000;

    @Value("${lutem.rate-limit.requests-per-minute:60}")
    private int requestsPerMinute;

    @Value("${lutem.rate-limit.auth-requests-per-minute:10}")
    private int authRequestsPerMinute;

    @Value("${lutem.rate-limit.enabled:true}")
    private boolean enabled;

    // Map of IP -> (timestamp_minute -> request_count)
    private final Map<String, Map<Long, AtomicInteger>> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, Map<Long, AtomicInteger>> authRequestCounts = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        logger.info("Rate limiter initialized: {} requests/min (auth: {}/min), enabled={}",
                requestsPerMinute, authRequestsPerMinute, enabled);
    }

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

        // Evict if too many tracked IPs (protection against memory exhaustion)
        if (requestCounts.size() > MAX_TRACKED_IPS) {
            evictOldestEntries();
        }

        // Get or create counter for this IP and minute
        Map<Long, AtomicInteger> ipCounts = requestCounts.computeIfAbsent(clientIp, k -> new ConcurrentHashMap<>());
        AtomicInteger count = ipCounts.computeIfAbsent(currentMinute, k -> new AtomicInteger(0));

        int currentCount = count.incrementAndGet();

        // Stricter limit for auth endpoints (login, callback, dev endpoints)
        String uri = request.getRequestURI();
        if (uri.startsWith("/auth/")) {
            Map<Long, AtomicInteger> authIpCounts = authRequestCounts.computeIfAbsent(clientIp, k -> new ConcurrentHashMap<>());
            AtomicInteger authCount = authIpCounts.computeIfAbsent(currentMinute, k -> new AtomicInteger(0));
            int currentAuthCount = authCount.incrementAndGet();

            if (currentAuthCount > authRequestsPerMinute) {
                logger.warn("Auth rate limit exceeded for IP: {} ({} auth requests/min)", clientIp, currentAuthCount);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write(
                    "{\"error\": \"Too many login attempts. Please try again later.\", \"retryAfterSeconds\": 60}");
                return false;
            }
        }

        // Check global limit
        if (currentCount > requestsPerMinute) {
            logger.warn("Rate limit exceeded for IP: {} ({} requests/min)", clientIp, currentCount);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Rate limit exceeded. Please try again later.\", \"retryAfterSeconds\": 60}");
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
     * Scheduled cleanup of stale minute entries.
     * Runs every 2 minutes to keep memory bounded.
     */
    @Scheduled(fixedRate = 120_000)
    public void cleanupOldEntries() {
        long currentMinute = System.currentTimeMillis() / 60000;
        long oldestAllowedMinute = currentMinute - 2; // Keep last 2 minutes

        requestCounts.forEach((ip, minuteCounts) -> {
            minuteCounts.keySet().removeIf(minute -> minute < oldestAllowedMinute);
        });
        authRequestCounts.forEach((ip, minuteCounts) -> {
            minuteCounts.keySet().removeIf(minute -> minute < oldestAllowedMinute);
        });

        // Remove IPs with no recent requests
        requestCounts.entrySet().removeIf(entry -> entry.getValue().isEmpty());
        authRequestCounts.entrySet().removeIf(entry -> entry.getValue().isEmpty());

        if (logger.isDebugEnabled()) {
            logger.debug("Rate limiter cleanup: tracking {} IPs", requestCounts.size());
        }
    }

    /**
     * Emergency eviction when MAX_TRACKED_IPS is exceeded.
     * Removes all entries older than the current minute.
     */
    private void evictOldestEntries() {
        long currentMinute = System.currentTimeMillis() / 60000;
        requestCounts.forEach((ip, minuteCounts) -> {
            minuteCounts.keySet().removeIf(minute -> minute < currentMinute);
        });
        requestCounts.entrySet().removeIf(entry -> entry.getValue().isEmpty());
        logger.warn("Rate limiter eviction triggered: {} IPs after cleanup", requestCounts.size());
    }
}
