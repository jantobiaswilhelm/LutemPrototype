package com.lutem.mvp.controller;

import com.lutem.mvp.dto.FriendRequestDTO;
import com.lutem.mvp.dto.UserSummaryDTO;
import com.lutem.mvp.model.Friendship;
import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.UserRepository;
import com.lutem.mvp.service.FriendshipService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for friendship-related endpoints.
 * Requires authentication for all endpoints.
 */
@RestController
@RequestMapping("/friends")
public class FriendshipController {

    private static final Logger logger = LoggerFactory.getLogger(FriendshipController.class);

    private final FriendshipService friendshipService;
    private final UserRepository userRepository;

    public FriendshipController(FriendshipService friendshipService, UserRepository userRepository) {
        this.friendshipService = friendshipService;
        this.userRepository = userRepository;
    }

    /**
     * Get the current user from the request (set by JWT filter).
     */
    private User getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }

    /**
     * GET /friends - List all accepted friends
     */
    @GetMapping
    public ResponseEntity<?> getFriends(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        List<UserSummaryDTO> friends = friendshipService.getFriends(currentUser).stream()
            .map(UserSummaryDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(friends);
    }

    /**
     * GET /friends/requests - List pending friend requests (incoming)
     */
    @GetMapping("/requests")
    public ResponseEntity<?> getPendingRequests(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        List<FriendRequestDTO> requests = friendshipService.getPendingRequests(currentUser).stream()
            .map(FriendRequestDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(requests);
    }

    /**
     * GET /friends/requests/sent - List pending friend requests (outgoing)
     */
    @GetMapping("/requests/sent")
    public ResponseEntity<?> getSentRequests(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        List<FriendRequestDTO> requests = friendshipService.getSentRequests(currentUser).stream()
            .map(FriendRequestDTO::new)
            .collect(Collectors.toList());

        return ResponseEntity.ok(requests);
    }

    /**
     * GET /friends/requests/count - Get count of pending requests (for badge)
     */
    @GetMapping("/requests/count")
    public ResponseEntity<?> getPendingRequestCount(HttpServletRequest request) {
        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        long count = friendshipService.getPendingRequestCount(currentUser);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * POST /friends/request/{userId} - Send a friend request
     */
    @PostMapping("/request/{userId}")
    public ResponseEntity<?> sendFriendRequest(
            @PathVariable Long userId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            Friendship friendship = friendshipService.sendFriendRequest(currentUser, userId);
            logger.info("Friend request sent from {} to user {}", currentUser.getId(), userId);

            return ResponseEntity.ok(Map.of(
                "message", "Friend request sent",
                "request", new FriendRequestDTO(friendship)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /friends/accept/{requestId} - Accept a friend request
     */
    @PostMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptFriendRequest(
            @PathVariable Long requestId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            Friendship friendship = friendshipService.acceptFriendRequest(currentUser, requestId);
            User newFriend = friendship.getOtherUser(currentUser);
            logger.info("Friend request {} accepted by {}", requestId, currentUser.getId());

            return ResponseEntity.ok(Map.of(
                "message", "Friend request accepted",
                "friend", new UserSummaryDTO(newFriend)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /friends/decline/{requestId} - Decline a friend request
     */
    @PostMapping("/decline/{requestId}")
    public ResponseEntity<?> declineFriendRequest(
            @PathVariable Long requestId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            friendshipService.declineFriendRequest(currentUser, requestId);
            logger.info("Friend request {} declined by {}", requestId, currentUser.getId());
            return ResponseEntity.ok(Map.of("message", "Friend request declined"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /friends/{userId} - Remove a friend
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> removeFriend(
            @PathVariable Long userId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            friendshipService.removeFriend(currentUser, userId);
            logger.info("User {} removed friend {}", currentUser.getId(), userId);
            return ResponseEntity.ok(Map.of("message", "Friend removed"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /friends/request/{requestId} - Cancel a pending friend request you sent
     */
    @DeleteMapping("/request/{requestId}")
    public ResponseEntity<?> cancelFriendRequest(
            @PathVariable Long requestId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            friendshipService.cancelFriendRequest(currentUser, requestId);
            logger.info("Friend request {} cancelled by {}", requestId, currentUser.getId());
            return ResponseEntity.ok(Map.of("message", "Friend request cancelled"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /friends/search?q=name - Search users by display name
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam String q,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        if (q == null || q.trim().length() < 2) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Search query must be at least 2 characters"));
        }

        List<User> users = userRepository.searchByDisplayName(q.trim(), currentUser.getId());

        // Include friendship status for each user
        List<Map<String, Object>> results = users.stream()
            .limit(20) // Limit results
            .map(user -> {
                Map<String, Object> result = new HashMap<>();
                result.put("user", new UserSummaryDTO(user));

                // Get friendship status
                var friendship = friendshipService.getFriendshipWith(currentUser, user.getId());
                if (friendship.isPresent()) {
                    Friendship f = friendship.get();
                    result.put("friendshipStatus", f.getStatus().name());
                    result.put("friendshipId", f.getId());
                    // Indicate if current user is the requester or addressee
                    result.put("isRequester", f.getRequester().getId().equals(currentUser.getId()));
                } else {
                    result.put("friendshipStatus", null);
                }

                return result;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }

    /**
     * GET /friends/status/{userId} - Get friendship status with a specific user
     */
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getFriendshipStatus(
            @PathVariable Long userId,
            HttpServletRequest request) {

        User currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        var friendship = friendshipService.getFriendshipWith(currentUser, userId);

        Map<String, Object> response = new HashMap<>();
        if (friendship.isPresent()) {
            Friendship f = friendship.get();
            response.put("status", f.getStatus().name());
            response.put("friendshipId", f.getId());
            response.put("isRequester", f.getRequester().getId().equals(currentUser.getId()));
        } else {
            response.put("status", "NONE");
        }

        return ResponseEntity.ok(response);
    }
}
