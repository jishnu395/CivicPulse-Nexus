package com.civicpulse.servicemanagement.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private Long id;

    private String certificateNo;

    private LocalDateTime issueDate;

    private String digitalSignature;

    private String pdfUrl;

    private Long applicationId;
}