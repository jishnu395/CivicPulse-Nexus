package com.civicpulse.servicemanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentVerificationRequest {

    @NotNull
    private Boolean verified;

    private String remarks;
}