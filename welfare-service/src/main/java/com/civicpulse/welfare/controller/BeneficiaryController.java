package com.civicpulse.welfare.controller;

import com.civicpulse.welfare.dto.response.BeneficiaryResponse;
import com.civicpulse.welfare.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/welfare/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping("/register/{applicationId}")
    @ResponseStatus(HttpStatus.CREATED)
    public BeneficiaryResponse register(@PathVariable Long applicationId) {

        return beneficiaryService.register(applicationId);
    }

    @GetMapping
    public List<BeneficiaryResponse> getAll() {

        return beneficiaryService.getAll();
    }

    @GetMapping("/citizen/{citizenId}")
    public List<BeneficiaryResponse> getByCitizen(
            @PathVariable Long citizenId) {

        return beneficiaryService.getByCitizen(citizenId);
    }

    @GetMapping("/scheme/{schemeId}")
    public List<BeneficiaryResponse> getByScheme(
            @PathVariable Long schemeId) {

        return beneficiaryService.getByScheme(schemeId);
    }
}