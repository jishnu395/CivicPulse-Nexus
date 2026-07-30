package com.civicpulse.welfare.dto.response;

import com.civicpulse.welfare.enums.SchemeStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SchemeResponse {

    private Long id;

    private String schemeName;

    private String description;

    private String department;

    private String eligibilityCriteria;

    private Double benefitAmount;

    private SchemeStatus status;

    private LocalDate startDate;

    private LocalDate endDate;
}