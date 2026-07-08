package com.civicpulse.grievance.dto;

import lombok.Data;

@Data
public class GrievanceDashboardResponse {

    private long total;

    private long submitted;

    private long assigned;

    private long inProgress;

    private long resolved;

    private long closed;

    private long escalated;

    private long overdue;
}