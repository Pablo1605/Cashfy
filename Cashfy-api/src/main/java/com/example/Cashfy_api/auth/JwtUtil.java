package com.example.Cashfy_api.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private Key getSigninKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(jwtSecret);
        } catch (IllegalArgumentException ex) {
            logger.warn("JWT secret is not valid Base64, trying hex decode");
            keyBytes = decodeHex(jwtSecret);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private byte[] decodeHex(String hex) {
        int length = hex.length();
        byte[] bytes = new byte[length / 2];
        for (int i = 0; i < length; i += 2) {
            bytes[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return bytes;
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigninKey(), SignatureAlgorithm.HS256)
                .compact();
        
        logger.debug("Generated JWT token for user: {} (expires in {} ms)", username, jwtExpirationMs);
        return token;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        String username = extractAllClaims(token).getSubject();
        logger.debug("Extracted username from token: {}", username);
        return username;
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        boolean expired = expiration.before(new Date());
        if (expired) {
            logger.warn("Token is expired. Expiration time: {}", expiration);
        }
        return expired;
    }

    public boolean isTokenValid(String token, String username) {
        String tokenUsername = extractUsername(token);
        boolean isValid = tokenUsername.equals(username) && !isTokenExpired(token);
        logger.debug("Token validation: username match = {}, not expired = {}", 
                     tokenUsername.equals(username), !isTokenExpired(token));
        return isValid;
    }
}
