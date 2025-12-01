package com.lutem.mvp.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

/**
 * Jackson configuration for proper date/time handling.
 * 
 * TIMEZONE FIX: All times are now stored and transmitted as LOCAL times.
 * - Frontend sends local time (e.g., "2025-12-01T15:00:00") - NO 'Z' suffix
 * - Backend stores it as-is in LocalDateTime
 * - Backend returns it as-is (e.g., "2025-12-01T15:00:00") - NO 'Z' suffix
 * - Frontend interprets it as local time
 * 
 * This avoids all timezone conversion issues by treating times as "naive"
 * local times throughout the system.
 */
@Configuration
public class JacksonConfig {

    /**
     * Flexible deserializer that handles:
     * - Full ISO with timezone: "2025-12-01T14:00:00.000Z" (timezone stripped)
     * - ISO with millis: "2025-12-01T14:00:00.000"
     * - ISO without millis: "2025-12-01T14:00:00"
     */
    private static final DateTimeFormatter FLEXIBLE_DESERIALIZER = new DateTimeFormatterBuilder()
        .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
        .optionalStart()
        .appendFraction(ChronoField.MILLI_OF_SECOND, 0, 3, true)
        .optionalEnd()
        .optionalStart()
        .appendPattern("XXX")  // Timezone offset like +01:00 or Z
        .optionalEnd()
        .optionalStart()
        .appendPattern("X")    // Timezone offset like +01 or Z
        .optionalEnd()
        .toFormatter();

    /**
     * Serializer - output WITHOUT timezone suffix.
     * This ensures frontend interprets times as local.
     */
    private static final DateTimeFormatter LOCAL_SERIALIZER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Custom deserializer that handles various ISO 8601 formats
        javaTimeModule.addDeserializer(LocalDateTime.class, 
            new LocalDateTimeDeserializer(FLEXIBLE_DESERIALIZER));
        
        // Custom serializer WITHOUT timezone suffix
        javaTimeModule.addSerializer(LocalDateTime.class,
            new LocalDateTimeSerializer(LOCAL_SERIALIZER));
        
        mapper.registerModule(javaTimeModule);
        
        // Don't fail on unknown properties
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // Write dates as ISO strings, not timestamps
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        
        return mapper;
    }
}
