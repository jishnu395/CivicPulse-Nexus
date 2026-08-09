package com.civicpulse.welfare.service.impl;

import com.civicpulse.welfare.client.CitizenServiceClient;
import com.civicpulse.welfare.dto.request.ApplySchemeRequest;
import com.civicpulse.welfare.entity.WelfareScheme;
import com.civicpulse.welfare.enums.SchemeStatus;
import com.civicpulse.welfare.exception.ResourceNotFoundException;
import com.civicpulse.welfare.repository.WelfareApplicationRepository;
import com.civicpulse.welfare.repository.WelfareSchemeRepository;
import com.civicpulse.welfare.service.EligibilityVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EligibilityVerificationServiceImpl implements EligibilityVerificationService {

    private final WelfareApplicationRepository applicationRepository;
    private final WelfareSchemeRepository schemeRepository;
    private final CitizenServiceClient citizenServiceClient;

    @Override
    public void verifyEligibility(ApplySchemeRequest request) {

        if (request.getCitizenId() == null) {
            throw new ResourceNotFoundException("Citizen Id is required.");
        }

        if (request.getSchemeId() == null) {
            throw new ResourceNotFoundException("Scheme Id is required.");
        }

        WelfareScheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new ResourceNotFoundException("Welfare scheme not found with ID: " + request.getSchemeId()));

        if (scheme.getStatus() != SchemeStatus.ACTIVE) {
            throw new IllegalStateException("Scheme " + scheme.getSchemeName() + " is currently inactive.");
        }

        LocalDate now = LocalDate.now();
        if (scheme.getEndDate() != null && scheme.getEndDate().isBefore(now)) {
            throw new IllegalStateException("Scheme application window has closed on " + scheme.getEndDate());
        }

        boolean alreadyApplied =
                applicationRepository.existsByCitizenIdAndWelfareScheme_Id(
                        request.getCitizenId(),
                        request.getSchemeId());

        if (alreadyApplied) {
            throw new IllegalStateException(
                    "Citizen has already submitted an application for scheme: " + scheme.getSchemeName());
        }

        // Inter-service verification with Citizen Service
        int calculatedAge = 30; // default assumption if not resolvable
        String calculatedWard = request.getWard();

        try {
            Map<String, Object> citizen = citizenServiceClient.getCitizenById(request.getCitizenId());
            if (citizen != null) {
                if (citizen.get("dateOfBirth") != null) {
                    LocalDate dob = LocalDate.parse(citizen.get("dateOfBirth").toString());
                    calculatedAge = Period.between(dob, now).getYears();
                } else if (request.getAge() != null) {
                    calculatedAge = request.getAge();
                }

                if (citizen.get("wardNumber") != null) {
                    calculatedWard = citizen.get("wardNumber").toString();
                }
            }
        } catch (Exception e) {
            log.warn("Could not fetch citizen profile from CitizenServiceClient: {}", e.getMessage());
            if (request.getAge() != null) {
                calculatedAge = request.getAge();
            }
        }

        final int citizenAge = calculatedAge;
        final String citizenWard = calculatedWard;

        // 1. Age criteria evaluation
        if (scheme.getMinAge() != null && citizenAge < scheme.getMinAge()) {
            throw new IllegalStateException(
                    "Citizen age (" + citizenAge + " years) does not meet minimum scheme requirement of " + scheme.getMinAge() + " years.");
        }
        if (scheme.getMaxAge() != null && citizenAge > scheme.getMaxAge()) {
            throw new IllegalStateException(
                    "Citizen age (" + citizenAge + " years) exceeds maximum scheme limit of " + scheme.getMaxAge() + " years.");
        }

        // 2. Annual income evaluation
        if (request.getAnnualIncome() != null && scheme.getMaxAnnualIncome() != null) {
            if (request.getAnnualIncome() > scheme.getMaxAnnualIncome()) {
                throw new IllegalStateException(
                        "Declared annual income ($" + request.getAnnualIncome() + ") exceeds maximum scheme eligibility limit of $" + scheme.getMaxAnnualIncome());
            }
        }

        // 3. Ward eligibility evaluation
        if (scheme.getEligibleWards() != null && !scheme.getEligibleWards().equalsIgnoreCase("ALL") && citizenWard != null) {
            boolean wardMatch = Arrays.stream(scheme.getEligibleWards().split(","))
                    .map(String::trim)
                    .anyMatch(w -> w.equalsIgnoreCase(citizenWard.trim()));
            if (!wardMatch) {
                throw new IllegalStateException(
                        "Citizen ward (" + citizenWard + ") is not eligible for this targeted scheme (Eligible wards: " + scheme.getEligibleWards() + ").");
            }
        }

        log.info("Eligibility verified successfully for citizenId={} and schemeId={}", request.getCitizenId(), request.getSchemeId());
    }
}