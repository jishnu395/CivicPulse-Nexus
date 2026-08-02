package com.civicpulse.budget.mapper;

import com.civicpulse.budget.dto.response.ExpenseResponse;
import com.civicpulse.budget.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public ExpenseResponse toResponse(Expense expense) {

        return ExpenseResponse.builder()
                .id(expense.getId())
                .budgetId(expense.getBudgetId())
                .department(expense.getDepartment())
                .category(expense.getCategory())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .createdAt(expense.getCreatedAt())
                .build();
    }
}