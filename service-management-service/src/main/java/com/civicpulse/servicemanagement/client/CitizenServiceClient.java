package com.civicpulse.servicemanagement.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "CITIZEN-SERVICE")
public interface CitizenServiceClient {

    @GetMapping("/api/citizens/{id}")
    Map<String, Object> getCitizenById(@PathVariable("id") Long id);

    @GetMapping("/api/citizens/user/{userId}")
    Map<String, Object> getCitizenByUserId(@PathVariable("userId") Long userId);
}