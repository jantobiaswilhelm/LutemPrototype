package com.lutem.mvp.repository;

import com.lutem.mvp.model.CalendarEvent;
import com.lutem.mvp.model.EventParticipant;
import com.lutem.mvp.model.EventParticipant.ParticipantStatus;
import com.lutem.mvp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {

    /**
     * Find participant record for a user in an event
     */
    Optional<EventParticipant> findByEventAndUser(CalendarEvent event, User user);

    /**
     * Find all participants for an event
     */
    List<EventParticipant> findByEvent(CalendarEvent event);

    /**
     * Find all joined participants for an event
     */
    List<EventParticipant> findByEventAndStatus(CalendarEvent event, ParticipantStatus status);

    /**
     * Find all events where user is a participant (joined)
     */
    @Query("SELECT p.event FROM EventParticipant p WHERE p.user = :user AND p.status = 'JOINED'")
    List<CalendarEvent> findEventsUserJoined(@Param("user") User user);

    /**
     * Find pending invitations for a user
     */
    @Query("SELECT p FROM EventParticipant p WHERE p.user = :user AND p.status = 'INVITED' ORDER BY p.invitedAt DESC")
    List<EventParticipant> findPendingInvitationsForUser(@Param("user") User user);

    /**
     * Count pending invitations for a user (for notification badge)
     */
    @Query("SELECT COUNT(p) FROM EventParticipant p WHERE p.user = :user AND p.status = 'INVITED'")
    long countPendingInvitations(@Param("user") User user);

    /**
     * Check if user is a participant (any status) in an event
     */
    boolean existsByEventAndUser(CalendarEvent event, User user);

    /**
     * Count joined participants for an event
     */
    @Query("SELECT COUNT(p) FROM EventParticipant p WHERE p.event = :event AND p.status = 'JOINED'")
    int countJoinedParticipants(@Param("event") CalendarEvent event);
}
