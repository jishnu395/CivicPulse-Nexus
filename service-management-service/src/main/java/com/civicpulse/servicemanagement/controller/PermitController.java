package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.PermitResponse;
import com.civicpulse.servicemanagement.service.PermitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permit")
@RequiredArgsConstructor
public class PermitController {

    private final PermitService permitService;

    @PostMapping("/generate/{applicationId}")
    public ResponseEntity<PermitResponse> generatePermit(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                permitService.generatePermit(applicationId));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<PermitResponse> getPermit(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                permitService.getPermit(applicationId));
    }

    @GetMapping("/download/{applicationId}")
    public ResponseEntity<byte[]> downloadPermit(
            @PathVariable Long applicationId) {

        byte[] pdf = permitService.downloadPermitPdf(applicationId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Permit.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}