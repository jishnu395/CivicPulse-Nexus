package com.civicpulse.budget.mapper;

import com.civicpulse.budget.dto.response.FundDistributionResponse;
import com.civicpulse.budget.entity.FundDistribution;
import org.springframework.stereotype.Component;

@Component
public class FundDistributionMapper {

    public FundDistributionResponse toResponse(FundDistribution fund) {

        return FundDistributionResponse.builder()
                .id(fund.getId())
                .beneficiaryId(fund.getBeneficiaryId())
                .citizenId(fund.getCitizenId())
                .schemeId(fund.getSchemeId())
                .schemeName(fund.getSchemeName())
                .budgetId(fund.getBudgetId())
                .amount(fund.getAmount())
                .transactionId(fund.getTransactionId())
                .paymentStatus(fund.getPaymentStatus())
                .distributedAt(fund.getDistributedAt())
                .build();
    }
}