package com.civicpulse.welfare.service.impl;

import com.civicpulse.welfare.dto.request.ApplySchemeRequest;
import com.civicpulse.welfare.dto.response.WelfareApplicationResponse;
import com.civicpulse.welfare.entity.WelfareApplication;
import com.civicpulse.welfare.entity.WelfareScheme;
import com.civicpulse.welfare.enums.ApplicationStatus;
import com.civicpulse.welfare.exception.ResourceNotFoundException;
import com.civicpulse.welfare.mapper.WelfareApplicationMapper;
import com.civicpulse.welfare.repository.WelfareApplicationRepository;
import com.civicpulse.welfare.repository.WelfareSchemeRepository;
import com.civicpulse.welfare.service.WelfareApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WelfareApplicationServiceImpl implements WelfareApplicationService {

    private final WelfareApplicationRepository applicationRepository;
    private final WelfareSchemeRepository schemeRepository;
    private final WelfareApplicationMapper mapper;

    @Override
    public WelfareApplicationResponse applyScheme(
            ApplySchemeRequest request) {

        WelfareScheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Scheme not found"));

        WelfareApplication application = WelfareApplication.builder()
                .citizenId(request.getCitizenId())
                .welfareScheme(scheme)
                .status(ApplicationStatus.SUBMITTED)
                .applicationDate(LocalDateTime.now())
                .build();

        return mapper.toResponse(
                applicationRepository.save(application));
    }

    @Override
    public List<WelfareApplicationResponse> getMyApplications(
            Long citizenId) {

        return applicationRepository.findByCitizenId(citizenId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<WelfareApplicationResponse> getPendingApplications() {

        return applicationRepository
                .findByStatus(ApplicationStatus.SUBMITTED)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public WelfareApplicationResponse approveApplication(
            Long applicationId) {

        WelfareApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"));

        application.setStatus(ApplicationStatus.APPROVED);

        return mapper.toResponse(
                applicationRepository.save(application));
    }

    @Override
    public WelfareApplicationResponse rejectApplication(
            Long applicationId,
            String remarks) {

        WelfareApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"));

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRemarks(remarks);

        return mapper.toResponse(
                applicationRepository.save(application));
    }
}