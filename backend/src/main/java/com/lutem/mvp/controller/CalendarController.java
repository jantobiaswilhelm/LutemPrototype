package com.lutem.mvp.controller;

import com.lutem.mvp.dto.CalendarEventDTO;
import com.lutem.mvp.dto.UserSummaryDTO;
import com.lutem.mvp.model.CalendarEvent;
import com.lutem.mvp.model.CalendarEvent.EventVisibility;
import com.lutem.mvp.model.EventParticipant;
import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.CalendarEventRepository;
import com.lutem.mvp.repository.GameRepository;
import com.lutem.mvp.repository.UserRepository;
import com.lutem.mvp.service.CalendarService;
import com.lutem.mvp.service.FriendshipService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    private static final Logger logger = LoggerFactory.getLogger(CalendarController.class);

    private final CalendarEventRepository eventRepository;
    private final CalendarService calendarService;
    private final FriendshipService friendshipService;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public CalendarController(
            CalendarEventRepository eventRepository,
            CalendarService calendarService,
            FriendshipService friendshipService,
            UserRepository userRepository,
            GameRepository gameRepository) {
        this.eventRepository = eventRepository;
        this.calendarService = calendarService;
        this.friendshipService = friendshipService;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    private User getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) return null;
        return userRepository.findById(userId).orElse(null);
    }

    /**
     * GET /calendar/events - Get events visible to the current user
     */
    @GetMapping("/events")
    public ResponseEntity<?> getEvents(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestParam(required = false, defaultValue = "false") boolean friendsOnly,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);

        LocalDateTime startDate = start != null
            ? parseDateTime(start)
            : LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = end != null
            ? parseDateTime(end)
            : LocalDateTime.now().plusDays(30);

        if (startDate == null) startDate = LocalDateTime.now().minusDays(7);
        if (endDate == null) endDate = LocalDateTime.now().plusDays(30);

        List<CalendarEvent> events;

        if (currentUser != null) {
            if (friendsOnly) {
                events = calendarService.getFriendsEvents(currentUser, startDate, endDate);
            } else {
                events = calendarService.getVisibleEvents(currentUser, startDate, endDate);
            }
        } else {
            // Anonymous users only see public events
            events = eventRepository.findPublicEventsInRange(startDate, endDate);
        }

        List<CalendarEventDTO> dtos = events.stream()
            .map(e -> enrichEventDTO(e, currentUser))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /calendar/events/mine - Get only the user's own events
     */
    @GetMapping("/events/mine")
    public ResponseEntity<?> getMyEvents(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        LocalDateTime startDate = start != null ? parseDateTime(start) : LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = end != null ? parseDateTime(end) : LocalDateTime.now().plusDays(30);
        if (startDate == null) startDate = LocalDateTime.now().minusDays(7);
        if (endDate == null) endDate = LocalDateTime.now().plusDays(30);

        List<CalendarEvent> events = calendarService.getOwnEvents(currentUser, startDate, endDate);

        List<CalendarEventDTO> dtos = events.stream()
            .map(e -> enrichEventDTO(e, currentUser))
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * POST /calendar/events - Create a new event
     */
    @PostMapping("/events")
    public ResponseEntity<?> createEvent(
            @RequestBody CalendarEvent event,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);

        if (event.getSourceType() == null) {
            event.setSourceType("MANUAL");
        }

        CalendarEvent saved;
        if (currentUser != null) {
            saved = calendarService.createEvent(event, currentUser);
        } else {
            // Legacy: allow anonymous event creation
            saved = eventRepository.save(event);
        }

        return ResponseEntity.ok(enrichEventDTO(saved, currentUser));
    }

    /**
     * PUT /calendar/events/{id} - Update an event
     */
    @PutMapping("/events/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody CalendarEvent eventUpdates,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        CalendarEvent event = eventRepository.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        // Check ownership if event has owner
        if (event.getOwner() != null) {
            if (currentUser == null || !event.isOwnedBy(currentUser)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Only the owner can update this event"));
            }
        }

        // Update fields
        event.setTitle(eventUpdates.getTitle());
        event.setStartTime(eventUpdates.getStartTime());
        event.setEndTime(eventUpdates.getEndTime());
        event.setType(eventUpdates.getType());
        event.setGameId(eventUpdates.getGameId());
        event.setDescription(eventUpdates.getDescription());

        if (eventUpdates.getVisibility() != null) {
            event.setVisibility(eventUpdates.getVisibility());
        }
        if (eventUpdates.getMaxParticipants() != null) {
            event.setMaxParticipants(eventUpdates.getMaxParticipants());
        }

        CalendarEvent saved = eventRepository.save(event);
        return ResponseEntity.ok(enrichEventDTO(saved, currentUser));
    }

    /**
     * DELETE /calendar/events/{id} - Delete an event
     */
    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        CalendarEvent event = eventRepository.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        // Check ownership if event has owner
        if (event.getOwner() != null) {
            if (currentUser == null || !event.isOwnedBy(currentUser)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Only the owner can delete this event"));
            }
        }

        eventRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted"));
    }

    /**
     * GET /calendar/events/{id} - Get a single event with full details
     */
    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEvent(
            @PathVariable Long id,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        CalendarEvent event = eventRepository.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        // Check visibility
        if (event.getOwner() != null && currentUser != null) {
            boolean isFriend = friendshipService.areFriends(currentUser, event.getOwner());
            if (!event.canBeViewedBy(currentUser, isFriend)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "You don't have access to this event"));
            }
        }

        // Include participants for detailed view
        List<EventParticipant> participants = calendarService.getJoinedParticipants(event);
        CalendarEventDTO dto = new CalendarEventDTO(event, participants);
        setUserContext(dto, event, currentUser);
        enrichWithGameName(dto);

        return ResponseEntity.ok(dto);
    }

    // ========== Social Endpoints ==========

    /**
     * POST /calendar/events/{id}/join - Join an event
     */
    @PostMapping("/events/{id}/join")
    public ResponseEntity<?> joinEvent(
            @PathVariable Long id,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        CalendarEvent event = eventRepository.findById(id).orElse(null);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            EventParticipant participant = calendarService.joinEvent(event, currentUser);
            return ResponseEntity.ok(Map.of(
                "message", "Joined event",
                "participant", new CalendarEventDTO.ParticipantDTO(participant)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /calendar/events/{id}/leave - Leave an event
     */
    @PostMapping("/events/{id}/leave")
    public ResponseEntity<?> leaveEvent(
            @PathVariable Long id,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        CalendarEvent event = eventRepository.findById(id).orElse(null);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            calendarService.leaveEvent(event, currentUser);
            return ResponseEntity.ok(Map.of("message", "Left event"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /calendar/events/{id}/invite/{userId} - Invite a friend to an event
     */
    @PostMapping("/events/{id}/invite/{userId}")
    public ResponseEntity<?> inviteToEvent(
            @PathVariable Long id,
            @PathVariable Long userId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        CalendarEvent event = eventRepository.findById(id).orElse(null);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        User invitee = userRepository.findById(userId).orElse(null);
        if (invitee == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        try {
            EventParticipant participant = calendarService.inviteToEvent(event, currentUser, invitee);
            return ResponseEntity.ok(Map.of(
                "message", "Invitation sent",
                "invitation", new CalendarEventDTO.ParticipantDTO(participant)
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /calendar/events/{id}/participants - Get event participants
     */
    @GetMapping("/events/{id}/participants")
    public ResponseEntity<?> getParticipants(
            @PathVariable Long id,
            HttpServletRequest request) {

        CalendarEvent event = eventRepository.findById(id).orElse(null);
        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        List<EventParticipant> participants = calendarService.getJoinedParticipants(event);
        List<CalendarEventDTO.ParticipantDTO> dtos = participants.stream()
            .map(CalendarEventDTO.ParticipantDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /calendar/invitations - Get pending event invitations for current user
     */
    @GetMapping("/invitations")
    public ResponseEntity<?> getInvitations(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        List<EventParticipant> invitations = calendarService.getPendingInvitations(currentUser);

        List<Map<String, Object>> result = invitations.stream()
            .map(p -> {
                Map<String, Object> item = new HashMap<>();
                item.put("invitationId", p.getId());
                item.put("event", enrichEventDTO(p.getEvent(), currentUser));
                item.put("invitedBy", p.getInvitedBy() != null
                    ? new UserSummaryDTO(p.getInvitedBy()) : null);
                item.put("invitedAt", p.getInvitedAt());
                return item;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    /**
     * POST /calendar/invitations/{id}/respond - Respond to an invitation
     */
    @PostMapping("/invitations/{id}/respond")
    public ResponseEntity<?> respondToInvitation(
            @PathVariable Long id,
            @RequestParam boolean accept,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            EventParticipant participant = calendarService.respondToInvitation(id, currentUser, accept);
            return ResponseEntity.ok(Map.of(
                "message", accept ? "Invitation accepted" : "Invitation declined",
                "status", participant.getStatus().name()
            ));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ========== Legacy Bulk Import Endpoints ==========

    /**
     * POST /calendar/events/bulk - Bulk import events (for ICS import)
     */
    @PostMapping("/events/bulk")
    public ResponseEntity<Map<String, Object>> bulkImport(
            @RequestBody List<CalendarEvent> events,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        int imported = 0;
        int skipped = 0;
        List<CalendarEvent> savedEvents = new ArrayList<>();

        for (CalendarEvent event : events) {
            if (event.getExternalId() != null && eventRepository.existsByExternalId(event.getExternalId())) {
                skipped++;
                continue;
            }

            if (event.getSourceType() == null) {
                event.setSourceType("ICS_IMPORT");
            }
            if (event.getType() == null) {
                event.setType(CalendarEvent.EventType.TASK);
            }
            if (currentUser != null) {
                event.setOwner(currentUser);
                event.setVisibility(EventVisibility.PRIVATE);
            }

            savedEvents.add(eventRepository.save(event));
            imported++;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("imported", imported);
        response.put("skipped", skipped);
        response.put("total", events.size());
        response.put("events", savedEvents.stream()
            .map(e -> enrichEventDTO(e, currentUser))
            .collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /calendar/events/imported - Clear all imported events
     */
    @DeleteMapping("/events/imported")
    public ResponseEntity<Map<String, Object>> clearImportedEvents(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);

        List<CalendarEvent> imported = eventRepository.findBySourceType("ICS_IMPORT");

        // If authenticated, only delete user's own imports
        if (currentUser != null) {
            imported = imported.stream()
                .filter(e -> e.getOwner() == null || e.isOwnedBy(currentUser))
                .collect(Collectors.toList());
        }

        int count = imported.size();
        eventRepository.deleteAll(imported);

        Map<String, Object> response = new HashMap<>();
        response.put("deleted", count);
        return ResponseEntity.ok(response);
    }

    // ========== Helper Methods ==========

    private CalendarEventDTO enrichEventDTO(CalendarEvent event, User currentUser) {
        CalendarEventDTO dto = new CalendarEventDTO(event);
        setUserContext(dto, event, currentUser);
        enrichWithGameName(dto);
        return dto;
    }

    private void setUserContext(CalendarEventDTO dto, CalendarEvent event, User currentUser) {
        if (currentUser == null) {
            dto.setUserContext(null, false, event.getVisibility() == EventVisibility.PUBLIC);
            return;
        }

        boolean hasJoined = calendarService.hasUserJoined(event, currentUser);
        boolean isFriend = event.getOwner() != null &&
            friendshipService.areFriends(currentUser, event.getOwner());
        boolean canJoin = !event.isOwnedBy(currentUser) &&
            !hasJoined &&
            event.canBeViewedBy(currentUser, isFriend) &&
            event.hasSpaceForMore() &&
            event.getType() == CalendarEvent.EventType.GAME;

        dto.setUserContext(currentUser.getId(), hasJoined, canJoin);
    }

    private void enrichWithGameName(CalendarEventDTO dto) {
        if (dto.getGameId() != null) {
            gameRepository.findById(dto.getGameId())
                .ifPresent(game -> dto.setGameName(game.getName()));
        }
    }

    /**
     * Parse ISO date string, handling both with and without Z suffix
     */
    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null) return null;
        try {
            // Try parsing as Instant first (handles Z suffix)
            if (dateStr.endsWith("Z") || dateStr.contains("+")) {
                return Instant.parse(dateStr).atZone(ZoneId.systemDefault()).toLocalDateTime();
            }
            // Fall back to LocalDateTime parsing
            return LocalDateTime.parse(dateStr);
        } catch (Exception e) {
            logger.warn("Failed to parse date: {}", dateStr);
            return null;
        }
    }
}
