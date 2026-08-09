package com.civicpulse.reporting.dto.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceReportDTO {
    private double overallSlaScore;
    private double overallCitizenSatisfaction;
    private double overallGrievanceResolutionRate;
    private double overallBudgetEfficiency;
    private List<DepartmentPerformanceDTO> departmentScorecards;
    private LocalDateTime generatedAt;
}
