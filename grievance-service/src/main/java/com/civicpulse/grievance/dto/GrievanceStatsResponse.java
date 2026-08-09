package com.civicpulse.grievance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceStatsResponse {

    private long totalGrievances;
    private long submitted;
    private long assigned;
    private long inProgress;
    private long pending;
    private long resolved;
    private long closed;
    private long escalated;
    private long overdue;
    private double resolutionRate; // percentage
    private double slaComplianceRate; // percentage within SLA
    private double averageSatisfactionRating; // e.g. 4.7 out of 5.0
    private long totalFeedbackCount;
    private Map<String, Long> categoryDistribution;
    private Map<String, Long> priorityDistribution;
}
