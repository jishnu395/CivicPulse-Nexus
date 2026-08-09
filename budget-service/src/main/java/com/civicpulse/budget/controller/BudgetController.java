package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.request.CreateBudgetRequest;
import com.civicpulse.budget.dto.request.UpdateBudgetRequest;
import com.civicpulse.budget.dto.response.AnalyticsDashboardResponse;
import com.civicpulse.budget.dto.response.BudgetDashboardResponse;
import com.civicpulse.budget.dto.response.BudgetResponse;
import com.civicpulse.budget.service.AnalyticsService;
import com.civicpulse.budget.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final AnalyticsService analyticsService;

    // Create Budget
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetResponse create(
            @Valid @RequestBody CreateBudgetRequest request) {

        return budgetService.create(request);
    }

    // Update Budget
    @PutMapping("/{id}")
    public BudgetResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBudgetRequest request) {

        return budgetService.update(id, request);
    }

    // Delete Budget
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {

        budgetService.delete(id);
    }

    // Get All Budgets
    @GetMapping
    public List<BudgetResponse> getAll() {

        return budgetService.getAll();
    }

    // Get Budget By Id
    @GetMapping("/{id}")
    public BudgetResponse getById(@PathVariable Long id) {

        return budgetService.getById(id);
    }

    // Budget Utilization Percentage
    @GetMapping("/{id}/utilization")
    public double utilization(@PathVariable Long id) {

        return budgetService.utilization(id);
    }

    // Remaining Budget
    @GetMapping("/{id}/remaining")
    public BigDecimal remaining(@PathVariable Long id) {

        return budgetService.remaining(id);
    }

    // Budget Dashboard Summary
    @GetMapping("/dashboard")
    public BudgetDashboardResponse dashboard() {

        return budgetService.dashboard();
    }

    // Complete Analytics & Stats for Reporting
    @GetMapping("/stats")
    public AnalyticsDashboardResponse stats() {
        return analyticsService.dashboard();
    }
}