package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.UploadDocumentResponse;
import com.civicpulse.servicemanagement.entity.Document;
import com.civicpulse.servicemanagement.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload/{applicationId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadDocumentResponse> uploadDocument(
            @PathVariable Long applicationId,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                documentService.uploadDocument(applicationId, file));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<Document>> getDocuments(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                documentService.getDocumentsByApplication(applicationId));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<UploadDocumentResponse> getDocument(
            @PathVariable Long documentId) {

        return ResponseEntity.ok(
                documentService.downloadDocument(documentId));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Long documentId) {

        documentService.deleteDocument(documentId);

        return ResponseEntity.ok("Document deleted successfully.");
    }
}