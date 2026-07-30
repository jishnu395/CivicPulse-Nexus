package com.civicpulse.welfare.mapper;

import com.civicpulse.welfare.dto.request.CreateSchemeRequest;
import com.civicpulse.welfare.dto.response.SchemeResponse;
import com.civicpulse.welfare.entity.WelfareScheme;
import org.springframework.stereotype.Component;

@Component
public class WelfareSchemeMapper {

    public WelfareScheme toEntity(CreateSchemeRequest request) {

        return WelfareScheme.builder()
                .schemeName(request.getSchemeName())
                .description(request.getDescription())
                .department(request.getDepartment())
                .eligibilityCriteria(request.getEligibilityCriteria())
                .benefitAmount(request.getBenefitAmount())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
    }

    public SchemeResponse toResponse(WelfareScheme scheme) {

        return SchemeResponse.builder()
                .id(scheme.getId())
                .schemeName(scheme.getSchemeName())
                .description(scheme.getDescription())
                .department(scheme.getDepartment())
                .eligibilityCriteria(scheme.getEligibilityCriteria())
                .benefitAmount(scheme.getBenefitAmount())
                .status(scheme.getStatus())
                .startDate(scheme.getStartDate())
                .endDate(scheme.getEndDate())
                .build();
    }
}