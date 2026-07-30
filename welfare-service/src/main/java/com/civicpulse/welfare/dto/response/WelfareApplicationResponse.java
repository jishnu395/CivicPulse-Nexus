package com.civicpulse.welfare.dto.response;

import com.civicpulse.welfare.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class WelfareApplicationResponse {

    private Long id;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    private ApplicationStatus status;

    private LocalDateTime applicationDate;

    private String remarks;
}