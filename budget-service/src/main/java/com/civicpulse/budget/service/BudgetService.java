package com.civicpulse.budget.service;

import com.civicpulse.budget.dto.request.CreateBudgetRequest;
import com.civicpulse.budget.dto.request.UpdateBudgetRequest;
import com.civicpulse.budget.dto.response.BudgetDashboardResponse;
import com.civicpulse.budget.dto.response.BudgetResponse;

import java.math.BigDecimal;
import java.util.List;

public interface BudgetService {

    // Budget CRUD
    BudgetResponse create(CreateBudgetRequest request);

    BudgetResponse update(Long id, UpdateBudgetRequest request);

    void delete(Long id);

    List<BudgetResponse> getAll();

    BudgetResponse getById(Long id);

    // Dashboard & Analytics
    BudgetDashboardResponse dashboard();

    // Budget Utilization
    double utilization(Long budgetId);

    // Remaining Budget
    BigDecimal remaining(Long budgetId);
}