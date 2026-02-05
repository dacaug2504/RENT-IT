package com.rentit.addtocart.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;


@Configuration
public class SecurityConfig {

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login", "/api/register").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/getallproducts").permitAll() 
                .requestMatchers("/{id}/details").permitAll()  // ✅ Product details public
                .requestMatchers("/addtocart").hasAuthority("CUSTOMER") // 👈 CUSTOMER ONLY
                .anyRequest().authenticated()
            )
            /*.exceptionHandling(ex -> 
                ex.accessDeniedHandler(()-> {
                		
                }) 
            )*/
            .exceptionHandling(ex -> ex
                    .accessDeniedHandler(new CustomAccessDeniedHandler())   // 👈 custom handler
                )
            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
        
        

        return http.build();
    }
    
 // THIS is what Spring Security uses
    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {

    //     CorsConfiguration config = new CorsConfiguration();
    //     config.setAllowedOrigins(List.of("http://localhost:3000"));
    //     config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    //     config.setAllowedHeaders(List.of("Accept","Origin","Content-Type","X-Requested-With","Authorization"));
    //     config.setExposedHeaders(List.of("Authorization"));
    //     config.setAllowCredentials(true);

    //     UrlBasedCorsConfigurationSource source =
    //             new UrlBasedCorsConfigurationSource();
    //     source.registerCorsConfiguration("/**", config);
    //     return source;
    // }
}
