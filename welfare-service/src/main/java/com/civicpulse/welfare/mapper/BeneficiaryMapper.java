package com.civicpulse.welfare.mapper;

import com.civicpulse.welfare.dto.response.BeneficiaryResponse;
import com.civicpulse.welfare.entity.Beneficiary;
import org.springframework.stereotype.Component;

@Component
public class BeneficiaryMapper {

    public BeneficiaryResponse toResponse(Beneficiary beneficiary) {

        return BeneficiaryResponse.builder()
                .id(beneficiary.getId())
                .citizenId(beneficiary.getCitizenId())
                .schemeId(beneficiary.getSchemeId())
                .schemeName(beneficiary.getSchemeName())
                .benefitAmount(beneficiary.getBenefitAmount())
                .enrollmentDate(beneficiary.getEnrollmentDate())
                .status(beneficiary.getStatus())
                .build();
    }
}