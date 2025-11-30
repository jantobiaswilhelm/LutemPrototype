package com.lutem.mvp.controller;

import com.lutem.mvp.model.CalendarEvent;
import com.lutem.mvp.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/calendar")
public class CalendarController {
    
    @Autowired
    private CalendarEventRepository eventRepository;
    
    @GetMapping("/events")
    public List<CalendarEvent> getAllEvents(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
        
        if (start != null && end != null) {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime endDate = LocalDateTime.parse(end);
            return eventRepository.findByStartTimeBetween(startDate, endDate);
        }
        
        return eventRepository.findAll();
    }
    
    @PostMapping("/events")
    public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
        if (event.getSourceType() == null) {
            event.setSourceType("MANUAL");
        }
        return eventRepository.save(event);
    }
    
    @PutMapping("/events/{id}")
    public ResponseEntity<CalendarEvent> updateEvent(@PathVariable Long id, @RequestBody CalendarEvent event) {
        if (!eventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        event.setId(id);
        return ResponseEntity.ok(eventRepository.save(event));
    }
    
    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        eventRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/events/{id}")
    public ResponseEntity<CalendarEvent> getEvent(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Bulk import events (for ICS import)
     * Skips duplicates based on externalId
     */
    @PostMapping("/events/bulk")
    public ResponseEntity<Map<String, Object>> bulkImport(@RequestBody List<CalendarEvent> events) {
        int imported = 0;
        int skipped = 0;
        List<CalendarEvent> savedEvents = new ArrayList<>();
        
        for (CalendarEvent event : events) {
            // Check for duplicates by externalId
            if (event.getExternalId() != null && eventRepository.existsByExternalId(event.getExternalId())) {
                skipped++;
                continue;
            }
            
            // Set source type if not set
            if (event.getSourceType() == null) {
                event.setSourceType("ICS_IMPORT");
            }
            
            // Default to TASK type for imported events
            if (event.getType() == null) {
                event.setType(CalendarEvent.EventType.TASK);
            }
            
            savedEvents.add(eventRepository.save(event));
            imported++;
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("imported", imported);
        response.put("skipped", skipped);
        response.put("total", events.size());
        response.put("events", savedEvents);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Clear all imported events (useful for re-importing)
     */
    @DeleteMapping("/events/imported")
    public ResponseEntity<Map<String, Object>> clearImportedEvents() {
        List<CalendarEvent> imported = eventRepository.findBySourceType("ICS_IMPORT");
        int count = imported.size();
        eventRepository.deleteAll(imported);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", count);
        return ResponseEntity.ok(response);
    }
}
