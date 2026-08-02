package com.civicpulse.budget.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetDashboardResponse {

    private BigDecimal totalAllocated;

    private BigDecimal totalUtilized;

    private BigDecimal totalRemaining;

    private Double utilizationPercentage;

}