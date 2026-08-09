package com.civicpulse.reporting.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentPerformanceDTO {
    private String departmentName;
    private long totalTasks;
    private double resolutionRate;
    private double slaComplianceRate;
    private double revenueCollected;
    private double performanceScore;
}
