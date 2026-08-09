package com.civicpulse.budget.security;

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
                                "/v3/api-docs/**",
                                "/actuator/**"
                        ).permitAll()

                        // Reporting / analytics queries
                        .requestMatchers(HttpMethod.GET, "/api/budget/stats").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/analytics/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/budgets/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/allocations/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/distributions/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")

                        // Modifications (Admin & Commissioner only)
                        .requestMatchers(HttpMethod.POST, "/api/budgets/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.PUT, "/api/budgets/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.POST, "/api/allocations/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.POST, "/api/distributions/**").hasAnyRole("ADMIN", "COMMISSIONER")

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
