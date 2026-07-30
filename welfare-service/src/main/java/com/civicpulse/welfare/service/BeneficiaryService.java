package com.civicpulse.welfare.service;

import com.civicpulse.welfare.dto.response.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {

    BeneficiaryResponse register(Long applicationId);

    List<BeneficiaryResponse> getAll();

    List<BeneficiaryResponse> getByCitizen(Long citizenId);

    List<BeneficiaryResponse> getByScheme(Long schemeId);
}