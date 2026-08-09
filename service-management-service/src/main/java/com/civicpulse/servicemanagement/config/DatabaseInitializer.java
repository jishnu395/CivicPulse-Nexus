package com.civicpulse.servicemanagement.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            log.info("Checking and applying non-destructive schema migrations for service-management-service...");

            jdbcTemplate.execute("ALTER TABLE applications ADD COLUMN IF NOT EXISTS fee_amount DOUBLE PRECISION DEFAULT 20.0;");
            jdbcTemplate.execute("ALTER TABLE applications ADD COLUMN IF NOT EXISTS payment_status VARCHAR(255) DEFAULT 'PAID';");
            jdbcTemplate.execute("UPDATE applications SET fee_amount = 20.0 WHERE fee_amount IS NULL;");
            jdbcTemplate.execute("UPDATE applications SET payment_status = 'PAID' WHERE payment_status IS NULL;");

            log.info("Schema migration for applications table verified and applied successfully.");
        } catch (Exception e) {
            log.warn("Database initialization notice: {}", e.getMessage());
        }
    }
}
