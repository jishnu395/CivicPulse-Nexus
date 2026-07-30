package com.civicpulse.budget.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBudgetRequest {

    @NotBlank
    private String department;

    @NotNull
    private String financialYear;

    @NotNull
    private BigDecimal allocatedAmount;

}