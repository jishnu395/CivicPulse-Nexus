package com.civicpulse.reporting.controller;

import com.civicpulse.reporting.dto.report.*;
import com.civicpulse.reporting.service.ReportingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reporting & Governance Analytics", description = "Milestone 4 Consolidated Governance Reports & Executive Dashboard APIs")
public class ReportingController {

    private final ReportingService reportingService;

    @Operation(summary = "Consolidated Executive Governance Dashboard")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(reportingService.getDashboard());
    }

    @Operation(summary = "Citizen Demographics & Registration Report")
    @GetMapping("/citizens")
    public ResponseEntity<CitizenReportDTO> getCitizenReport() {
        return ResponseEntity.ok(reportingService.getCitizenReport());
    }

    @Operation(summary = "Grievance Redressal & SLA Performance Report")
    @GetMapping("/grievances")
    public ResponseEntity<GrievanceReportDTO> getGrievanceReport() {
        return ResponseEntity.ok(reportingService.getGrievanceReport());
    }

    @Operation(summary = "Municipal Revenue & Collections Report")
    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDTO> getRevenueReport() {
        return ResponseEntity.ok(reportingService.getRevenueReport());
    }

    @Operation(summary = "Budget Allocation & Welfare Disbursement Report")
    @GetMapping("/budget")
    public ResponseEntity<BudgetReportDTO> getBudgetReport() {
        return ResponseEntity.ok(reportingService.getBudgetReport());
    }

    @Operation(summary = "Cross-Department Governance Scorecard & Performance Report")
    @GetMapping("/performance")
    public ResponseEntity<PerformanceReportDTO> getPerformanceReport() {
        return ResponseEntity.ok(reportingService.getPerformanceReport());
    }
}
