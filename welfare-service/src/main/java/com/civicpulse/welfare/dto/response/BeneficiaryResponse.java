package com.civicpulse.welfare.dto.response;

import com.civicpulse.welfare.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BeneficiaryResponse {

    private Long id;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    private Double benefitAmount;

    private LocalDate enrollmentDate;

    private ApplicationStatus status;
}