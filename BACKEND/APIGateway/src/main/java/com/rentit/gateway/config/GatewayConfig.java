package com.rentit.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                
                // ========== AUTH ROUTES (No JWT Required) ==========
                .route("auth-login", r -> r
                        .path("/api/login")
                        .uri("lb://REGISTRATIONSERVICE"))
                
                .route("auth-register", r -> r
                        .path("/api/register")
                        .uri("lb://REGISTRATIONSERVICE"))
                
                // ========== SEARCH SERVICE ROUTES (Public - No JWT Required) ==========
                
                // Get all categories for home page
                .route("search-categories", r -> r
                        .path("/api/catalog/categories")
                        .uri("lb://SEARCHSERVICE"))
                
                // Get items by category
                .route("search-category-items", r -> r
                        .path("/api/catalog/categories/*/items")
                        .uri("lb://SEARCHSERVICE"))
                
                // Get item details
                .route("search-item-detail", r -> r
                        .path("/api/catalog/items/*")
                        .uri("lb://SEARCHSERVICE"))
                
                // Search items
                .route("search-items", r -> r
                        .path("/api/catalog/search")
                        .uri("lb://SEARCHSERVICE"))
                
                // Catch-all for any other catalog endpoints
                .route("search-catalog-all", r -> r
                        .path("/api/catalog/**")
                        .uri("lb://SEARCHSERVICE"))
                
                .build();
    }
}