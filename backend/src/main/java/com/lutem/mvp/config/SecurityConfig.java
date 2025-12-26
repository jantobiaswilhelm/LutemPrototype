package com.lutem.mvp.config;

import com.lutem.mvp.security.FirebaseAuthFilter;
import com.lutem.mvp.security.JwtAuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure authentication filters.
 * JwtAuthFilter handles our new JWT-based auth (primary).
 * FirebaseAuthFilter is disabled as we've migrated to JWT.
 */
@Configuration
public class SecurityConfig {
    
    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtFilterRegistration(JwtAuthFilter jwtAuthFilter) {
        FilterRegistrationBean<JwtAuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(jwtAuthFilter);
        registration.addUrlPatterns("/*");
        registration.setOrder(1);
        registration.setName("jwtAuthFilter");
        return registration;
    }
    
    /**
     * Disable auto-registration of FirebaseAuthFilter.
     * We're now using JWT for all auth.
     */
    @Bean
    public FilterRegistrationBean<FirebaseAuthFilter> disableFirebaseFilter(FirebaseAuthFilter filter) {
        FilterRegistrationBean<FirebaseAuthFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}
