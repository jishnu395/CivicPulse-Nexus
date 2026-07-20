package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.dto.UploadDocumentResponse;
import com.civicpulse.servicemanagement.entity.Document;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    UploadDocumentResponse uploadDocument(Long applicationId, MultipartFile file);

    List<Document> getDocumentsByApplication(Long applicationId);

    UploadDocumentResponse downloadDocument(Long documentId);

    void deleteDocument(Long documentId);
}