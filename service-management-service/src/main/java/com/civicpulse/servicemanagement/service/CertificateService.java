package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.dto.CertificateResponse;

public interface CertificateService {

    CertificateResponse generateCertificate(Long applicationId);

    CertificateResponse downloadCertificate(Long applicationId);
}