package com.lutem.mvp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

/**
 * Firebase Admin SDK configuration.
 * Initializes Firebase for server-side token validation.
 */
@Configuration
public class FirebaseConfig {
    
    @Value("${firebase.credentials.path:firebase-service-account.json}")
    private String credentialsPath;
    
    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                Resource resource;
                
                // Try file system path first (for local dev)
                if (credentialsPath.startsWith("/") || credentialsPath.contains(":")) {
                    resource = new FileSystemResource(credentialsPath);
                } else {
                    // Try classpath, then relative file path
                    resource = new ClassPathResource(credentialsPath);
                    if (!resource.exists()) {
                        resource = new FileSystemResource(credentialsPath);
                    }
                }
                
                if (!resource.exists()) {
                    System.err.println("⚠️ Firebase credentials not found at: " + credentialsPath);
                    System.err.println("⚠️ Authentication will be disabled");
                    return;
                }
                
                InputStream serviceAccount = resource.getInputStream();
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                
                FirebaseApp.initializeApp(options);
                System.out.println("✅ Firebase Admin SDK initialized");
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to initialize Firebase: " + e.getMessage());
        }
    }
    
    @Bean
    public FirebaseAuth firebaseAuth() {
        if (FirebaseApp.getApps().isEmpty()) {
            return null;
        }
        return FirebaseAuth.getInstance();
    }
}
