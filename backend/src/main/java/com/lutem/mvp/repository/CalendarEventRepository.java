package com.lutem.mvp.repository;

import com.lutem.mvp.model.CalendarEvent;
import com.lutem.mvp.model.CalendarEvent.EventVisibility;
import com.lutem.mvp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    // Find events within a date range
    List<CalendarEvent> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    // Find by external ID for deduplication
    Optional<CalendarEvent> findByExternalId(String externalId);

    // Check if event exists by external ID
    boolean existsByExternalId(String externalId);

    // Find events by source type
    List<CalendarEvent> findBySourceType(String sourceType);

    // Find events owned by a user
    List<CalendarEvent> findByOwner(User owner);

    // Find events owned by a user within a date range
    @Query("SELECT e FROM CalendarEvent e WHERE e.owner = :owner " +
           "AND e.startTime >= :start AND e.startTime <= :end " +
           "ORDER BY e.startTime")
    List<CalendarEvent> findByOwnerAndDateRange(
        @Param("owner") User owner,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    // Find public events within a date range
    @Query("SELECT e FROM CalendarEvent e WHERE e.visibility = 'PUBLIC' " +
           "AND e.startTime >= :start AND e.startTime <= :end " +
           "ORDER BY e.startTime")
    List<CalendarEvent> findPublicEventsInRange(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    // Find events visible to friends (FRIENDS_ONLY or PUBLIC) by specific owner IDs
    @Query("SELECT e FROM CalendarEvent e WHERE e.owner.id IN :friendIds " +
           "AND (e.visibility = 'PUBLIC' OR e.visibility = 'FRIENDS_ONLY') " +
           "AND e.startTime >= :start AND e.startTime <= :end " +
           "ORDER BY e.startTime")
    List<CalendarEvent> findFriendsEventsInRange(
        @Param("friendIds") List<Long> friendIds,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    // Find GAME type events that are public or friends-only (for discovery)
    @Query("SELECT e FROM CalendarEvent e WHERE e.type = 'GAME' " +
           "AND e.visibility != 'PRIVATE' " +
           "AND e.startTime >= :start " +
           "ORDER BY e.startTime")
    List<CalendarEvent> findUpcomingPublicGameEvents(
        @Param("start") LocalDateTime start
    );
}
