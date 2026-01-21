package com.lutem.mvp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * Centralized CORS configuration for the application.
 * Replaces individual @CrossOrigin annotations on controllers.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${lutem.dev-mode:false}")
    private boolean devMode;

    /**
     * Allowed origins for CORS requests.
     * In production, this is restricted to known frontend URLs.
     * In dev mode, localhost origins are also allowed.
     */
    private List<String> getAllowedOrigins() {
        if (devMode) {
            return Arrays.asList(
                frontendUrl,
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "http://127.0.0.1:5173"
            );
        }
        return Arrays.asList(
            "https://lutembeta.netlify.app",
            "https://lutem.netlify.app",
            "https://lutem.3lands.ch",
            frontendUrl
        );
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(getAllowedOrigins().toArray(new String[0]))
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
