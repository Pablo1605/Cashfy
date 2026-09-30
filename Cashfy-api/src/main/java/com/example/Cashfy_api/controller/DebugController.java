package com.example.Cashfy_api.controller;

import com.example.Cashfy_api.auth.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/debug")
public class DebugController {
    private static final Logger logger = LoggerFactory.getLogger(DebugController.class);
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser() {
        try {
            String userId = currentUserProvider.getCurrentUsername();
            logger.info("Debug: Current user is {}", userId);
            return ResponseEntity.ok("Current user: " + userId);
        } catch (Exception e) {
            logger.error("Debug: Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(401).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/auth")
    public ResponseEntity<String> getAuthenticationInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String info = "Authentication: " + (auth != null ? auth.toString() : "null");
        logger.info("Debug: {}", info);
        return ResponseEntity.ok(info);
    }
}
