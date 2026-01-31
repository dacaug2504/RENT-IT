package com.rentit.addtocart.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter {

    // ✅ PUBLIC ENDPOINTS (no JWT required)
    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/login",
        "/api/register",
        "/api/categories",
        "/api/items"
        // add any other public endpoints
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("JWT FILTER → " + request.getMethod() + " " + path + " @ " + System.currentTimeMillis());

        // ✅ Allow preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Skip JWT check for public paths
        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔐 Now protect everything else

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);

        if (!JwtUtil.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Integer userId = JwtUtil.extractUserId(token);
        String role = JwtUtil.extractRole(token);
        System.out.println(role);
        if (role != null && role.startsWith("ROLE_")) {
            role = role.substring(5); // remove "ROLE_"
        }

        System.out.println("JWT FILTER → normalized role = " + role);        
        
        
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId, null, List.of(new SimpleGrantedAuthority(role)));
        
        SecurityContextHolder.getContext().setAuthentication(authToken);
        
        request.setAttribute("userId", userId);
        request.setAttribute("role", role.toLowerCase()); // always lowercase
        
        
  
        System.out.println("filter called");
        filterChain.doFilter(request, response);
    }

	
}
