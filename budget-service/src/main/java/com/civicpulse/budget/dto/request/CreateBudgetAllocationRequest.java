package com.civicpulse.budget.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBudgetAllocationRequest {

    @NotNull
    private Long budgetId;

    @NotNull
    private Long schemeId;

    @NotNull
    private BigDecimal allocatedAmount;

}