package com.civicpulse.servicemanagement.dto;

import lombok.*;

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
}