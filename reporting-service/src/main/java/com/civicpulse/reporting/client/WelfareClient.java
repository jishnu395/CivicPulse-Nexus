package com.civicpulse.reporting.client;

import com.civicpulse.reporting.dto.client.WelfareStatsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "WELFARE-SERVICE")
public interface WelfareClient {

    @GetMapping("/api/welfare/schemes/stats")
    WelfareStatsDTO getWelfareStats();
}
