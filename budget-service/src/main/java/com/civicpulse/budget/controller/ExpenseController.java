package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.request.CreateExpenseRequest;
import com.civicpulse.budget.dto.response.ExpenseResponse;
import com.civicpulse.budget.enums.ExpenseCategory;
import com.civicpulse.budget.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseResponse create(@Valid @RequestBody CreateExpenseRequest request) {
        return expenseService.create(request);
    }

    @GetMapping
    public List<ExpenseResponse> getAll() {
        return expenseService.getAll();
    }

    @GetMapping("/{id}")
    public ExpenseResponse getById(@PathVariable Long id) {
        return expenseService.getById(id);
    }

    @GetMapping("/budget/{budgetId}")
    public List<ExpenseResponse> getByBudget(@PathVariable Long budgetId) {
        return expenseService.getByBudget(budgetId);
    }

    @GetMapping("/department/{department}")
    public List<ExpenseResponse> getByDepartment(@PathVariable String department) {
        return expenseService.getByDepartment(department);
    }

    @GetMapping("/category/{category}")
    public List<ExpenseResponse> getByCategory(@PathVariable ExpenseCategory category) {
        return expenseService.getByCategory(category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        expenseService.delete(id);
    }
}