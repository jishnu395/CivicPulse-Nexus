package com.civicpulse.servicemanagement.service.impl;

import com.civicpulse.servicemanagement.dto.DashboardResponse;
import com.civicpulse.servicemanagement.entity.Application;
import com.civicpulse.servicemanagement.enums.ApplicationStatus;
import com.civicpulse.servicemanagement.repository.ApplicationRepository;
import com.civicpulse.servicemanagement.repository.CertificateRepository;
import com.civicpulse.servicemanagement.repository.DownloadLogRepository;
import com.civicpulse.servicemanagement.repository.PermitRepository;
import com.civicpulse.servicemanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ApplicationRepository applicationRepository;
    private final CertificateRepository certificateRepository;
    private final PermitRepository permitRepository;
    private final DownloadLogRepository downloadLogRepository;

    @Override
    public DashboardResponse getDashboard() {

        List<Application> all = applicationRepository.findAll();

        long submitted = all.stream().filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED).count();
        long underVerification = all.stream().filter(a -> a.getStatus() == ApplicationStatus.UNDER_VERIFICATION).count();
        long verified = all.stream().filter(a -> a.getStatus() == ApplicationStatus.VERIFIED).count();
        long approved = all.stream().filter(a -> a.getStatus() == ApplicationStatus.APPROVED).count();
        long rejected = all.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();
        long certs = certificateRepository.count();
        long permits = permitRepository.count();
        long downloads = downloadLogRepository.count();

        double totalRevenue = all.stream()
                .filter(a -> a.getFeeAmount() != null)
                .mapToDouble(Application::getFeeAmount)
                .sum();

        Map<String, Long> byDept = all.stream()
                .filter(a -> a.getDepartment() != null)
                .collect(Collectors.groupingBy(a -> a.getDepartment().name(), Collectors.counting()));

        Map<String, Double> revByDept = all.stream()
                .filter(a -> a.getDepartment() != null && a.getFeeAmount() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getDepartment().name(),
                        Collectors.summingDouble(Application::getFeeAmount)
                ));

        return DashboardResponse.builder()
                .totalApplications(all.size())
                .submitted(submitted)
                .underVerification(underVerification)
                .verified(verified)
                .approved(approved)
                .rejected(rejected)
                .certificatesGenerated(certs)
                .permitsGenerated(permits)
                .totalRevenue(totalRevenue)
                .totalDownloads(downloads)
                .applicationsByDepartment(byDept)
                .revenueByDepartment(revByDept)
                .build();
    }
}