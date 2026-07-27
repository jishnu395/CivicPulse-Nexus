package com.civicpulse.servicemanagement.mapper;

import com.civicpulse.servicemanagement.dto.PermitResponse;
import com.civicpulse.servicemanagement.entity.Permit;
import org.springframework.stereotype.Component;

@Component
public class PermitMapper {

    public PermitResponse toResponse(Permit permit){

        return PermitResponse.builder()
                .id(permit.getId())
                .permitNo(permit.getPermitNo())
                .issueDate(permit.getIssueDate())
                .digitalSignature(permit.getDigitalSignature())
                .pdfUrl(permit.getPdfUrl())
                .applicationId(permit.getApplication().getId())
                .build();
    }

}