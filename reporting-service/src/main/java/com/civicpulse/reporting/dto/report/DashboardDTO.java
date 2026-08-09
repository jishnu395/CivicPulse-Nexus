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
public class DashboardDTO {
    private long totalCitizens;
    private long activeCitizens;
    private double slaComplianceRate;
    private double grievanceResolutionRate;
    private double averageCitizenSatisfaction;
    private double totalRevenueCollected;
    private BigDecimal totalBudgetAllocated;
    private BigDecimal totalBudgetUtilized;
    private double budgetUtilizationPercentage;
    private long totalActiveBeneficiaries;
    private double totalWelfareDisbursed;
    private long totalCertificatesIssued;
    private long totalPermitsIssued;
    private long totalActiveGrievances;
    private LocalDateTime generatedAt;
}
