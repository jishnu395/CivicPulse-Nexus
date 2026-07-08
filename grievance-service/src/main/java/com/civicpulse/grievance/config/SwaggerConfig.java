package com.civicpulse.grievance.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI grievanceServiceOpenAPI() {

        return new OpenAPI()

                .info(new Info()

                        .title("CivicPulse Nexus - Grievance Service API")

                        .description("REST APIs for Grievance Management in CivicPulse Nexus")

                        .version("1.0")

                        .contact(new Contact()
                                .name("Jishnu")
                                .email("support@civicpulse.com"))

                        .license(new License()
                                .name("Apache 2.0")))

                .externalDocs(new ExternalDocumentation()
                        .description("CivicPulse Nexus Documentation"));
    }
}