package com.civicpulse.servicemanagement.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermitResponse {

    private Long id;

    private String permitNo;

    private LocalDateTime issueDate;

    private String digitalSignature;

    private String pdfUrl;

    private Long applicationId;

}