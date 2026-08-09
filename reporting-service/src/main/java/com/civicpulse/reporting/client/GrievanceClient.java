package com.civicpulse.reporting.client;

import com.civicpulse.reporting.dto.client.GrievanceStatsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "GRIEVANCE-SERVICE")
public interface GrievanceClient {

    @GetMapping("/api/grievances/stats")
    GrievanceStatsDTO getGrievanceStats();
}
