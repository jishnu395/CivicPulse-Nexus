package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApplyCertificateRequest;
//import com.civicpulse.servicemanagement.dto.UploadDocumentResponse;
//import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse applyCertificate(ApplyCertificateRequest request);

    List<ApplicationResponse> getApplicationsByCitizen(Long citizenId);

    ApplicationResponse getApplication(Long applicationId);

//    UploadDocumentResponse uploadDocument(Long applicationId, MultipartFile file);
}