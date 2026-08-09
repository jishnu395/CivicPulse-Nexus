package com.civicpulse.welfare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WelfareStatsResponse {

    private long totalSchemes;
    private long activeSchemes;
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long totalBeneficiaries;
    private double totalDisbursedBenefitAmount;
    private Map<String, Long> schemesByDepartment;
}
