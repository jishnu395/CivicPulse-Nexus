package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApprovalRequest;
import com.civicpulse.servicemanagement.dto.VerifyDocumentRequest;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.mapper.ApplicationMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.civicpulse.servicemanagement.dto.DocumentVerificationRequest;
import com.civicpulse.servicemanagement.entity.Document;
import com.civicpulse.servicemanagement.enums.VerificationStatus;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.repository.DocumentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficerServiceImpl implements OfficerService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final DocumentRepository documentRepository;
    private final ApplicationEventProducer eventProducer;

    @Override
    public List<ApplicationResponse> getPendingApplications() {

        List<ApplicationStatus> pendingStatuses = List.of(
                ApplicationStatus.SUBMITTED,
                ApplicationStatus.UNDER_VERIFICATION
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
                                "Application not found with id: " + applicationId));

        application.setStatus(
                request.isVerified()
                        ? ApplicationStatus.VERIFIED
                        : ApplicationStatus.UNDER_VERIFICATION
        );

        application.setRemarks(request.getRemarks());

        Application updatedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(updatedApplication);
    }

    @Override
    public ApplicationResponse approveApplication(Long applicationId,
                                                  ApprovalRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + applicationId));

        if (application.getStatus() != ApplicationStatus.VERIFIED) {
            throw new BadRequestException(
                    "Application must be VERIFIED before approval.");
        }

        application.setStatus(ApplicationStatus.APPROVED);
        application.setApprovalDate(LocalDateTime.now());
        application.setRemarks(request.getRemarks());

        Application updatedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(updatedApplication);
    }

    @Override
    public ApplicationResponse rejectApplication(Long applicationId,
                                                 ApprovalRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + applicationId));

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRemarks(request.getRemarks());

        Application updatedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(updatedApplication);
    }

    @Override
    public ApplicationResponse verifyDocument(Long documentId,
                                              DocumentVerificationRequest request) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Document not found"));

        if (request.getVerified()) {

            document.setVerificationStatus(VerificationStatus.VERIFIED);

        } else {

            document.setVerificationStatus(VerificationStatus.NEEDS_CORRECTION);
        }

        document.setRemarks(request.getRemarks());

        documentRepository.save(document);

        Application application = document.getApplication();

        boolean allVerified = application.getDocuments()
                .stream()
                .allMatch(d -> d.getVerificationStatus() == VerificationStatus.VERIFIED);

        if (allVerified) {

            application.setStatus(ApplicationStatus.VERIFIED);

            applicationRepository.save(application);

            eventProducer.publish(
                    "document-verified",
                    "Application " + application.getApplicationNo() + " verified"
            );
        }

        return applicationMapper.toResponse(application);
    }
}