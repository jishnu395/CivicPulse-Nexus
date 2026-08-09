package com.civicpulse.reporting.client;

import com.civicpulse.reporting.dto.client.CitizenStatsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "CITIZEN-SERVICE")
public interface CitizenClient {

    @GetMapping("/api/citizens/stats")
    CitizenStatsDTO getCitizenStats();
}
