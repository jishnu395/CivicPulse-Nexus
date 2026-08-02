package com.civicpulse.welfare.service;

import com.civicpulse.welfare.dto.request.ApplySchemeRequest;

public interface EligibilityVerificationService {

    void verifyEligibility(ApplySchemeRequest request);

}