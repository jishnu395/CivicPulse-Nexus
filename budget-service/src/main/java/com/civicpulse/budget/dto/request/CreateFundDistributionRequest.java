package com.civicpulse.budget.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateFundDistributionRequest {

    @NotNull
    private Long beneficiaryId;

    @NotNull
    private Long citizenId;

    @NotNull
    private Long schemeId;

    @NotNull
    private Long budgetId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

}