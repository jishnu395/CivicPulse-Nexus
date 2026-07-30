package com.civicpulse.welfare.dto.request;

import com.civicpulse.welfare.enums.SchemeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateSchemeRequest {

    @NotBlank
    private String schemeName;

    private String description;

    @NotBlank
    private String department;

    @NotBlank
    private String eligibilityCriteria;

    @NotNull
    private Double benefitAmount;

    @NotNull
    private SchemeStatus status;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}