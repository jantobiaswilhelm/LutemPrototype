package com.lutem.mvp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class WebConfig {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${cors.extra-origins:}")
    private String extraOrigins;

    /**
     * Filter-level CORS registered at highest precedence so headers are added
     * even when JwtAuthFilter or CsrfFilter short-circuit the request.
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        List<String> origins = new ArrayList<>();
        origins.add(frontendUrl);

        if (extraOrigins != null && !extraOrigins.isBlank()) {
            for (String origin : extraOrigins.split(",")) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    origins.add(trimmed);
                }
            }
        }

        if (frontendUrl.startsWith("http://localhost")) {
            origins.add("http://localhost:5173");
            origins.add("http://localhost:5174");
            origins.add("http://localhost:3000");
            origins.add("http://127.0.0.1:5173");
        }

        CorsConfiguration config = new CorsConfiguration();
        origins.stream().distinct().forEach(config::addAllowedOrigin);
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.addExposedHeader("Set-Cookie");
        config.addExposedHeader("X-XSRF-TOKEN");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> registration = new FilterRegistrationBean<>(new CorsFilter(source));
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}
