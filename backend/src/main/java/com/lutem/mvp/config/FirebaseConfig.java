package com.lutem.mvp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Firebase Admin SDK configuration.
 * Initializes Firebase for server-side token validation.
 * 
 * Supports two modes:
 * 1. Production (Railway): Reads from FIREBASE_CREDENTIALS environment variable
 * 2. Development (local): Reads from firebase-service-account.json file
 */
@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.credentials.path:firebase-service-account.json}")
    private String credentialsPath;

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccount = getCredentialsStream();

                if (serviceAccount == null) {
                    logger.warn("Firebase credentials not found - authentication will be disabled");
                    return;
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase Admin SDK initialized");
            }
        } catch (IOException e) {
            logger.error("Failed to initialize Firebase: {}", e.getMessage());
        }
    }

    /**
     * Get credentials from environment variable (production) or file (development)
     */
    private InputStream getCredentialsStream() {
        // First, try environment variable (for Railway/production)
        String envCredentials = System.getenv("FIREBASE_CREDENTIALS");
        if (envCredentials != null && !envCredentials.isEmpty()) {
            logger.info("Loading Firebase credentials from environment variable");
            return new ByteArrayInputStream(envCredentials.getBytes(StandardCharsets.UTF_8));
        }

        // Fall back to file (for local development)
        try {
            Resource resource;

            if (credentialsPath.startsWith("/") || credentialsPath.contains(":")) {
                resource = new FileSystemResource(credentialsPath);
            } else {
                resource = new ClassPathResource(credentialsPath);
                if (!resource.exists()) {
                    resource = new FileSystemResource(credentialsPath);
                }
            }

            if (resource.exists()) {
                logger.info("Loading Firebase credentials from file: {}", credentialsPath);
                return resource.getInputStream();
            }
        } catch (IOException e) {
            logger.warn("Could not read credentials file: {}", e.getMessage());
        }

        return null;
    }

    @Bean
    public FirebaseAuth firebaseAuth() {
        if (FirebaseApp.getApps().isEmpty()) {
            return null;
        }
        return FirebaseAuth.getInstance();
    }

    @Bean
    public Firestore firestore() {
        if (FirebaseApp.getApps().isEmpty()) {
            logger.warn("Firestore not available - Firebase not initialized");
            return null;
        }
        logger.info("Firestore client initialized");
        return FirestoreClient.getFirestore();
    }
}
