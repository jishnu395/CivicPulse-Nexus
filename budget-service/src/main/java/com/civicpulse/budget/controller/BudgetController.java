package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.request.CreateBudgetRequest;
import com.civicpulse.budget.dto.response.BudgetResponse;
import com.civicpulse.budget.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetResponse create(
            @Valid @RequestBody CreateBudgetRequest request) {

        return budgetService.create(request);
    }

    @GetMapping
    public List<BudgetResponse> getAll() {

        return budgetService.getAll();
    }

    @GetMapping("/{id}")
    public BudgetResponse getById(
            @PathVariable Long id) {

        return budgetService.getById(id);
    }

}