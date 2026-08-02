package com.civicpulse.budget.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "WELFARE-SERVICE")
public interface WelfareFeignClient {

    @GetMapping("/api/welfare/schemes/{id}")
    Object getScheme(@PathVariable Long id);

    @GetMapping("/api/welfare/beneficiaries/{id}")
    Object getBeneficiary(@PathVariable Long id);

}