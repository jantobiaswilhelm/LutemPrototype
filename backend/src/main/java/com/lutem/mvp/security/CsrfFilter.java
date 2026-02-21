package com.lutem.mvp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Set;

/**
 * CSRF protection using the double-submit cookie pattern.
 *
 * On every response, sets a non-httpOnly cookie "XSRF-TOKEN" with a random token.
 * On mutating requests (POST/PUT/DELETE), validates that the "X-XSRF-TOKEN" header
 * matches the cookie value.
 *
 * The cookie is readable by JavaScript so the frontend can read and send the header.
 */
@Component
public class CsrfFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(CsrfFilter.class);
    private static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";
    private static final String CSRF_HEADER_NAME = "X-XSRF-TOKEN";
    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS");
    private static final SecureRandom secureRandom = new SecureRandom();

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod().toUpperCase();

        // Always ensure a CSRF cookie exists
        String cookieToken = getCsrfCookie(request);
        if (cookieToken == null) {
            cookieToken = generateToken();
            setCsrfCookie(response, cookieToken);
        }

        // Safe methods don't need CSRF validation
        if (SAFE_METHODS.contains(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Skip CSRF for auth callback endpoints (Steam redirect, no JS involved)
        String path = request.getRequestURI();
        if (path.startsWith("/auth/steam/") || path.startsWith("/auth/google/login") || path.startsWith("/auth/dev/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Validate CSRF token on mutating requests
        String headerToken = request.getHeader(CSRF_HEADER_NAME);
        if (headerToken == null || !headerToken.equals(cookieToken)) {
            logger.warn("CSRF validation failed for {} {} (header: {}, cookie: {})",
                method, path,
                headerToken != null ? "present" : "missing",
                cookieToken != null ? "present" : "missing");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"CSRF token missing or invalid\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getCsrfCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        return Arrays.stream(cookies)
            .filter(c -> CSRF_COOKIE_NAME.equals(c.getName()))
            .findFirst()
            .map(Cookie::getValue)
            .orElse(null);
    }

    private void setCsrfCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(CSRF_COOKIE_NAME, token);
        cookie.setHttpOnly(false); // Must be readable by JavaScript
        cookie.setSecure(!frontendUrl.startsWith("http://localhost"));
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
