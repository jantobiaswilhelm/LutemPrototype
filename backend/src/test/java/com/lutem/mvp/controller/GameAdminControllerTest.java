package com.lutem.mvp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lutem.mvp.TestUtils;
import com.lutem.mvp.model.*;
import com.lutem.mvp.repository.GameRepository;
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

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for GameAdminController.
 * Verifies RBAC: admin-only access, rejection of non-admin users.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class GameAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private JwtService jwtService;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        adminUser = TestUtils.createGoogleUser(1L, "admin@lutem.dev", Role.ADMIN);
        regularUser = TestUtils.createGoogleUser(2L, "user@example.com", Role.USER);
        gameRepository.deleteAll();
    }

    // --- Access Control ---

    @Test
    void adminEndpoint_WithNoAuth_Returns401() throws Exception {
        mockMvc.perform(get("/admin/games"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpoint_WithRegularUser_Returns403() throws Exception {
        mockMvc.perform(TestUtils.withAuth(get("/admin/games"), jwtService, regularUser))
            .andExpect(status().isForbidden());
    }

    @Test
    void adminEndpoint_WithAdmin_Returns200() throws Exception {
        mockMvc.perform(TestUtils.withAuth(get("/admin/games"), jwtService, adminUser))
            .andExpect(status().isOk());
    }

    // --- CRUD ---

    @Test
    void addGame_AsAdmin_CreatesGame() throws Exception {
        Map<String, Object> game = new HashMap<>();
        game.put("name", "Admin Added Game");
        game.put("minMinutes", 15);
        game.put("maxMinutes", 30);
        game.put("emotionalGoals", Arrays.asList("UNWIND"));
        game.put("interruptibility", "HIGH");
        game.put("energyRequired", "LOW");
        game.put("socialPreferences", Arrays.asList("SOLO"));
        game.put("bestTimeOfDay", Arrays.asList("ANY"));

        mockMvc.perform(TestUtils.withAuth(
                post("/admin/games")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(game)),
                jwtService, adminUser))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Admin Added Game"));
    }

    @Test
    void addGame_AsRegularUser_Returns403() throws Exception {
        Map<String, Object> game = Map.of("name", "Hacker Game");

        mockMvc.perform(TestUtils.withAuth(
                post("/admin/games")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(game)),
                jwtService, regularUser))
            .andExpect(status().isForbidden());
    }

    @Test
    void deleteGame_AsAdmin_DeletesGame() throws Exception {
        // Create a game first
        Game game = new Game();
        game.setName("To Delete");
        game.setMinMinutes(10);
        game.setMaxMinutes(20);
        game.setEmotionalGoals(Arrays.asList(EmotionalGoal.UNWIND));
        game.setInterruptibility(Interruptibility.HIGH);
        game.setEnergyRequired(EnergyLevel.LOW);
        game.setSocialPreferences(Arrays.asList(SocialPreference.SOLO));
        game.setBestTimeOfDay(Arrays.asList(TimeOfDay.ANY));
        game = gameRepository.save(game);

        mockMvc.perform(TestUtils.withAuth(
                delete("/admin/games/" + game.getId()),
                jwtService, adminUser))
            .andExpect(status().isOk());
    }

    @Test
    void wipeDatabase_AsRegularUser_Returns403() throws Exception {
        mockMvc.perform(TestUtils.withAuth(
                delete("/admin/games/wipe"),
                jwtService, regularUser))
            .andExpect(status().isForbidden());
    }

    // --- Stats ---

    @Test
    void getStats_AsAdmin_ReturnsStatistics() throws Exception {
        mockMvc.perform(TestUtils.withAuth(
                get("/admin/games/stats"),
                jwtService, adminUser))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total").exists())
            .andExpect(jsonPath("$.pending").exists())
            .andExpect(jsonPath("$.fullyTagged").exists());
    }
}
