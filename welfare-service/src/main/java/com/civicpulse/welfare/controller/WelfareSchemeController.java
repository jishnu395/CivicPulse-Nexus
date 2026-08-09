package com.civicpulse.welfare.controller;

import com.civicpulse.welfare.dto.request.CreateSchemeRequest;
import com.civicpulse.welfare.dto.response.SchemeResponse;
import com.civicpulse.welfare.dto.response.WelfareStatsResponse;
import com.civicpulse.welfare.entity.Beneficiary;
import com.civicpulse.welfare.entity.WelfareScheme;
import com.civicpulse.welfare.enums.ApplicationStatus;
import com.civicpulse.welfare.enums.SchemeStatus;
import com.civicpulse.welfare.repository.BeneficiaryRepository;
import com.civicpulse.welfare.repository.WelfareApplicationRepository;
import com.civicpulse.welfare.repository.WelfareSchemeRepository;
import com.civicpulse.welfare.service.WelfareSchemeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/welfare/schemes")
@RequiredArgsConstructor
public class WelfareSchemeController {

    private final WelfareSchemeService welfareSchemeService;
    private final WelfareSchemeRepository schemeRepository;
    private final WelfareApplicationRepository applicationRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    @PostMapping
    public ResponseEntity<SchemeResponse> createScheme(
            @Valid @RequestBody CreateSchemeRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(welfareSchemeService.createScheme(request));
    }

    @GetMapping
    public ResponseEntity<List<SchemeResponse>> getAllSchemes() {

        return ResponseEntity.ok(
                welfareSchemeService.getAllSchemes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponse> getScheme(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                welfareSchemeService.getScheme(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchemeResponse> updateScheme(
            @PathVariable Long id,
            @Valid @RequestBody CreateSchemeRequest request) {

        return ResponseEntity.ok(
                welfareSchemeService.updateScheme(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheme(
            @PathVariable Long id) {

        welfareSchemeService.deleteScheme(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SchemeResponse>> getSchemesByStatus(
            @PathVariable SchemeStatus status) {

        return ResponseEntity.ok(
                welfareSchemeService.getSchemesByStatus(status));
    }

    @GetMapping("/stats")
    public ResponseEntity<WelfareStatsResponse> getStats() {

        List<WelfareScheme> schemes = schemeRepository.findAll();
        long totalSchemes = schemes.size();
        long activeSchemes = schemes.stream().filter(s -> s.getStatus() == SchemeStatus.ACTIVE).count();

        long totalApps = applicationRepository.count();
        long pendingApps = applicationRepository.findByStatus(ApplicationStatus.SUBMITTED).size();
        long approvedApps = applicationRepository.findByStatus(ApplicationStatus.APPROVED).size();
        long rejectedApps = applicationRepository.findByStatus(ApplicationStatus.REJECTED).size();

        List<Beneficiary> beneficiaries = beneficiaryRepository.findAll();
        long totalBeneficiaries = beneficiaries.size();
        double totalDisbursed = beneficiaries.stream()
                .filter(b -> b.getBenefitAmount() != null)
                .mapToDouble(Beneficiary::getBenefitAmount)
                .sum();

        Map<String, Long> byDept = schemes.stream()
                .filter(s -> s.getDepartment() != null)
                .collect(Collectors.groupingBy(WelfareScheme::getDepartment, Collectors.counting()));

        return ResponseEntity.ok(
                WelfareStatsResponse.builder()
                        .totalSchemes(totalSchemes)
                        .activeSchemes(activeSchemes)
                        .totalApplications(totalApps)
                        .pendingApplications(pendingApps)
                        .approvedApplications(approvedApps)
                        .rejectedApplications(rejectedApps)
                        .totalBeneficiaries(totalBeneficiaries)
                        .totalDisbursedBenefitAmount(totalDisbursed)
                        .schemesByDepartment(byDept)
                        .build()
        );
    }
}