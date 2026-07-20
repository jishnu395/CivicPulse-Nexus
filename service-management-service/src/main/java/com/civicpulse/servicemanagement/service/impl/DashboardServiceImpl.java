package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.DashboardResponse;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ApplicationRepository applicationRepository;

    @Override
    public DashboardResponse getDashboard() {

        return DashboardResponse.builder()
                .totalApplications(applicationRepository.count())
                .submitted(applicationRepository.findByStatus(ApplicationStatus.SUBMITTED).size())
                .underVerification(applicationRepository.findByStatus(ApplicationStatus.UNDER_VERIFICATION).size())
                .verified(applicationRepository.findByStatus(ApplicationStatus.VERIFIED).size())
                .approved(applicationRepository.findByStatus(ApplicationStatus.APPROVED).size())
                .rejected(applicationRepository.findByStatus(ApplicationStatus.REJECTED).size())
                .certificatesGenerated(applicationRepository.findByStatus(ApplicationStatus.CERTIFICATE_GENERATED).size())
                .build();
    }
}