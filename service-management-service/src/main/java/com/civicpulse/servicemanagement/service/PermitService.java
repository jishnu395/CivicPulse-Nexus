package com.civicpulse.servicemanagement.service;

import com.civicpulse.servicemanagement.dto.PermitResponse;

public interface PermitService {

    PermitResponse generatePermit(Long applicationId);

    PermitResponse getPermit(Long applicationId);

    PermitResponse downloadPermit(Long applicationId);

    byte[] downloadPermitPdf(Long applicationId);

}