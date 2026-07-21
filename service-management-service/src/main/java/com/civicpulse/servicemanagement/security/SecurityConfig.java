package com.civicpulse.servicemanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Citizen APIs
                        .requestMatchers("/api/certificates/**")
                        .hasAnyRole("CITIZEN", "ADMIN")

                        // Document APIs
                        .requestMatchers("/api/documents/**")
                        .hasAnyRole("CITIZEN", "OFFICER", "ADMIN")

                        // Verification Officer
                        .requestMatchers("/api/officer/pending")
                        .hasAnyRole("OFFICER", "ADMIN")

                        .requestMatchers("/api/officer/verify/**")
                        .hasAnyRole("OFFICER", "ADMIN")

                        .requestMatchers("/api/officer/document/**")
                        .hasAnyRole("OFFICER", "ADMIN")

                        // Department Officer (Commissioner)
                        .requestMatchers("/api/officer/approve/**")
                        .hasAnyRole("COMMISSIONER", "ADMIN")

                        .requestMatchers("/api/officer/reject/**")
                        .hasAnyRole("COMMISSIONER", "ADMIN")

                        // Certificate Generation
                        .requestMatchers("/api/certificate/generate/**")
                        .hasAnyRole("COMMISSIONER", "ADMIN")

                        // Certificate Download
                        .requestMatchers("/api/certificate/download/**")
                        .hasAnyRole("CITIZEN", "COMMISSIONER", "ADMIN")

                        // Admin Dashboard
                        .requestMatchers("/api/dashboard/**")
                        .hasRole("ADMIN")

                        // Static PDF files
                        .requestMatchers("/certificates/**")
                        .permitAll()

                        .anyRequest()
                        .authenticated()
                )

                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        new KeycloakJwtRoleConverter()
                                )
                        )
                );

        return http.build();
    }
}