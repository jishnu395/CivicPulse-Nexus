package com.civicpulse.budget.service;

import com.civicpulse.budget.dto.request.CreateExpenseRequest;
import com.civicpulse.budget.dto.response.ExpenseResponse;
import com.civicpulse.budget.enums.ExpenseCategory;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse create(CreateExpenseRequest request);

    List<ExpenseResponse> getAll();

    ExpenseResponse getById(Long id);

    List<ExpenseResponse> getByBudget(Long budgetId);

    List<ExpenseResponse> getByDepartment(String department);

    List<ExpenseResponse> getByCategory(ExpenseCategory category);

    void delete(Long id);

}