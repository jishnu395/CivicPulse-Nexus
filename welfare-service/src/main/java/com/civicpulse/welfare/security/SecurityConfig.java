package com.civicpulse.welfare.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Public/Citizen views
                        .requestMatchers(HttpMethod.GET, "/api/welfare/schemes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/welfare/beneficiaries/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/welfare/stats").permitAll()

                        // Citizen application submission
                        .requestMatchers(HttpMethod.POST, "/api/welfare/applications/apply").hasAnyRole("CITIZEN", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/welfare/applications/my/**").hasAnyRole("CITIZEN", "OFFICER", "ADMIN")

                        // Officer / Admin approvals and beneficiary registrations
                        .requestMatchers("/api/welfare/applications/**").hasAnyRole("OFFICER", "COMMISSIONER", "ADMIN")
                        .requestMatchers("/api/welfare/beneficiaries/register/**").hasAnyRole("OFFICER", "COMMISSIONER", "ADMIN")

                        // Admin scheme management
                        .requestMatchers(HttpMethod.POST, "/api/welfare/schemes/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.PUT, "/api/welfare/schemes/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.DELETE, "/api/welfare/schemes/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(new KeycloakJwtRoleConverter())
                        )
                );

        return http.build();
    }
}
