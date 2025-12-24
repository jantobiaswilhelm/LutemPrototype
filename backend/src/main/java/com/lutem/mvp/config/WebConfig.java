package com.lutem.mvp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                // Local development
                "http://localhost:5500",
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177",
                "http://localhost:5178",
                "http://localhost:5179",
                "http://localhost:5180",
                "http://127.0.0.1:5500",
                "http://127.0.0.1:3000",
                // Production domain
                "https://lutem.3lands.ch",
                // Netlify production
                "https://lutembeta.netlify.app",
                // Railway backend (for direct API access)
                "https://lutemprototype-production.up.railway.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Authorization")
            .allowCredentials(true);
    }
}
