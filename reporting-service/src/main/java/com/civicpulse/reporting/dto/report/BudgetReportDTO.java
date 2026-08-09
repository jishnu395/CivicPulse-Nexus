package com.civicpulse.reporting.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetReportDTO {
    private BigDecimal totalAllocated;
    private BigDecimal totalUtilized;
    private BigDecimal totalRemaining;
    private double utilizationPercentage;
    private BigDecimal totalDistributedWelfare;
    private long completedPaymentsCount;
    private long pendingPaymentsCount;
    private long failedPaymentsCount;
    private LocalDateTime generatedAt;
}
