package com.civicpulse.reporting.service.impl;

import com.civicpulse.reporting.client.*;
import com.civicpulse.reporting.dto.client.*;
import com.civicpulse.reporting.dto.report.*;
import com.civicpulse.reporting.service.ReportingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportingServiceImpl implements ReportingService {

    private final CitizenClient citizenClient;
    private final GrievanceClient grievanceClient;
    private final ServiceManagementClient serviceManagementClient;
    private final WelfareClient welfareClient;
    private final BudgetClient budgetClient;

    @Override
    public DashboardDTO getDashboard() {

        CitizenStatsDTO citizenStats = safeGetCitizenStats();
        GrievanceStatsDTO grievanceStats = safeGetGrievanceStats();
        ServiceStatsDTO serviceStats = safeGetServiceStats();
        WelfareStatsDTO welfareStats = safeGetWelfareStats();
        BudgetStatsDTO budgetStats = safeGetBudgetStats();

        long totalActiveGrievances = grievanceStats.getSubmitted()
                + grievanceStats.getAssigned()
                + grievanceStats.getInProgress()
                + grievanceStats.getPending()
                + grievanceStats.getEscalated();

        return DashboardDTO.builder()
                .totalCitizens(citizenStats.getTotalCitizens())
                .activeCitizens(citizenStats.getActiveCitizens())
                .slaComplianceRate(grievanceStats.getSlaComplianceRate())
                .grievanceResolutionRate(grievanceStats.getResolutionRate())
                .averageCitizenSatisfaction(grievanceStats.getAverageSatisfactionRating())
                .totalRevenueCollected(serviceStats.getTotalRevenue())
                .totalBudgetAllocated(budgetStats.getTotalAllocatedBudget())
                .totalBudgetUtilized(budgetStats.getTotalUtilizedBudget())
                .budgetUtilizationPercentage(budgetStats.getUtilizationPercentage())
                .totalActiveBeneficiaries(welfareStats.getTotalBeneficiaries())
                .totalWelfareDisbursed(welfareStats.getTotalDisbursedBenefitAmount())
                .totalCertificatesIssued(serviceStats.getCertificatesGenerated())
                .totalPermitsIssued(serviceStats.getPermitsGenerated())
                .totalActiveGrievances(totalActiveGrievances)
                .generatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public CitizenReportDTO getCitizenReport() {
        CitizenStatsDTO stats = safeGetCitizenStats();

        return CitizenReportDTO.builder()
                .totalCitizens(stats.getTotalCitizens())
                .activeCitizens(stats.getActiveCitizens())
                .inactiveCitizens(stats.getInactiveCitizens())
                .wardDistribution(stats.getWardDistribution() != null ? stats.getWardDistribution() : Map.of())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public GrievanceReportDTO getGrievanceReport() {
        GrievanceStatsDTO stats = safeGetGrievanceStats();

        return GrievanceReportDTO.builder()
                .totalGrievances(stats.getTotalGrievances())
                .submitted(stats.getSubmitted())
                .assigned(stats.getAssigned())
                .inProgress(stats.getInProgress())
                .pending(stats.getPending())
                .resolved(stats.getResolved())
                .closed(stats.getClosed())
                .escalated(stats.getEscalated())
                .overdue(stats.getOverdue())
                .resolutionRate(stats.getResolutionRate())
                .slaComplianceRate(stats.getSlaComplianceRate())
                .averageSatisfactionRating(stats.getAverageSatisfactionRating())
                .totalFeedbackCount(stats.getTotalFeedbackCount())
                .categoryBreakdown(stats.getCategoryDistribution() != null ? stats.getCategoryDistribution() : Map.of())
                .priorityBreakdown(stats.getPriorityDistribution() != null ? stats.getPriorityDistribution() : Map.of())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public RevenueReportDTO getRevenueReport() {
        ServiceStatsDTO stats = safeGetServiceStats();

        return RevenueReportDTO.builder()
                .totalRevenue(stats.getTotalRevenue())
                .totalTransactions(stats.getTotalApplications())
                .certificatesIssued(stats.getCertificatesGenerated())
                .permitsIssued(stats.getPermitsGenerated())
                .applicationsByDepartment(stats.getApplicationsByDepartment() != null ? stats.getApplicationsByDepartment() : Map.of())
                .revenueByDepartment(stats.getRevenueByDepartment() != null ? stats.getRevenueByDepartment() : Map.of())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public BudgetReportDTO getBudgetReport() {
        BudgetStatsDTO stats = safeGetBudgetStats();

        return BudgetReportDTO.builder()
                .totalAllocated(stats.getTotalAllocatedBudget())
                .totalUtilized(stats.getTotalUtilizedBudget())
                .totalRemaining(stats.getTotalRemainingBudget())
                .utilizationPercentage(stats.getUtilizationPercentage())
                .totalDistributedWelfare(stats.getTotalDistributedFunds())
                .completedPaymentsCount(stats.getCompletedPayments())
                .pendingPaymentsCount(stats.getPendingPayments())
                .failedPaymentsCount(stats.getFailedPayments())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public PerformanceReportDTO getPerformanceReport() {
        GrievanceStatsDTO grievanceStats = safeGetGrievanceStats();
        ServiceStatsDTO serviceStats = safeGetServiceStats();
        BudgetStatsDTO budgetStats = safeGetBudgetStats();

        List<DepartmentPerformanceDTO> scorecards = new ArrayList<>();

        Map<String, Long> appByDept = serviceStats.getApplicationsByDepartment() != null ? serviceStats.getApplicationsByDepartment() : Map.of();
        Map<String, Double> revByDept = serviceStats.getRevenueByDepartment() != null ? serviceStats.getRevenueByDepartment() : Map.of();

        for (Map.Entry<String, Long> entry : appByDept.entrySet()) {
            String dept = entry.getKey();
            long count = entry.getValue();
            double rev = revByDept.getOrDefault(dept, 0.0);

            double deptScore = Math.min(100.0, 70.0 + (count * 2.0));

            scorecards.add(DepartmentPerformanceDTO.builder()
                    .departmentName(dept)
                    .totalTasks(count)
                    .resolutionRate(grievanceStats.getResolutionRate())
                    .slaComplianceRate(grievanceStats.getSlaComplianceRate())
                    .revenueCollected(rev)
                    .performanceScore(deptScore)
                    .build());
        }

        if (scorecards.isEmpty()) {
            scorecards.add(DepartmentPerformanceDTO.builder()
                    .departmentName("MUNICIPALITY")
                    .totalTasks(1)
                    .resolutionRate(grievanceStats.getResolutionRate())
                    .slaComplianceRate(grievanceStats.getSlaComplianceRate())
                    .revenueCollected(serviceStats.getTotalRevenue())
                    .performanceScore(88.5)
                    .build());
        }

        return PerformanceReportDTO.builder()
                .overallSlaScore(grievanceStats.getSlaComplianceRate())
                .overallCitizenSatisfaction(grievanceStats.getAverageSatisfactionRating())
                .overallGrievanceResolutionRate(grievanceStats.getResolutionRate())
                .overallBudgetEfficiency(budgetStats.getUtilizationPercentage())
                .departmentScorecards(scorecards)
                .generatedAt(LocalDateTime.now())
                .build();
    }

    private CitizenStatsDTO safeGetCitizenStats() {
        try {
            CitizenStatsDTO stats = citizenClient.getCitizenStats();
            if (stats != null) return stats;
        } catch (Exception e) {
            log.warn("Failed to fetch citizen stats: {}", e.getMessage());
        }
        return CitizenStatsDTO.builder()
                .totalCitizens(0)
                .activeCitizens(0)
                .inactiveCitizens(0)
                .wardDistribution(new HashMap<>())
                .build();
    }

    private GrievanceStatsDTO safeGetGrievanceStats() {
        try {
            GrievanceStatsDTO stats = grievanceClient.getGrievanceStats();
            if (stats != null) return stats;
        } catch (Exception e) {
            log.warn("Failed to fetch grievance stats: {}", e.getMessage());
        }
        return GrievanceStatsDTO.builder()
                .totalGrievances(0)
                .submitted(0)
                .assigned(0)
                .inProgress(0)
                .pending(0)
                .resolved(0)
                .closed(0)
                .escalated(0)
                .overdue(0)
                .resolutionRate(0.0)
                .slaComplianceRate(0.0)
                .averageSatisfactionRating(0.0)
                .totalFeedbackCount(0)
                .categoryDistribution(new HashMap<>())
                .priorityDistribution(new HashMap<>())
                .build();
    }

    private ServiceStatsDTO safeGetServiceStats() {
        try {
            ServiceStatsDTO stats = serviceManagementClient.getServiceStats();
            if (stats != null) return stats;
        } catch (Exception e) {
            log.warn("Failed to fetch service stats: {}", e.getMessage());
        }
        return ServiceStatsDTO.builder()
                .totalApplications(0)
                .submitted(0)
                .underVerification(0)
                .verified(0)
                .approved(0)
                .rejected(0)
                .certificatesGenerated(0)
                .permitsGenerated(0)
                .totalRevenue(0.0)
                .totalDownloads(0)
                .applicationsByDepartment(new HashMap<>())
                .revenueByDepartment(new HashMap<>())
                .build();
    }

    private WelfareStatsDTO safeGetWelfareStats() {
        try {
            WelfareStatsDTO stats = welfareClient.getWelfareStats();
            if (stats != null) return stats;
        } catch (Exception e) {
            log.warn("Failed to fetch welfare stats: {}", e.getMessage());
        }
        return WelfareStatsDTO.builder()
                .totalSchemes(0)
                .activeSchemes(0)
                .totalApplications(0)
                .pendingApplications(0)
                .approvedApplications(0)
                .rejectedApplications(0)
                .totalBeneficiaries(0)
                .totalDisbursedBenefitAmount(0.0)
                .schemesByDepartment(new HashMap<>())
                .build();
    }

    private BudgetStatsDTO safeGetBudgetStats() {
        try {
            BudgetStatsDTO stats = budgetClient.getBudgetStats();
            if (stats != null) return stats;
        } catch (Exception e) {
            log.warn("Failed to fetch budget stats: {}", e.getMessage());
        }
        return BudgetStatsDTO.builder()
                .totalAllocatedBudget(BigDecimal.ZERO)
                .totalUtilizedBudget(BigDecimal.ZERO)
                .totalRemainingBudget(BigDecimal.ZERO)
                .utilizationPercentage(0.0)
                .totalPayments(0)
                .completedPayments(0)
                .pendingPayments(0)
                .failedPayments(0)
                .totalDistributedFunds(BigDecimal.ZERO)
                .totalExpenses(0)
                .departments(0)
                .build();
    }
}
