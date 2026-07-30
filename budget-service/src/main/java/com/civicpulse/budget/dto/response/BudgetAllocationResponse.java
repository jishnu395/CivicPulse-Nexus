package com.civicpulse.budget.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class BudgetAllocationResponse {

    private Long id;

    private Long budgetId;

    private Long schemeId;

    private BigDecimal allocatedAmount;

    private BigDecimal utilizedAmount;

    private BigDecimal remainingAmount;

    private LocalDate allocatedDate;

}