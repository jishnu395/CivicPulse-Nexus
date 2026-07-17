package com.civicpulse.grievance.feign;

import com.civicpulse.grievance.config.FeignClientConfig;
import com.civicpulse.grievance.dto.feign.CitizenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "CITIZEN-SERVICE",
        configuration = FeignClientConfig.class
)
public interface CitizenClient {

    @GetMapping("/api/citizens/{id}")
    CitizenResponse getCitizenById(@PathVariable("id") Long id);

}