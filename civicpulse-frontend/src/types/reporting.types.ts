export interface ExecutiveDashboardResponse {
  totalCitizens: number;
  activeCitizens: number;
  slaComplianceRate: number;
  grievanceResolutionRate: number;
  averageCitizenSatisfaction: number;
  totalRevenueCollected: number;
  totalBudgetAllocated: number;
  totalBudgetUtilized: number;
  budgetUtilizationPercentage: number;
  totalActiveBeneficiaries: number;
  totalWelfareDisbursed: number;
  totalCertificatesIssued: number;
  totalPermitsIssued: number;
  totalActiveGrievances: number;
  generatedAt: string;
}

export interface CitizenReportResponse {
  totalCitizens: number;
  activeCitizens: number;
  inactiveCitizens: number;
  wardDistribution: Record<string, number>;
  generatedAt: string;
}

export interface GrievanceReportResponse {
  totalGrievances: number;
  submitted: number;
  assigned: number;
  inProgress: number;
  pending: number;
  resolved: number;
  closed: number;
  escalated: number;
  overdue: number;
  resolutionRate: number;
  slaComplianceRate: number;
  averageSatisfactionRating: number;
  totalFeedbackCount: number;
  categoryBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  generatedAt: string;
}

export interface RevenueReportResponse {
  totalRevenue: number;
  totalTransactions: number;
  certificatesIssued: number;
  permitsIssued: number;
  applicationsByDepartment: Record<string, number>;
  revenueByDepartment: Record<string, number>;
  generatedAt: string;
}

export interface BudgetReportResponse {
  totalAllocated: number;
  totalUtilized: number;
  totalRemaining: number;
  utilizationPercentage: number;
  totalDistributedWelfare: number;
  completedPaymentsCount: number;
  pendingPaymentsCount: number;
  failedPaymentsCount: number;
  generatedAt: string;
}

export interface DepartmentPerformance {
  departmentName: string;
  totalTasks: number;
  resolutionRate: number;
  slaComplianceRate: number;
  revenueCollected: number;
  performanceScore: number;
}

export interface PerformanceReportResponse {
  overallSlaScore: number;
  overallCitizenSatisfaction: number;
  overallGrievanceResolutionRate: number;
  overallBudgetEfficiency: number;
  departmentScorecards: DepartmentPerformance[];
  generatedAt: string;
}
