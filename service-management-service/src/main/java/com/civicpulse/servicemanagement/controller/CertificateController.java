package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.CertificateResponse;
import com.civicpulse.servicemanagement.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificate")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/generate/{applicationId}")
    public ResponseEntity<CertificateResponse> generateCertificate(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                certificateService.generateCertificate(applicationId));
    }

    @GetMapping("/download/{applicationId}")
    public ResponseEntity<CertificateResponse> downloadCertificate(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                certificateService.downloadCertificate(applicationId));
    }
}