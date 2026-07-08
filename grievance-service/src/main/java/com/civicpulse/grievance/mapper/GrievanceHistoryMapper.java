package com.civicpulse.grievance.mapper;

import com.civicpulse.grievance.dto.GrievanceHistoryResponse;
import com.civicpulse.grievance.entity.GrievanceHistory;
import org.springframework.stereotype.Component;

@Component
public class GrievanceHistoryMapper {

    public GrievanceHistoryResponse toResponse(GrievanceHistory history) {

        return GrievanceHistoryResponse.builder()
                .id(history.getId())
                .grievanceId(history.getGrievanceId())
                .status(history.getStatus())
                .remarks(history.getRemarks())
                .updatedAt(history.getUpdatedAt())
                .build();
    }
}