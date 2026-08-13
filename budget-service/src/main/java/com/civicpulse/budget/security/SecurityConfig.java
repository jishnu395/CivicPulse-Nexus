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
                        
                        // Budget & Allocation
                        .requestMatchers(HttpMethod.GET, "/api/budget/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.POST, "/api/budget/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.PUT, "/api/budget/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.DELETE, "/api/budget/**").hasAnyRole("ADMIN", "COMMISSIONER")

                        // Expenses
                        .requestMatchers(HttpMethod.GET, "/api/expenses/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.POST, "/api/expenses/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.DELETE, "/api/expenses/**").hasAnyRole("ADMIN", "COMMISSIONER")

                        // Fund Distribution
                        .requestMatchers(HttpMethod.GET, "/api/fund-distributions/citizen/**").hasAnyRole("CITIZEN", "ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.GET, "/api/fund-distributions/**").hasAnyRole("ADMIN", "COMMISSIONER", "OFFICER")
                        .requestMatchers(HttpMethod.POST, "/api/fund-distributions/**").hasAnyRole("ADMIN", "COMMISSIONER")
                        .requestMatchers(HttpMethod.PUT, "/api/fund-distributions/**").hasAnyRole("ADMIN", "COMMISSIONER")

                        // Audit Logs
                        .requestMatchers(HttpMethod.GET, "/api/audit/**").hasAnyRole("ADMIN", "COMMISSIONER")

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
