package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.CertificateResponse;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.entity.Certificate;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.mapper.CertificateMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.CertificateRepository;
import com.civicpulse.servicemanagement.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final ApplicationRepository applicationRepository;
    private final CertificateMapper certificateMapper;
    private final ApplicationEventProducer eventProducer;

    @Override
    public CertificateResponse generateCertificate(Long applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        if (application.getStatus() != ApplicationStatus.APPROVED) {
            throw new BadRequestException(
                    "Application must be APPROVED before generating certificate.");
        }

        certificateRepository.findByApplication_Id(applicationId)
                .ifPresent(c -> {
                    throw new BadRequestException(
                            "Certificate already generated.");
                });

        String certificateNo =
                "CERT-" +
                        LocalDateTime.now().getYear() +
                        "-" +
                        UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Certificate certificate = Certificate.builder()
                .certificateNo(certificateNo)
                .issueDate(LocalDateTime.now())
                .digitalSignature("DIGITAL-SIGNATURE")
                .pdfUrl("/certificates/" + certificateNo + ".pdf")
                .application(application)
                .build();

        Certificate saved = certificateRepository.save(certificate);

        application.setStatus(ApplicationStatus.CERTIFICATE_GENERATED);
        applicationRepository.save(application);

        eventProducer.publish(
                "certificate-generated",
                saved.getCertificateNo()
        );

        return certificateMapper.toResponse(saved);
    }

    @Override
    public CertificateResponse getCertificate(Long applicationId) {

        Certificate certificate = certificateRepository.findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Certificate not found."));

        return certificateMapper.toResponse(certificate);
    }

    @Override
    public CertificateResponse downloadCertificate(Long applicationId) {

        Certificate certificate = certificateRepository.findByApplication_Id(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certificate not found."));

        return certificateMapper.toResponse(certificate);
    }
}