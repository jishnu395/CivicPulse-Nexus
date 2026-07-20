package com.civicpulse.servicemanagement.dto;

import com.civicpulse.servicemanagement.enums.CertificateType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplyCertificateRequest {

    @NotNull
    private Long citizenId;

    @NotNull
    private CertificateType certificateType;
}