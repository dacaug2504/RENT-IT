package com.rentit.signin.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET =
            "rentit_super_secret_key_rentit_super_secret_key";

    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ CREATE TOKEN
    public static String generateToken(int userId, String role) {

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


}
