package com.civicpulse.citizen.client;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI citizenServiceOpenAPI() {

        return new OpenAPI()

                .info(new Info()
                        .title("CivicPulse Nexus - Citizen Service API")
                        .description("""
                                Citizen Service manages citizen profiles for the
                                CivicPulse Nexus microservices platform.
                                
                                Features:
                                • Register Citizen
                                • Update Citizen
                                • Delete Citizen
                                • Search Citizen
                                • OpenFeign Integration with User Service
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Jishnu V")
                                .email("jishnu@example.com")
                                .url("https://github.com/jishnu395"))
                        .license(new License()
                                .name("MIT License")))

                .externalDocs(new ExternalDocumentation()
                        .description("CivicPulse Nexus Repository")
                        .url("https://github.com/jishnu395/CivicPulse-Nexus"));
    }
}