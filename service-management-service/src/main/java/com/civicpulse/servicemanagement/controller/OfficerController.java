package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApprovalRequest;
import com.civicpulse.servicemanagement.dto.VerifyDocumentRequest;
import com.civicpulse.servicemanagement.service.OfficerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.civicpulse.servicemanagement.dto.DocumentVerificationRequest;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;

    @GetMapping("/pending")
    public ResponseEntity<List<ApplicationResponse>> getPendingApplications() {

        return ResponseEntity.ok(
                officerService.getPendingApplications());
    }

    @PutMapping("/verify/{applicationId}")
    public ResponseEntity<ApplicationResponse> verifyApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody VerifyDocumentRequest request) {

        return ResponseEntity.ok(
                officerService.verifyApplication(applicationId, request));
    }

    @PutMapping("/document/{documentId}")
    public ResponseEntity<ApplicationResponse> verifyDocument(
            @PathVariable Long documentId,
            @Valid @RequestBody DocumentVerificationRequest request) {

        return ResponseEntity.ok(
                officerService.verifyDocument(documentId, request));
    }

    @PutMapping("/approve/{applicationId}")
    public ResponseEntity<ApplicationResponse> approveApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApprovalRequest request) {

        return ResponseEntity.ok(
                officerService.approveApplication(applicationId, request));
    }

    @PutMapping("/reject/{applicationId}")
    public ResponseEntity<ApplicationResponse> rejectApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApprovalRequest request) {

        return ResponseEntity.ok(
                officerService.rejectApplication(applicationId, request));
    }
}