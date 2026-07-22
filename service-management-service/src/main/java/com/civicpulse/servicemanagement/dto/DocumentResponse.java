package com.civicpulse.servicemanagement.dto;

import com.civicpulse.servicemanagement.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {

    private Long id;

    private String documentName;

    private String documentUrl;

    private String fileType;

    private Long fileSize;

    private VerificationStatus verificationStatus;

    private String remarks;
}