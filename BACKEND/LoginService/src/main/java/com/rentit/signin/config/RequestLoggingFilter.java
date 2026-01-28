//package com.rentit.signin.config;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.stream.Collectors;
//
//@Component
//public class RequestLoggingFilter extends OncePerRequestFilter {
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain
//    ) throws ServletException, IOException {
//
//        if (request.getRequestURI().contains("/api/register")) {
//            String body = request.getReader()
//                    .lines()
//                    .collect(Collectors.joining("\n"));
//
//            System.out.println("RAW REGISTER JSON = " + body);
//        }
//
//        filterChain.doFilter(request, response);
//    }
//}
