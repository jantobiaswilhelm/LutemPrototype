package com.lutem.mvp.service;

import com.lutem.mvp.model.CalendarEvent;
import com.lutem.mvp.model.CalendarEvent.EventVisibility;
import com.lutem.mvp.model.EventParticipant;
import com.lutem.mvp.model.EventParticipant.ParticipantStatus;
import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.CalendarEventRepository;
import com.lutem.mvp.repository.EventParticipantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    private static final Logger logger = LoggerFactory.getLogger(CalendarService.class);

    private final CalendarEventRepository eventRepository;
    private final EventParticipantRepository participantRepository;
    private final FriendshipService friendshipService;

    public CalendarService(
            CalendarEventRepository eventRepository,
            EventParticipantRepository participantRepository,
            FriendshipService friendshipService) {
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
        this.friendshipService = friendshipService;
    }

    /**
     * Create a new calendar event
     */
    @Transactional
    public CalendarEvent createEvent(CalendarEvent event, User owner) {
        event.setOwner(owner);
        if (event.getSourceType() == null) {
            event.setSourceType("MANUAL");
        }
        if (event.getVisibility() == null) {
            event.setVisibility(EventVisibility.PRIVATE);
        }

        CalendarEvent saved = eventRepository.save(event);
        logger.info("Event created: {} by user {}", saved.getTitle(), owner.getDisplayName());
        return saved;
    }

    /**
     * Get events visible to a user within a date range.
     * Includes: own events, friends' visible events, public events
     */
    public List<CalendarEvent> getVisibleEvents(User user, LocalDateTime start, LocalDateTime end) {
        Set<CalendarEvent> events = new LinkedHashSet<>();

        // 1. Own events (all visibility levels)
        events.addAll(eventRepository.findByOwnerAndDateRange(user, start, end));

        // 2. Friends' events (FRIENDS_ONLY and PUBLIC)
        List<Long> friendIds = friendshipService.getFriendIds(user.getId());
        if (!friendIds.isEmpty()) {
            events.addAll(eventRepository.findFriendsEventsInRange(friendIds, start, end));
        }

        // 3. Public events from non-friends
        events.addAll(eventRepository.findPublicEventsInRange(start, end));

        // 4. Events user has joined (regardless of visibility changes)
        List<CalendarEvent> joinedEvents = participantRepository.findEventsUserJoined(user);
        for (CalendarEvent e : joinedEvents) {
            if (e.getStartTime().isAfter(start) && e.getStartTime().isBefore(end)) {
                events.add(e);
            }
        }

        // Sort by start time
        return events.stream()
            .sorted(Comparator.comparing(CalendarEvent::getStartTime))
            .collect(Collectors.toList());
    }

    /**
     * Get only the user's own events
     */
    public List<CalendarEvent> getOwnEvents(User user, LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByOwnerAndDateRange(user, start, end);
    }

    /**
     * Get friends' events visible to the user
     */
    public List<CalendarEvent> getFriendsEvents(User user, LocalDateTime start, LocalDateTime end) {
        List<Long> friendIds = friendshipService.getFriendIds(user.getId());
        if (friendIds.isEmpty()) {
            return Collections.emptyList();
        }
        return eventRepository.findFriendsEventsInRange(friendIds, start, end);
    }

    /**
     * Join an event
     */
    @Transactional
    public EventParticipant joinEvent(CalendarEvent event, User user) {
        // Check if user can view/join this event
        boolean isFriend = event.getOwner() != null &&
            friendshipService.areFriends(user, event.getOwner());

        if (!event.canBeViewedBy(user, isFriend)) {
            throw new IllegalStateException("Cannot join this event - not visible to you");
        }

        // Check if already a participant
        Optional<EventParticipant> existing = participantRepository.findByEventAndUser(event, user);
        if (existing.isPresent()) {
            EventParticipant p = existing.get();
            if (p.isJoined()) {
                throw new IllegalStateException("Already joined this event");
            }
            // Re-join if previously left/declined
            p.join();
            return participantRepository.save(p);
        }

        // Check capacity
        if (!event.hasSpaceForMore()) {
            throw new IllegalStateException("Event is full");
        }

        // Create new participant
        EventParticipant participant = new EventParticipant(event, user);
        logger.info("User {} joined event {}", user.getDisplayName(), event.getTitle());
        return participantRepository.save(participant);
    }

    /**
     * Leave an event
     */
    @Transactional
    public void leaveEvent(CalendarEvent event, User user) {
        EventParticipant participant = participantRepository.findByEventAndUser(event, user)
            .orElseThrow(() -> new IllegalStateException("Not a participant of this event"));

        if (!participant.isJoined()) {
            throw new IllegalStateException("Not currently joined to this event");
        }

        participant.leave();
        participantRepository.save(participant);
        logger.info("User {} left event {}", user.getDisplayName(), event.getTitle());
    }

    /**
     * Invite a friend to an event
     */
    @Transactional
    public EventParticipant inviteToEvent(CalendarEvent event, User inviter, User invitee) {
        // Only owner can invite
        if (!event.isOwnedBy(inviter)) {
            throw new IllegalStateException("Only the event owner can invite others");
        }

        // Must be friends
        if (!friendshipService.areFriends(inviter, invitee)) {
            throw new IllegalStateException("Can only invite friends");
        }

        // Check if already a participant
        Optional<EventParticipant> existing = participantRepository.findByEventAndUser(event, invitee);
        if (existing.isPresent()) {
            throw new IllegalStateException("User is already a participant or has been invited");
        }

        // Check capacity
        if (!event.hasSpaceForMore()) {
            throw new IllegalStateException("Event is full");
        }

        EventParticipant participant = new EventParticipant(event, invitee, inviter);
        logger.info("User {} invited {} to event {}",
            inviter.getDisplayName(), invitee.getDisplayName(), event.getTitle());
        return participantRepository.save(participant);
    }

    /**
     * Respond to an invitation
     */
    @Transactional
    public EventParticipant respondToInvitation(Long participantId, User user, boolean accept) {
        EventParticipant participant = participantRepository.findById(participantId)
            .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        if (!participant.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("This invitation is not for you");
        }

        if (!participant.isPending()) {
            throw new IllegalStateException("Invitation already responded to");
        }

        if (accept) {
            // Check capacity before accepting
            if (!participant.getEvent().hasSpaceForMore()) {
                throw new IllegalStateException("Event is now full");
            }
            participant.join();
            logger.info("User {} accepted invitation to event {}",
                user.getDisplayName(), participant.getEvent().getTitle());
        } else {
            participant.decline();
            logger.info("User {} declined invitation to event {}",
                user.getDisplayName(), participant.getEvent().getTitle());
        }

        return participantRepository.save(participant);
    }

    /**
     * Get pending invitations for a user
     */
    public List<EventParticipant> getPendingInvitations(User user) {
        return participantRepository.findPendingInvitationsForUser(user);
    }

    /**
     * Get invitation count for badge
     */
    public long getPendingInvitationCount(User user) {
        return participantRepository.countPendingInvitations(user);
    }

    /**
     * Get participants of an event
     */
    public List<EventParticipant> getParticipants(CalendarEvent event) {
        return participantRepository.findByEvent(event);
    }

    /**
     * Get joined participants of an event
     */
    public List<EventParticipant> getJoinedParticipants(CalendarEvent event) {
        return participantRepository.findByEventAndStatus(event, ParticipantStatus.JOINED);
    }

    /**
     * Check if user has joined an event
     */
    public boolean hasUserJoined(CalendarEvent event, User user) {
        return participantRepository.findByEventAndUser(event, user)
            .map(EventParticipant::isJoined)
            .orElse(false);
    }

    /**
     * Update an event (owner only)
     */
    @Transactional
    public CalendarEvent updateEvent(CalendarEvent event, User user) {
        if (!event.isOwnedBy(user)) {
            throw new IllegalStateException("Only the owner can update this event");
        }
        return eventRepository.save(event);
    }

    /**
     * Delete an event (owner only)
     */
    @Transactional
    public void deleteEvent(CalendarEvent event, User user) {
        if (!event.isOwnedBy(user)) {
            throw new IllegalStateException("Only the owner can delete this event");
        }
        eventRepository.delete(event);
        logger.info("Event {} deleted by {}", event.getTitle(), user.getDisplayName());
    }
}
