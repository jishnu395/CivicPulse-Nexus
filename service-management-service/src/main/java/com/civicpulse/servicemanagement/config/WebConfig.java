package com.civicpulse.servicemanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Generated Certificates
        registry.addResourceHandler("/certificates/**")
                .addResourceLocations("file:certificates/");

        // Uploaded Documents
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}