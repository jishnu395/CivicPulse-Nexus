package com.civicpulse.reporting.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportDTO {
    private double totalRevenue;
    private long totalTransactions;
    private long certificatesIssued;
    private long permitsIssued;
    private Map<String, Long> applicationsByDepartment;
    private Map<String, Double> revenueByDepartment;
    private LocalDateTime generatedAt;
}
