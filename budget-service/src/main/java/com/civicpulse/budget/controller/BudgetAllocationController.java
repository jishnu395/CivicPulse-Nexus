package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.request.CreateBudgetAllocationRequest;
import com.civicpulse.budget.dto.response.BudgetAllocationResponse;
import com.civicpulse.budget.service.BudgetAllocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget/allocation")
@RequiredArgsConstructor
public class BudgetAllocationController {

    private final BudgetAllocationService allocationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetAllocationResponse allocate(
            @Valid @RequestBody CreateBudgetAllocationRequest request) {

        return allocationService.allocate(request);
    }

    @GetMapping
    public List<BudgetAllocationResponse> getAll() {

        return allocationService.getAll();
    }

    @GetMapping("/budget/{budgetId}")
    public List<BudgetAllocationResponse> getByBudget(
            @PathVariable Long budgetId) {

        return allocationService.getByBudget(budgetId);
    }
}