package com.civicpulse.budget.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDashboardResponse {

    // Budget

    private BigDecimal totalAllocatedBudget;

    private BigDecimal totalUtilizedBudget;

    private BigDecimal totalRemainingBudget;

    private double utilizationPercentage;

    // Payments

    private long totalPayments;

    private long completedPayments;

    private long pendingPayments;

    private long failedPayments;

    private BigDecimal totalDistributedFunds;

    // Expenses

    private long totalExpenses;

    // Performance

    private long departments;

}