package com.civicpulse.servicemanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Swagger & Actuator
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/actuator/**"
                        ).permitAll()

                        // Stats & Dashboard for reporting & discovery
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/**").permitAll()

                        // Citizen APIs
                        .requestMatchers(HttpMethod.GET, "/api/certificates/**").hasAnyRole("CITIZEN", "OFFICER", "COMMISSIONER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/certificates/**").hasAnyRole("CITIZEN", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/permits/**", "/api/permit/**").hasAnyRole("CITIZEN", "OFFICER", "COMMISSIONER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/permits/**", "/api/permit/**").hasAnyRole("CITIZEN", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/applications/**").hasAnyRole("CITIZEN", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/applications/**").hasAnyRole("CITIZEN", "OFFICER", "COMMISSIONER", "ADMIN")

                        // Document APIs
                        .requestMatchers("/api/documents/**").hasAnyRole("CITIZEN", "OFFICER", "ADMIN")

                        // Verification Officer
                        .requestMatchers("/api/officer/pending").hasAnyRole("OFFICER", "COMMISSIONER", "ADMIN")
                        .requestMatchers("/api/officer/documents/**").hasAnyRole("OFFICER", "COMMISSIONER", "ADMIN")
                        .requestMatchers("/api/officer/verify/**").hasAnyRole("OFFICER", "ADMIN")
                        .requestMatchers("/api/officer/document/**").hasAnyRole("OFFICER", "ADMIN")

                        // Commissioner
                        .requestMatchers("/api/officer/approve/**").hasAnyRole("COMMISSIONER", "ADMIN")
                        .requestMatchers("/api/officer/reject/**").hasAnyRole("COMMISSIONER", "ADMIN")

                        // Certificate & Permit Generation
                        .requestMatchers("/api/certificate/generate/**", "/api/permit/generate/**").hasAnyRole("COMMISSIONER", "ADMIN")
                        .requestMatchers("/api/certificate/download/**", "/api/permit/download/**").hasAnyRole("CITIZEN", "COMMISSIONER", "ADMIN")

                        // Static Files
                        .requestMatchers("/certificates/**", "/permits/**", "/uploads/**").permitAll()

                        .anyRequest().authenticated()
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