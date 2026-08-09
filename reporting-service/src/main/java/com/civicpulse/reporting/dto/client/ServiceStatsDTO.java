package com.civicpulse.reporting.dto.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceStatsDTO {
    private long totalApplications;
    private long submitted;
    private long underVerification;
    private long verified;
    private long approved;
    private long rejected;
    private long certificatesGenerated;
    private long permitsGenerated;
    private double totalRevenue;
    private long totalDownloads;
    private Map<String, Long> applicationsByDepartment;
    private Map<String, Double> revenueByDepartment;
}
