package com.lutem.mvp;

import com.lutem.mvp.model.Role;
import com.lutem.mvp.model.User;
import com.lutem.mvp.security.JwtService;
import jakarta.servlet.http.Cookie;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * Shared test utilities for generating auth tokens and test data.
 */
public class TestUtils {

    private static final String CSRF_TOKEN = "test-csrf-token";

    /**
     * Create a test user with the given role and Google auth.
     */
    public static User createGoogleUser(Long id, String email, Role role) {
        User user = new User("google-uid-" + id, email, "Test User " + id);
        user.setId(id);
        user.setRole(role);
        return user;
    }

    /**
     * Create a test user with Steam auth.
     */
    public static User createSteamUser(Long id, String steamId, Role role) {
        User user = User.fromSteam(steamId, "Steam User " + id, null);
        user.setId(id);
        user.setRole(role);
        return user;
    }

    /**
     * Add a valid JWT auth cookie to a MockMvc request.
     * Also adds CSRF token for mutating requests.
     */
    public static MockHttpServletRequestBuilder withAuth(
            MockHttpServletRequestBuilder request, JwtService jwtService, User user) {
        String token = jwtService.generateToken(user);
        return request
            .cookie(new Cookie("lutem_token", token))
            .cookie(new Cookie("XSRF-TOKEN", CSRF_TOKEN))
            .header("X-XSRF-TOKEN", CSRF_TOKEN);
    }

    /**
     * Add a valid JWT Bearer header to a MockMvc request.
     * Also adds CSRF token for mutating requests.
     */
    public static MockHttpServletRequestBuilder withBearerAuth(
            MockHttpServletRequestBuilder request, JwtService jwtService, User user) {
        String token = jwtService.generateToken(user);
        return request
            .header("Authorization", "Bearer " + token)
            .cookie(new Cookie("XSRF-TOKEN", CSRF_TOKEN))
            .header("X-XSRF-TOKEN", CSRF_TOKEN);
    }

    /**
     * Add CSRF tokens (cookie + header) to a request without auth.
     */
    public static MockHttpServletRequestBuilder withCsrf(MockHttpServletRequestBuilder request) {
        return request
            .cookie(new Cookie("XSRF-TOKEN", CSRF_TOKEN))
            .header("X-XSRF-TOKEN", CSRF_TOKEN);
    }
}
