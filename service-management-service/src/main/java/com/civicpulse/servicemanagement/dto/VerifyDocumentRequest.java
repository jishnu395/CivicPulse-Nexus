package com.civicpulse.servicemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyDocumentRequest {

    @NotBlank
    private String remarks;

    private boolean verified;
}