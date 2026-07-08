package com.civicpulse.grievance.dto;

import com.civicpulse.grievance.enums.GrievanceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GrievanceHistoryResponse {

    private Long id;

    private Long grievanceId;

    private GrievanceStatus status;

    private String remarks;

    private LocalDateTime updatedAt;
}