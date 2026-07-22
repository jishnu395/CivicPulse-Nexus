package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApprovalRequest;
import com.civicpulse.servicemanagement.dto.DocumentVerificationRequest;
import com.civicpulse.servicemanagement.dto.VerifyDocumentRequest;
import com.civicpulse.servicemanagement.dto.DocumentResponse;

import java.util.List;

public interface OfficerService {

    List<ApplicationResponse> getPendingApplications();

    ApplicationResponse verifyApplication(Long applicationId,
                                          VerifyDocumentRequest request);

    ApplicationResponse approveApplication(Long applicationId,
                                           ApprovalRequest request);

    ApplicationResponse rejectApplication(Long applicationId, ApprovalRequest request);

    ApplicationResponse verifyDocument(Long documentId, DocumentVerificationRequest request);

    List<DocumentResponse> getDocuments(Long applicationId);

}