package com.civicpulse.welfare.service.impl;

import com.civicpulse.welfare.dto.response.BeneficiaryResponse;
import com.civicpulse.welfare.entity.Beneficiary;
import com.civicpulse.welfare.entity.WelfareApplication;
import com.civicpulse.welfare.entity.WelfareScheme;
import com.civicpulse.welfare.enums.ApplicationStatus;
import com.civicpulse.welfare.exception.ResourceNotFoundException;
import com.civicpulse.welfare.mapper.BeneficiaryMapper;
import com.civicpulse.welfare.repository.BeneficiaryRepository;
import com.civicpulse.welfare.repository.WelfareApplicationRepository;
import com.civicpulse.welfare.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    private final WelfareApplicationRepository applicationRepository;

    private final BeneficiaryMapper beneficiaryMapper;

    @Override
    public BeneficiaryResponse register(Long applicationId) {

        WelfareApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Application not found."));

        if (application.getStatus() != ApplicationStatus.APPROVED) {
            throw new RuntimeException("Application is not approved.");
        }

        WelfareScheme scheme = application.getWelfareScheme();

        if (scheme == null) {
            throw new ResourceNotFoundException("Scheme not found.");
        }

        Beneficiary beneficiary =
                Beneficiary.builder()
                        .citizenId(application.getCitizenId())
                        .schemeId(scheme.getId())
                        .schemeName(scheme.getSchemeName())
                        .benefitAmount(scheme.getBenefitAmount())
                        .enrollmentDate(LocalDate.now())
                        .status(ApplicationStatus.APPROVED)
                        .build();

        return beneficiaryMapper.toResponse(
                beneficiaryRepository.save(beneficiary)
        );
    }

    @Override
    public List<BeneficiaryResponse> getAll() {

        return beneficiaryRepository.findAll()
                .stream()
                .map(beneficiaryMapper::toResponse)
                .toList();
    }

    @Override
    public List<BeneficiaryResponse> getByCitizen(Long citizenId) {

        return beneficiaryRepository.findByCitizenId(citizenId)
                .stream()
                .map(beneficiaryMapper::toResponse)
                .toList();
    }

    @Override
    public List<BeneficiaryResponse> getByScheme(Long schemeId) {

        return beneficiaryRepository.findBySchemeId(schemeId)
                .stream()
                .map(beneficiaryMapper::toResponse)
                .toList();
    }
}