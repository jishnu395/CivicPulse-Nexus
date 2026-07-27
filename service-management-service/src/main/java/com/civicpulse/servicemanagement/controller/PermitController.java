package com.civicpulse.servicemanagement.controller;

import com.civicpulse.servicemanagement.dto.PermitResponse;
import com.civicpulse.servicemanagement.service.PermitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permit")
@RequiredArgsConstructor
public class PermitController {

    private final PermitService permitService;

    @PostMapping("/generate/{applicationId}")
    public ResponseEntity<PermitResponse> generatePermit(
            @PathVariable Long applicationId){

        return ResponseEntity.ok(
                permitService.generatePermit(applicationId));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<PermitResponse> getPermit(
            @PathVariable Long applicationId){

        return ResponseEntity.ok(
                permitService.getPermit(applicationId));
    }

    @GetMapping("/download/{applicationId}")
    public ResponseEntity<PermitResponse> downloadPermit(
            @PathVariable Long applicationId){

        return ResponseEntity.ok(
                permitService.downloadPermit(applicationId));
    }

}