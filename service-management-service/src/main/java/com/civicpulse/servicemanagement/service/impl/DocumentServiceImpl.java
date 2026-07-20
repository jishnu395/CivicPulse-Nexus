package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.UploadDocumentResponse;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.entity.Document;
import com.civicpulse.servicemanagement.enums.VerificationStatus;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.kafka.ApplicationEventProducer;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.DocumentRepository;
import com.civicpulse.servicemanagement.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationEventProducer eventProducer;

    private static final Path UPLOAD_DIR = Paths.get("uploads");

    @Override
    public UploadDocumentResponse uploadDocument(Long applicationId, MultipartFile file) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        if (file.isEmpty()) {
            throw new BadRequestException("File cannot be empty.");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("application/pdf")
                        || contentType.equals("image/jpeg")
                        || contentType.equals("image/png"))) {

            throw new BadRequestException(
                    "Only PDF, JPG and PNG files are allowed.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(
                    "Maximum file size allowed is 5 MB.");
        }

        try {

            if (!Files.exists(UPLOAD_DIR)) {
                Files.createDirectories(UPLOAD_DIR);
            }

            String fileName =
                    System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path target = UPLOAD_DIR.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Document document = Document.builder()
                    .documentName(file.getOriginalFilename())
                    .documentUrl(target.toString())
                    .fileType(contentType)
                    .fileSize(file.getSize())
                    .verificationStatus(VerificationStatus.PENDING)
                    .application(application)
                    .build();

            Document savedDocument = documentRepository.save(document);

            eventProducer.publish(
                    "document-uploaded",
                    savedDocument.getDocumentName()
            );

            return UploadDocumentResponse.builder()
                    .id(savedDocument.getId())
                    .documentName(savedDocument.getDocumentName())
                    .fileUrl(savedDocument.getDocumentUrl())
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Unable to upload document.", e);
        }
    }

    @Override
    public List<Document> getDocumentsByApplication(Long applicationId) {

        applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        return documentRepository.findByApplication_Id(applicationId);
    }

    @Override
    public UploadDocumentResponse downloadDocument(Long documentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id : " + documentId));

        return UploadDocumentResponse.builder()
                .id(document.getId())
                .documentName(document.getDocumentName())
                .fileUrl(document.getDocumentUrl())
                .build();
    }

    @Override
    public void deleteDocument(Long documentId) {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Document not found with id : " + documentId));

        try {
            Files.deleteIfExists(Paths.get(document.getDocumentUrl()));
        } catch (IOException ignored) {
        }

        documentRepository.delete(document);
    }
}