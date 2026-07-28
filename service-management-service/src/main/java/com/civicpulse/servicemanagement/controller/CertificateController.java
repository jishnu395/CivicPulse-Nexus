package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.CertificateResponse;
import com.civicpulse.servicemanagement.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    @GetMapping("/{applicationId}")
    public ResponseEntity<CertificateResponse> getCertificate(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                certificateService.getCertificate(applicationId));
    }

    @GetMapping("/download/{applicationId}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long applicationId) {

        byte[] pdf = certificateService.downloadCertificatePdf(applicationId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}