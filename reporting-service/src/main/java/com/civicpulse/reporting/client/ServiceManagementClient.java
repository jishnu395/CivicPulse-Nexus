package com.civicpulse.reporting.client;

import com.civicpulse.reporting.dto.client.ServiceStatsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "SERVICE-MANAGEMENT-SERVICE")
public interface ServiceManagementClient {

    @GetMapping("/api/dashboard/stats")
    ServiceStatsDTO getServiceStats();
}
