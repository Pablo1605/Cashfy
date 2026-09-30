package com.example.Cashfy_api.auth;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String username = null;
        String token = null;

        logger.debug("Processing request: {} {}", request.getMethod(), request.getRequestURI());
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7).trim();
            try {
                username = jwtUtil.extractUsername(token);
                logger.debug("Token extracted successfully for user: {}", username);
            } catch (Exception e) {
                logger.warn("Failed to extract JWT token: {}", e.getMessage());
            }
        } else {
            logger.debug("No Bearer token found in Authorization header");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.debug("Authentication successful for user: {}", username);
                } else {
                    logger.warn("JWT token validation failed for user: {}", username);
                }
            } catch (UsernameNotFoundException e) {
                logger.warn("User not found: {}", username);
            } catch (Exception e) {
                logger.warn("Unexpected error validating JWT token for {}: {}", username, e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
