package com.civicpulse.servicemanagement.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

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