package com.civicpulse.welfare.service.impl;

import com.civicpulse.welfare.dto.request.ApplySchemeRequest;
import com.civicpulse.welfare.exception.ResourceNotFoundException;
import com.civicpulse.welfare.repository.WelfareApplicationRepository;
import com.civicpulse.welfare.service.EligibilityVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EligibilityVerificationServiceImpl implements EligibilityVerificationService {

    private final WelfareApplicationRepository applicationRepository;

    @Override
    public void verifyEligibility(ApplySchemeRequest request) {

        if (request.getCitizenId() == null) {
            throw new ResourceNotFoundException("Citizen Id is required.");
        }

        if (request.getSchemeId() == null) {
            throw new ResourceNotFoundException("Scheme Id is required.");
        }

        boolean alreadyApplied =
                applicationRepository.existsByCitizenIdAndWelfareScheme_Id(
                        request.getCitizenId(),
                        request.getSchemeId());

        if (alreadyApplied) {
            throw new IllegalStateException(
                    "Citizen has already applied for this scheme.");
        }
    }
}