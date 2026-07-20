package com.civicpulse.servicemanagement.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private Long id;

    private String certificateNo;

    private LocalDateTime issueDate;

    private String pdfUrl;
}