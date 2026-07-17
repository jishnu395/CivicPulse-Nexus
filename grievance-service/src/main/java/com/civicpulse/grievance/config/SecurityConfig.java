package com.civicpulse.grievance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Dashboard
                        .requestMatchers(HttpMethod.GET, "/api/grievances/dashboard")
                        .hasAnyRole("ADMIN", "COMMISSIONER")

                        // Create Grievance
                        .requestMatchers(HttpMethod.POST, "/api/grievances")
                        .hasRole("CITIZEN")

                        // View Grievances
                        .requestMatchers(HttpMethod.GET, "/api/grievances/**")
                        .hasAnyRole(
                                "ADMIN",
                                "OFFICER",
                                "COMMISSIONER"
                        )

                        // Assign
                        .requestMatchers(HttpMethod.PUT, "/api/grievances/*/assign")
                        .hasAnyRole("ADMIN", "COMMISSIONER")

                        // Update Status
                        .requestMatchers(HttpMethod.PUT, "/api/grievances/*/status")
                        .hasAnyRole("ADMIN", "OFFICER", "COMMISSIONER")

                        // General Update
                        .requestMatchers(HttpMethod.PUT, "/api/grievances/*")
                        .hasAnyRole("ADMIN", "OFFICER")

                        // Delete
                        .requestMatchers(HttpMethod.DELETE, "/api/grievances/**")
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated()
                )

                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter scopes =
                new JwtGrantedAuthoritiesConverter();

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {

            Collection<GrantedAuthority> authorities =
                    new ArrayList<>(scopes.convert(jwt));

            Map<String, Object> realmAccess = jwt.getClaim("realm_access");

            if (realmAccess != null) {

                List<String> roles = (List<String>) realmAccess.get("roles");

                if (roles != null) {
                    roles.forEach(role ->
                            authorities.add(
                                    new SimpleGrantedAuthority("ROLE_" + role)
                            )
                    );
                }
            }

            return authorities;
        });

        return converter;
    }
}