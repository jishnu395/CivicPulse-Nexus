package com.civicpulse.servicemanagement.mapper;

import com.civicpulse.servicemanagement.dto.CertificateResponse;
import com.civicpulse.servicemanagement.entity.Certificate;
import org.springframework.stereotype.Component;

@Component
public class CertificateMapper {

    public CertificateResponse toResponse(Certificate certificate) {

        return CertificateResponse.builder()
                .id(certificate.getId())
                .certificateNo(certificate.getCertificateNo())
                .issueDate(certificate.getIssueDate())
                .digitalSignature(certificate.getDigitalSignature())
                .pdfUrl(certificate.getPdfUrl())
                .applicationId(certificate.getApplication().getId())
                .build();
    }
}