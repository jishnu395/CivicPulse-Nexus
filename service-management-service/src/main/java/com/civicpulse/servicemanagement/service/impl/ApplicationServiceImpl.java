package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.client.CitizenServiceClient;
import com.civicpulse.servicemanagement.dto.ApplicationResponse;
import com.civicpulse.servicemanagement.dto.ApplyCertificateRequest;
import com.civicpulse.servicemanagement.dto.PermitApplicationRequest;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.enums.CertificateType;
import com.civicpulse.servicemanagement.enums.DepartmentType;
import com.civicpulse.servicemanagement.enums.PermitType;
import com.civicpulse.servicemanagement.exception.BadRequestException;
import com.civicpulse.servicemanagement.exception.ResourceNotFoundException;
import com.civicpulse.servicemanagement.mapper.ApplicationMapper;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.service.ApplicationService;
import com.civicpulse.servicemanagement.util.ApplicationNumberGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final CitizenServiceClient citizenServiceClient;

    @Override
    public ApplicationResponse applyCertificate(ApplyCertificateRequest request) {

        try {
            Map<String, Object> citizen = citizenServiceClient.getCitizenById(request.getCitizenId());
            if (citizen == null) {
                throw new BadRequestException("Citizen not found with ID: " + request.getCitizenId());
            }
        } catch (Exception e) {
            log.warn("Citizen validation check bypassed or failed: {}", e.getMessage());
        }

        double fee = getCertificateFee(request.getCertificateType());

        Application application = Application.builder()
                .applicationNo(ApplicationNumberGenerator.generate())
                .citizenId(request.getCitizenId())
                .certificateType(request.getCertificateType())
                .department(getCertificateDepartment(request.getCertificateType()))
                .status(ApplicationStatus.SUBMITTED)
                .feeAmount(fee)
                .paymentStatus("PAID")
                .submissionDate(LocalDateTime.now())
                .build();

        Application savedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(savedApplication);
    }

    @Override
    public ApplicationResponse applyPermit(PermitApplicationRequest request) {

        try {
            Map<String, Object> citizen = citizenServiceClient.getCitizenById(request.getCitizenId());
            if (citizen == null) {
                throw new BadRequestException("Citizen not found with ID: " + request.getCitizenId());
            }
        } catch (Exception e) {
            log.warn("Citizen validation check bypassed or failed: {}", e.getMessage());
        }

        double fee = getPermitFee(request.getPermitType());

        Application application = Application.builder()
                .applicationNo(ApplicationNumberGenerator.generate())
                .citizenId(request.getCitizenId())
                .permitType(request.getPermitType())
                .department(getPermitDepartment(request.getPermitType()))
                .status(ApplicationStatus.SUBMITTED)
                .feeAmount(fee)
                .paymentStatus("PAID")
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
                        new ResourceNotFoundException(
                                "Application not found with id : " + applicationId));

        return applicationMapper.toResponse(application);
    }

    private DepartmentType getCertificateDepartment(CertificateType certificateType) {

        return switch (certificateType) {

            case BIRTH_CERTIFICATE,
                 DEATH_CERTIFICATE,
                 MARRIAGE_CERTIFICATE -> DepartmentType.MUNICIPALITY;

            case INCOME_CERTIFICATE -> DepartmentType.REVENUE;

            case RESIDENCE_CERTIFICATE -> DepartmentType.HOUSING;
        };
    }

    private DepartmentType getPermitDepartment(PermitType permitType) {

        return switch (permitType) {

            case TRADE_LICENSE,
                 SHOP_LICENSE -> DepartmentType.MUNICIPALITY;

            case BUILDING_PERMIT -> DepartmentType.HOUSING;

            case WATER_CONNECTION_PERMIT -> DepartmentType.WATER;
        };
    }

    private double getCertificateFee(CertificateType certificateType) {
        if (certificateType == null) return 20.0;
        return switch (certificateType) {
            case BIRTH_CERTIFICATE -> 20.0;
            case DEATH_CERTIFICATE -> 15.0;
            case INCOME_CERTIFICATE -> 25.0;
            case RESIDENCE_CERTIFICATE -> 15.0;
            case MARRIAGE_CERTIFICATE -> 30.0;
        };
    }

    private double getPermitFee(PermitType permitType) {
        if (permitType == null) return 100.0;
        return switch (permitType) {
            case TRADE_LICENSE -> 150.0;
            case SHOP_LICENSE -> 100.0;
            case BUILDING_PERMIT -> 500.0;
            case WATER_CONNECTION_PERMIT -> 75.0;
        };
    }
}