package com.civicpulse.servicemanagement.mapper;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.entity.Application;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public ApplicationResponse toResponse(Application application) {

        return ApplicationResponse.builder()
                .id(application.getId())
                .applicationNo(application.getApplicationNo())
                .citizenId(application.getCitizenId())
                .certificateType(application.getCertificateType())
                .department(application.getDepartment())
                .status(application.getStatus())
                .submissionDate(application.getSubmissionDate())
                .approvalDate(application.getApprovalDate())
                .build();
    }
}