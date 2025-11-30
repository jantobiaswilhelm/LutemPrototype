package com.lutem.mvp.repository;

import com.lutem.mvp.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
