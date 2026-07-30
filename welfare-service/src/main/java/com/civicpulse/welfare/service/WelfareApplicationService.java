package com.civicpulse.welfare.service;

import com.civicpulse.welfare.dto.request.ApplySchemeRequest;
import com.civicpulse.welfare.dto.response.WelfareApplicationResponse;

import java.util.List;

public interface WelfareApplicationService {

    WelfareApplicationResponse applyScheme(
            ApplySchemeRequest request);

    List<WelfareApplicationResponse> getMyApplications(
            Long citizenId);

    List<WelfareApplicationResponse> getPendingApplications();

    WelfareApplicationResponse approveApplication(
            Long applicationId);

    WelfareApplicationResponse rejectApplication(
            Long applicationId,
            String remarks);
}