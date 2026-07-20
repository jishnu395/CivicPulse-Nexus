package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.CertificateResponse;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.entity.Certificate;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.CertificateRepository;
import com.civicpulse.servicemanagement.service.CertificateService;
import com.civicpulse.servicemanagement.service.PdfService;
import com.civicpulse.servicemanagement.util.CertificateNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final ApplicationRepository applicationRepository;
    private final CertificateRepository certificateRepository;
    private final PdfService pdfService;
    private final ApplicationEventProducer eventProducer;


    @Override
    public CertificateResponse generateCertificate(Long applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found."));

        if (application.getStatus() != ApplicationStatus.APPROVED) {

            throw new BadRequestException(
                    "Application must be approved.");
        }

        if (certificateRepository.findByApplication_Id(applicationId).isPresent()) {

            throw new BadRequestException(
                    "Certificate already exists.");
        }

        String pdfPath = pdfService.generateCertificate(application);

        Certificate certificate = Certificate.builder()
                .certificateNo(CertificateNumberGenerator.generate())
                .issueDate(LocalDateTime.now())
                .digitalSignature("CIVICPULSE-DIGITAL-SIGN")
                .pdfUrl(pdfPath)
                .application(application)
                .build();

        Certificate saved =
                certificateRepository.save(certificate);

        application.setCertificate(saved);
        application.setStatus(ApplicationStatus.CERTIFICATE_GENERATED);

        applicationRepository.save(application);

        eventProducer.publish(
                "certificate-generated",
                saved.getCertificateNo()
        );

        return CertificateResponse.builder()
                .id(saved.getId())
                .certificateNo(saved.getCertificateNo())
                .issueDate(saved.getIssueDate())
                .pdfUrl(saved.getPdfUrl())
                .build();
    }

    @Override
    public CertificateResponse downloadCertificate(Long applicationId) {

        Certificate certificate = certificateRepository.findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Certificate not found for application id: " + applicationId));

        return CertificateResponse.builder()
                .id(certificate.getId())
                .certificateNo(certificate.getCertificateNo())
                .issueDate(certificate.getIssueDate())
                .pdfUrl(certificate.getPdfUrl())
                .build();
    }

}