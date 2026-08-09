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
public class GrievanceReportDTO {
    private long totalGrievances;
    private long submitted;
    private long assigned;
    private long inProgress;
    private long pending;
    private long resolved;
    private long closed;
    private long escalated;
    private long overdue;
    private double resolutionRate;
    private double slaComplianceRate;
    private double averageSatisfactionRating;
    private long totalFeedbackCount;
    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> priorityBreakdown;
    private LocalDateTime generatedAt;
}
