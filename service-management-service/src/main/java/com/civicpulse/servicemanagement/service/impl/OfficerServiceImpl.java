package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.*;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.entity.Document;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.VerificationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.mapper.ApplicationMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.DocumentRepository;
import com.civicpulse.servicemanagement.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficerServiceImpl implements OfficerService {

    private final ApplicationRepository applicationRepository;
    private final DocumentRepository documentRepository;
    private final ApplicationMapper applicationMapper;
    private final ApplicationEventProducer eventProducer;

    @Override
    public List<ApplicationResponse> getPendingApplications() {

        List<ApplicationStatus> pendingStatuses = List.of(
                ApplicationStatus.SUBMITTED,
                ApplicationStatus.UNDER_VERIFICATION,
                ApplicationStatus.VERIFIED
        );

        return applicationRepository.findByStatusIn(pendingStatuses)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    @Override
    public ApplicationResponse verifyApplication(Long applicationId,
                                                 VerifyDocumentRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        application.setStatus(
                request.isVerified()
                        ? ApplicationStatus.VERIFIED
                        : ApplicationStatus.UNDER_VERIFICATION
        );

        application.setRemarks(request.getRemarks());

        Application updated = applicationRepository.save(application);

        eventProducer.publish(
                "application-verified",
                updated.getApplicationNo()
        );

        return applicationMapper.toResponse(updated);
    }

    @Override
    public ApplicationResponse approveApplication(Long applicationId,
                                                  ApprovalRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        boolean allVerified = application.getDocuments()
                .stream()
                .allMatch(doc ->
                        doc.getVerificationStatus() == VerificationStatus.VERIFIED);

        if (!allVerified) {
            throw new BadRequestException(
                    "All documents must be VERIFIED before approval.");
        }

        application.setStatus(ApplicationStatus.APPROVED);
        application.setApprovalDate(LocalDateTime.now());
        application.setRemarks(request.getRemarks());

        Application updated = applicationRepository.save(application);

        eventProducer.publish(
                "application-approved",
                updated.getApplicationNo()
        );

        return applicationMapper.toResponse(updated);
    }

    @Override
    public ApplicationResponse rejectApplication(Long applicationId,
                                                 ApprovalRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRemarks(request.getRemarks());

        Application updated = applicationRepository.save(application);

        eventProducer.publish(
                "application-rejected",
                updated.getApplicationNo()
        );

        return applicationMapper.toResponse(updated);
    }

    @Override
    public ApplicationResponse verifyDocument(Long documentId,
                                              DocumentVerificationRequest request) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id : " + documentId));

        if (Boolean.TRUE.equals(request.getVerified())) {
            document.setVerificationStatus(VerificationStatus.VERIFIED);
        } else {
            document.setVerificationStatus(VerificationStatus.NEEDS_CORRECTION);
        }

        document.setRemarks(request.getRemarks());

        documentRepository.save(document);

        Application application = document.getApplication();

        boolean allVerified = application.getDocuments()
                .stream()
                .allMatch(doc ->
                        doc.getVerificationStatus() == VerificationStatus.VERIFIED);

        if (allVerified) {

            application.setStatus(ApplicationStatus.VERIFIED);

            applicationRepository.save(application);

            eventProducer.publish(
                    "document-verified",
                    application.getApplicationNo()
            );
        } else {

            application.setStatus(ApplicationStatus.UNDER_VERIFICATION);

            applicationRepository.save(application);
        }

        return applicationMapper.toResponse(application);
    }

    @Override
    public List<DocumentResponse> getDocuments(Long applicationId) {

        applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        return documentRepository.findByApplication_Id(applicationId)
                .stream()
                .map(document -> DocumentResponse.builder()
                        .id(document.getId())
                        .documentName(document.getDocumentName())
                        .documentUrl(document.getDocumentUrl())
                        .fileType(document.getFileType())
                        .fileSize(document.getFileSize())
                        .verificationStatus(document.getVerificationStatus())
                        .remarks(document.getRemarks())
                        .build())
                .toList();
    }
}