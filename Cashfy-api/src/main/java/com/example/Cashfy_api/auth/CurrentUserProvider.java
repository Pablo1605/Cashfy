package com.example.Cashfy_api.auth;

import com.example.Cashfy_api.exception.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {
    private static final Logger logger = LoggerFactory.getLogger(CurrentUserProvider.class);

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        logger.debug("Attempting to get current username. Authentication: {}", authentication);
        
        if (authentication == null) {
            logger.warn("Authentication is null");
            throw new UnauthorizedException("unauthenticated user");
        }
        
        if (!authentication.isAuthenticated()) {
            logger.warn("Authentication is not authenticated");
            throw new UnauthorizedException("unauthenticated user");
        }
        
        if ("anonymousUser".equals(authentication.getPrincipal())) {
            logger.warn("Authentication principal is anonymousUser");
            throw new UnauthorizedException("unauthenticated user");
        }
        
        String username = authentication.getName();
        logger.debug("Current user: {}", username);
        return username;
    }
}

