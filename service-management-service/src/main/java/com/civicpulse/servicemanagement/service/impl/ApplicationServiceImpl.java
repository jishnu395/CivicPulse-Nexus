package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApplyCertificateRequest;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.CertificateType;
import com.civicpulse.servicemanagement.enums.DepartmentType;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.mapper.ApplicationMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.service.ApplicationService;
import com.civicpulse.servicemanagement.util.ApplicationNumberGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;

    @Override
    public ApplicationResponse applyCertificate(ApplyCertificateRequest request) {

        Application application = Application.builder()
                .applicationNo(ApplicationNumberGenerator.generate())
                .citizenId(request.getCitizenId())
                .certificateType(request.getCertificateType())
                .department(getDepartment(request.getCertificateType()))
                .status(ApplicationStatus.SUBMITTED)
                .submissionDate(LocalDateTime.now())
                .build();

        Application savedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(savedApplication);
    }

    @Override
    public List<ApplicationResponse> getApplicationsByCitizen(Long citizenId) {

        return applicationRepository.findByCitizenId(citizenId)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    @Override
    public ApplicationResponse getApplication(Long applicationId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Application not found with id : " + applicationId));

        return applicationMapper.toResponse(application);
    }

    private DepartmentType getDepartment(CertificateType certificateType) {

        return switch (certificateType) {

            case BIRTH_CERTIFICATE,
                 DEATH_CERTIFICATE,
                 MARRIAGE_CERTIFICATE -> DepartmentType.MUNICIPALITY;

            case INCOME_CERTIFICATE -> DepartmentType.REVENUE;

            case RESIDENCE_CERTIFICATE -> DepartmentType.HOUSING;

            case WATER_CONNECTION_PERMIT -> DepartmentType.WATER;

            case BUILDING_PERMIT -> DepartmentType.HOUSING;

            case TRADE_LICENSE,
                 SHOP_LICENSE -> DepartmentType.MUNICIPALITY;
        };
    }
}