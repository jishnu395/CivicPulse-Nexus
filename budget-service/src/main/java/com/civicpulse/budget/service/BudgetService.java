package com.civicpulse.budget.service;

import com.civicpulse.budget.dto.request.CreateBudgetRequest;
import com.civicpulse.budget.dto.response.BudgetResponse;

import java.util.List;

public interface BudgetService {

    BudgetResponse create(CreateBudgetRequest request);

    List<BudgetResponse> getAll();

    BudgetResponse getById(Long id);

}