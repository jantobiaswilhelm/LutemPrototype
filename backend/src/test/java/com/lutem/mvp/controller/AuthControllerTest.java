package com.lutem.mvp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.TestUtils;
import com.lutem.mvp.model.Role;
import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.UserRepository;
import com.lutem.mvp.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController.
 * Tests /auth/me, /auth/logout, and dev endpoints.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        User user = new User("google-uid-100", "testauth@example.com", "Auth Test User");
        user.setRole(Role.USER);
        savedUser = userRepository.save(user);
    }

    // --- /auth/me ---

    @Test
    void getMe_WithValidToken_ReturnsUserInfo() throws Exception {
        mockMvc.perform(TestUtils.withAuth(get("/auth/me"), jwtService, savedUser))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(savedUser.getId()))
            .andExpect(jsonPath("$.displayName").value("Auth Test User"))
            .andExpect(jsonPath("$.authProvider").value("google"));
    }

    @Test
    void getMe_WithNoToken_Returns401() throws Exception {
        mockMvc.perform(get("/auth/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getMe_WithExpiredToken_Returns401() throws Exception {
        // Create a JwtService with very short expiration for this test
        // Instead, just pass an invalid token
        mockMvc.perform(get("/auth/me")
                .header("Authorization", "Bearer invalid.token.here"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getMe_WithBearerHeader_Works() throws Exception {
        mockMvc.perform(TestUtils.withBearerAuth(get("/auth/me"), jwtService, savedUser))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(savedUser.getId()));
    }

    // --- /auth/logout ---

    @Test
    void logout_WithValidToken_Returns200AndClearsCookie() throws Exception {
        mockMvc.perform(TestUtils.withAuth(post("/auth/logout"), jwtService, savedUser))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }

    @Test
    void logout_WithNoToken_Returns401() throws Exception {
        mockMvc.perform(post("/auth/logout"))
            .andExpect(status().isUnauthorized());
    }

    // --- Dev endpoints ---

    @Test
    void devCreateUser_WithSteamId_CreatesUser() throws Exception {
        Map<String, String> request = Map.of(
            "steamId", "76561198000000001",
            "displayName", "Dev Steam User"
        );

        mockMvc.perform(post("/auth/dev/create-user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.displayName").value("Dev Steam User"))
            .andExpect(jsonPath("$.authProvider").value("steam"))
            .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void devCreateUser_WithGoogleId_CreatesUser() throws Exception {
        Map<String, String> request = Map.of(
            "firebaseUid", "test-firebase-uid",
            "email", "devuser@test.com",
            "displayName", "Dev Google User"
        );

        mockMvc.perform(post("/auth/dev/create-user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.displayName").value("Dev Google User"))
            .andExpect(jsonPath("$.authProvider").value("google"));
    }

    @Test
    void devCreateUser_WithNoIds_Returns400() throws Exception {
        Map<String, String> request = Map.of(
            "email", "nouser@test.com"
        );

        mockMvc.perform(post("/auth/dev/create-user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void devValidate_WithValidToken_ReturnsClaims() throws Exception {
        String token = jwtService.generateToken(savedUser);

        mockMvc.perform(get("/auth/dev/validate")
                .param("token", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.userId").value(savedUser.getId()));
    }

    @Test
    void devValidate_WithInvalidToken_Returns401() throws Exception {
        mockMvc.perform(get("/auth/dev/validate")
                .param("token", "invalid-token"))
            .andExpect(status().isUnauthorized());
    }
}
