package com.civicpulse.budget.service;

import com.civicpulse.budget.dto.request.CreateBudgetAllocationRequest;
import com.civicpulse.budget.dto.response.BudgetAllocationResponse;

import java.util.List;

public interface BudgetAllocationService {

    BudgetAllocationResponse allocate(CreateBudgetAllocationRequest request);

    List<BudgetAllocationResponse> getAll();

    List<BudgetAllocationResponse> getByBudget(Long budgetId);

}