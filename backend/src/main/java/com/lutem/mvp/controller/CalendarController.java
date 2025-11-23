package com.lutem.mvp.controller;

import com.lutem.mvp.model.CalendarEvent;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {
    
    private final Map<Long, CalendarEvent> events = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    @GetMapping("/events")
    public List<CalendarEvent> getAllEvents(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
        
        if (start != null && end != null) {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime endDate = LocalDateTime.parse(end);
            
            return events.values().stream()
                    .filter(e -> !e.getStartTime().isBefore(startDate) && 
                                !e.getEndTime().isAfter(endDate))
                    .collect(Collectors.toList());
        }
        
        return new ArrayList<>(events.values());
    }
    
    @PostMapping("/events")
    public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
        event.setId(idCounter.getAndIncrement());
        events.put(event.getId(), event);
        return event;
    }
    
    @PutMapping("/events/{id}")
    public CalendarEvent updateEvent(@PathVariable Long id, @RequestBody CalendarEvent event) {
        event.setId(id);
        events.put(id, event);
        return event;
    }
    
    @DeleteMapping("/events/{id}")
    public void deleteEvent(@PathVariable Long id) {
        events.remove(id);
    }
    
    @GetMapping("/events/{id}")
    public CalendarEvent getEvent(@PathVariable Long id) {
        return events.get(id);
    }
}
