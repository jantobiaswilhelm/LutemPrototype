package com.lutem.mvp.util;

import com.lutem.mvp.model.User;
import com.lutem.mvp.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Shared utility for extracting the current user from JWT-authenticated requests.
 */
public final class RequestUtils {

    private RequestUtils() {}

    /**
     * Get the current authenticated user from the request.
     * Returns null if not authenticated.
     */
    public static User getCurrentUser(HttpServletRequest request, UserRepository userRepository) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) return null;
        return userRepository.findById(userId).orElse(null);
    }
}
