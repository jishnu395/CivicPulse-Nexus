package com.civicpulse.reporting.client;

import com.civicpulse.reporting.dto.client.BudgetStatsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "BUDGET-SERVICE")
public interface BudgetClient {

    @GetMapping("/api/budget/stats")
    BudgetStatsDTO getBudgetStats();
}
