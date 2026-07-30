package com.civicpulse.welfare.controller;

import com.civicpulse.welfare.dto.request.ApplySchemeRequest;
import com.civicpulse.welfare.dto.response.WelfareApplicationResponse;
import com.civicpulse.welfare.service.WelfareApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/welfare/applications")
@RequiredArgsConstructor
public class WelfareApplicationController {

    private final WelfareApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<WelfareApplicationResponse> applyScheme(
            @Valid @RequestBody ApplySchemeRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyScheme(request));
    }

    @GetMapping("/my/{citizenId}")
    public ResponseEntity<List<WelfareApplicationResponse>>
    getMyApplications(@PathVariable Long citizenId) {

        return ResponseEntity.ok(
                applicationService.getMyApplications(citizenId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<WelfareApplicationResponse>>
    getPendingApplications() {

        return ResponseEntity.ok(
                applicationService.getPendingApplications());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<WelfareApplicationResponse>
    approve(@PathVariable Long id) {

        return ResponseEntity.ok(
                applicationService.approveApplication(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<WelfareApplicationResponse>
    reject(@PathVariable Long id,
           @RequestParam String remarks) {

        return ResponseEntity.ok(
                applicationService.rejectApplication(id, remarks));
    }
}