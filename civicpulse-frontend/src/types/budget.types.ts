export type ExpenseCategory =
  | 'INFRASTRUCTURE'
  | 'HEALTHCARE'
  | 'EDUCATION'
  | 'PENSION'
  | 'SUBSIDY'
  | 'ADMINISTRATION'
  | 'OTHER';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface CreateBudgetRequest {
  department: string;
  financialYear: string;
  allocatedAmount: number;
}

export interface UpdateBudgetRequest {
  department: string;
  financialYear: string;
  allocatedAmount: number;
}

export interface BudgetResponse {
  id: number;
  department: string;
  financialYear: string;
  allocatedAmount: number;
  utilizedAmount: number;
  remainingAmount: number;
  createdDate: string; // ISO date string (YYYY-MM-DD)
}

export interface CreateBudgetAllocationRequest {
  budgetId: number;
  schemeId: number;
  allocatedAmount: number;
}

export interface BudgetAllocationResponse {
  id: number;
  budgetId: number;
  schemeId: number;
  allocatedAmount: number;
  utilizedAmount: number;
  remainingAmount: number;
  allocatedDate: string; // ISO date string (YYYY-MM-DD)
}

export interface CreateExpenseRequest {
  budgetId: number;
  department: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
}

export interface ExpenseResponse {
  id: number;
  budgetId: number;
  department: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  createdAt: string; // ISO datetime string
}

export interface CreateFundDistributionRequest {
  beneficiaryId: number;
  citizenId: number;
  schemeId: number;
  budgetId: number;
  amount: number;
}

export interface FundDistributionResponse {
  id: number;
  beneficiaryId: number;
  citizenId: number;
  schemeId: number;
  schemeName: string;
  budgetId: number;
  amount: number;
  transactionId: string;
  paymentStatus: PaymentStatus;
  distributedAt: string; // ISO datetime string
}

export interface BudgetDashboardResponse {
  totalAllocated: number;
  totalUtilized: number;
  totalRemaining: number;
  utilizationPercentage: number;
}

export interface AnalyticsDashboardResponse {
  totalAllocatedBudget: number;
  totalUtilizedBudget: number;
  totalRemainingBudget: number;
  utilizationPercentage: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalDistributedFunds: number;
  totalExpenses: number;
  departments: number;
}

export interface AuditLogResponse {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  performedBy: string;
  description: string;
  timestamp: string; // ISO datetime string
}
