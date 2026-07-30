package com.civicpulse.welfare.service;

import com.civicpulse.welfare.dto.request.CreateSchemeRequest;
import com.civicpulse.welfare.dto.response.SchemeResponse;
import com.civicpulse.welfare.enums.SchemeStatus;

import java.util.List;

public interface WelfareSchemeService {

    SchemeResponse createScheme(CreateSchemeRequest request);

    List<SchemeResponse> getAllSchemes();

    SchemeResponse getScheme(Long id);

    SchemeResponse updateScheme(Long id,
                                CreateSchemeRequest request);

    void deleteScheme(Long id);

    List<SchemeResponse> getSchemesByStatus(
            SchemeStatus status);
}