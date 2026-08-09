package com.civicpulse.reporting.service;

import com.civicpulse.reporting.dto.report.*;

public interface ReportingService {

    DashboardDTO getDashboard();

    CitizenReportDTO getCitizenReport();

    GrievanceReportDTO getGrievanceReport();

    RevenueReportDTO getRevenueReport();

    BudgetReportDTO getBudgetReport();

    PerformanceReportDTO getPerformanceReport();
}
