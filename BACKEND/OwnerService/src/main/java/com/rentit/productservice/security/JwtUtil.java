package com.rentit.productservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class JwtUtil {

    //  MUST MATCH LOGIN-SERVICE EXACTLY
    private static final String SECRET =
            "rentit_super_secret_key_rentit_super_secret_key";

    private static Key getSigningKey() {    
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ VALIDATE TOKEN (same logic as login-service)
    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ✅ EXTRACT USER ID (from subject)
    public static Integer extractUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Integer.parseInt(claims.getSubject());
    }

    // ✅ EXTRACT ROLE
    public static String extractRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }
}
