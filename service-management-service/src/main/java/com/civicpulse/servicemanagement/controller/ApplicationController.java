package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApplyCertificateRequest;
import com.civicpulse.servicemanagement.dto.PermitApplicationRequest;
import com.civicpulse.servicemanagement.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // ================= Certificate =================

    @PostMapping("/certificates/apply")
    public ResponseEntity<ApplicationResponse> applyCertificate(
            @Valid @RequestBody ApplyCertificateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyCertificate(request));
    }

    // ================= Permit =================

    @PostMapping("/permits/apply")
    public ResponseEntity<ApplicationResponse> applyPermit(
            @Valid @RequestBody PermitApplicationRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyPermit(request));
    }

    // ================= Common =================

    @GetMapping("/my/{citizenId}")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @PathVariable Long citizenId) {

        return ResponseEntity.ok(
                applicationService.getApplicationsByCitizen(citizenId));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                applicationService.getApplication(applicationId));
    }
}