package com.civicpulse.budget.dto.request;

import com.civicpulse.budget.enums.ExpenseCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateExpenseRequest {

    @NotNull
    private Long budgetId;

    @NotBlank
    private String department;

    @NotNull
    private ExpenseCategory category;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal amount;

}