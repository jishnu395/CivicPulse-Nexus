package com.civicpulse.grievance.service.interfaces;

import com.civicpulse.grievance.dto.GrievanceHistoryResponse;
import com.civicpulse.grievance.enums.GrievanceStatus;

import java.util.List;

public interface GrievanceHistoryService {

    void saveHistory(Long grievanceId,
                     GrievanceStatus status,
                     String remarks);

    List<GrievanceHistoryResponse> getHistoryByGrievanceId(Long grievanceId);
}