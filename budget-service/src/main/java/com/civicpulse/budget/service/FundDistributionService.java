package com.civicpulse.budget.service;

import com.civicpulse.budget.dto.request.CreateFundDistributionRequest;
import com.civicpulse.budget.dto.response.FundDistributionResponse;
import com.civicpulse.budget.enums.PaymentStatus;

import java.util.List;

public interface FundDistributionService {

    FundDistributionResponse distribute(CreateFundDistributionRequest request);

    List<FundDistributionResponse> getAll();

    FundDistributionResponse getById(Long id);

    List<FundDistributionResponse> getByCitizen(Long citizenId);

    List<FundDistributionResponse> getByBeneficiary(Long beneficiaryId);

    List<FundDistributionResponse> getByStatus(PaymentStatus status);

    FundDistributionResponse complete(Long id);

    FundDistributionResponse fail(Long id);

}