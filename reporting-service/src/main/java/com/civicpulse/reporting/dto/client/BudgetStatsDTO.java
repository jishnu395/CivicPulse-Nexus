package com.civicpulse.reporting.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetStatsDTO {
    private BigDecimal totalAllocatedBudget;
    private BigDecimal totalUtilizedBudget;
    private BigDecimal totalRemainingBudget;
    private double utilizationPercentage;
    private long totalPayments;
    private long completedPayments;
    private long pendingPayments;
    private long failedPayments;
    private BigDecimal totalDistributedFunds;
    private long totalExpenses;
    private long departments;
}
