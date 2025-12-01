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

/**
 * Jackson configuration for proper date/time handling.
 * Ensures ISO 8601 date strings from JavaScript (with 'Z' suffix)
 * are properly parsed to LocalDateTime.
 */
@Configuration
public class JacksonConfig {

    private static final DateTimeFormatter DATETIME_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX][X]");

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Custom deserializer that handles ISO 8601 with timezone
        javaTimeModule.addDeserializer(LocalDateTime.class, 
            new LocalDateTimeDeserializer(DateTimeFormatter.ISO_DATE_TIME));
        javaTimeModule.addSerializer(LocalDateTime.class,
            new LocalDateTimeSerializer(DateTimeFormatter.ISO_DATE_TIME));
        
        mapper.registerModule(javaTimeModule);
        
        // Don't fail on unknown properties
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        
        // Write dates as ISO strings, not timestamps
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        
        return mapper;
    }
}
