package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.response.AnalyticsDashboardResponse;
import com.civicpulse.budget.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public AnalyticsDashboardResponse dashboard(){

        return analyticsService.dashboard();

    }

}