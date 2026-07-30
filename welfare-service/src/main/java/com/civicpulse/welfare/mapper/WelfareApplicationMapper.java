package com.civicpulse.welfare.mapper;

import com.civicpulse.welfare.dto.response.WelfareApplicationResponse;
import com.civicpulse.welfare.entity.WelfareApplication;
import org.springframework.stereotype.Component;

@Component
public class WelfareApplicationMapper {

    public WelfareApplicationResponse toResponse(
            WelfareApplication application) {

        return WelfareApplicationResponse.builder()
                .id(application.getId())
                .citizenId(application.getCitizenId())
                .schemeId(application.getWelfareScheme().getId())
                .schemeName(application.getWelfareScheme().getSchemeName())
                .status(application.getStatus())
                .applicationDate(application.getApplicationDate())
                .remarks(application.getRemarks())
                .build();
    }
}