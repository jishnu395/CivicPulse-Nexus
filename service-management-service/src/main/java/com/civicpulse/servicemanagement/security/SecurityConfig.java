package com.civicpulse.servicemanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers("/api/certificates/**")
                        .hasAnyRole("CITIZEN","ADMIN")

                        .requestMatchers("/api/documents/**")
                        .hasAnyRole("CITIZEN","VERIFICATION_OFFICER","ADMIN")

                        .requestMatchers("/api/officer/**")
                        .hasAnyRole("VERIFICATION_OFFICER","DEPARTMENT_OFFICER","ADMIN")

                        .requestMatchers("/api/certificate/**")
                        .hasAnyRole("DEPARTMENT_OFFICER","ADMIN")

                        .requestMatchers("/api/dashboard/**")
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated())

                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        new KeycloakJwtRoleConverter()
                                )
                        ));

        return http.build();
    }
}