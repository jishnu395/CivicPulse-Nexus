package com.civicpulse.servicemanagement.dto;

import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.CertificateType;
import com.civicpulse.servicemanagement.enums.DepartmentType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private Long id;

    private String applicationNo;

    private Long citizenId;

    private CertificateType certificateType;

    private DepartmentType department;

    private ApplicationStatus status;

    private LocalDateTime submissionDate;

    private LocalDateTime approvalDate;
}