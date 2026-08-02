package com.civicpulse.budget.controller;

import com.civicpulse.budget.dto.request.CreateFundDistributionRequest;
import com.civicpulse.budget.dto.response.FundDistributionResponse;
import com.civicpulse.budget.enums.PaymentStatus;
import com.civicpulse.budget.service.FundDistributionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fund-distributions")
@RequiredArgsConstructor
public class FundDistributionController {

    private final FundDistributionService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FundDistributionResponse distribute(
            @Valid @RequestBody CreateFundDistributionRequest request) {

        return service.distribute(request);
    }

    @GetMapping
    public List<FundDistributionResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public FundDistributionResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<FundDistributionResponse> getByCitizen(
            @PathVariable Long citizenId) {

        return service.getByCitizen(citizenId);
    }

    @GetMapping("/beneficiary/{beneficiaryId}")
    public List<FundDistributionResponse> getByBeneficiary(
            @PathVariable Long beneficiaryId) {

        return service.getByBeneficiary(beneficiaryId);
    }

    @GetMapping("/status/{status}")
    public List<FundDistributionResponse> getByStatus(
            @PathVariable PaymentStatus status) {

        return service.getByStatus(status);
    }

    @PutMapping("/{id}/complete")
    public FundDistributionResponse complete(@PathVariable Long id) {
        return service.complete(id);
    }

    @PutMapping("/{id}/fail")
    public FundDistributionResponse fail(@PathVariable Long id) {
        return service.fail(id);
    }
}