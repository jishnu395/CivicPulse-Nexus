package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.PermitApplicationRequest;

import java.util.List;

public interface PermitService {

    ApplicationResponse applyPermit(PermitApplicationRequest request);

    List<ApplicationResponse> getMyPermits(Long citizenId);

    List<ApplicationResponse> getPendingPermits();

    ApplicationResponse approvePermit(Long applicationId);

    ApplicationResponse rejectPermit(Long applicationId);

    ApplicationResponse getPermit(Long applicationId);
}