package com.civicpulse.welfare.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplySchemeRequest {

    @NotNull(message = "Citizen ID is required")
    private Long citizenId;

    @NotNull(message = "Scheme ID is required")
    private Long schemeId;

    private Integer age;

    private Double annualIncome;

    private String ward;

    private String familyStatus;

    private String supportingDocuments;
}