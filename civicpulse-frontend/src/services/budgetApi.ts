import apiClient from './api/client';
import {
  CreateBudgetRequest,
  UpdateBudgetRequest,
  BudgetResponse,
  CreateBudgetAllocationRequest,
  BudgetAllocationResponse,
  CreateExpenseRequest,
  ExpenseResponse,
  CreateFundDistributionRequest,
  FundDistributionResponse,
  BudgetDashboardResponse,
  AnalyticsDashboardResponse,
  AuditLogResponse,
  ExpenseCategory,
  PaymentStatus,
} from '../types/budget.types';

export const budgetApi = {
  // Budget Endpoints
  createBudget: async (request: CreateBudgetRequest): Promise<BudgetResponse> => {
    const response = await apiClient.post<BudgetResponse>('/api/budget', request);
    return response.data;
  },

  updateBudget: async (id: number, request: UpdateBudgetRequest): Promise<BudgetResponse> => {
    const response = await apiClient.put<BudgetResponse>(`/api/budget/${id}`, request);
    return response.data;
  },

  deleteBudget: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/budget/${id}`);
  },

  getAllBudgets: async (): Promise<BudgetResponse[]> => {
    const response = await apiClient.get<BudgetResponse[]>('/api/budget');
    return response.data;
  },

  getBudgetById: async (id: number): Promise<BudgetResponse> => {
    const response = await apiClient.get<BudgetResponse>(`/api/budget/${id}`);
    return response.data;
  },

  getBudgetUtilization: async (id: number): Promise<number> => {
    const response = await apiClient.get<number>(`/api/budget/${id}/utilization`);
    return response.data;
  },

  getBudgetRemaining: async (id: number): Promise<number> => {
    const response = await apiClient.get<number>(`/api/budget/${id}/remaining`);
    return response.data;
  },

  getBudgetDashboard: async (): Promise<BudgetDashboardResponse> => {
    const response = await apiClient.get<BudgetDashboardResponse>('/api/budget/dashboard');
    return response.data;
  },

  getBudgetStats: async (): Promise<AnalyticsDashboardResponse> => {
    const response = await apiClient.get<AnalyticsDashboardResponse>('/api/budget/stats');
    return response.data;
  },

  // Budget Allocation Endpoints
  allocateBudget: async (request: CreateBudgetAllocationRequest): Promise<BudgetAllocationResponse> => {
    const response = await apiClient.post<BudgetAllocationResponse>('/api/budget/allocation', request);
    return response.data;
  },

  getAllAllocations: async (): Promise<BudgetAllocationResponse[]> => {
    const response = await apiClient.get<BudgetAllocationResponse[]>('/api/budget/allocation');
    return response.data;
  },

  getAllocationsByBudget: async (budgetId: number): Promise<BudgetAllocationResponse[]> => {
    const response = await apiClient.get<BudgetAllocationResponse[]>(`/api/budget/allocation/budget/${budgetId}`);
    return response.data;
  },

  // Expense Endpoints
  createExpense: async (request: CreateExpenseRequest): Promise<ExpenseResponse> => {
    const response = await apiClient.post<ExpenseResponse>('/api/expenses', request);
    return response.data;
  },

  getAllExpenses: async (): Promise<ExpenseResponse[]> => {
    const response = await apiClient.get<ExpenseResponse[]>('/api/expenses');
    return response.data;
  },

  getExpenseById: async (id: number): Promise<ExpenseResponse> => {
    const response = await apiClient.get<ExpenseResponse>(`/api/expenses/${id}`);
    return response.data;
  },

  getExpensesByBudget: async (budgetId: number): Promise<ExpenseResponse[]> => {
    const response = await apiClient.get<ExpenseResponse[]>(`/api/expenses/budget/${budgetId}`);
    return response.data;
  },

  getExpensesByDepartment: async (department: string): Promise<ExpenseResponse[]> => {
    const response = await apiClient.get<ExpenseResponse[]>(`/api/expenses/department/${department}`);
    return response.data;
  },

  getExpensesByCategory: async (category: ExpenseCategory): Promise<ExpenseResponse[]> => {
    const response = await apiClient.get<ExpenseResponse[]>(`/api/expenses/category/${category}`);
    return response.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/expenses/${id}`);
  },

  // Fund Distribution Endpoints
  distributeFunds: async (request: CreateFundDistributionRequest): Promise<FundDistributionResponse> => {
    const response = await apiClient.post<FundDistributionResponse>('/api/fund-distributions', request);
    return response.data;
  },

  getAllDistributions: async (): Promise<FundDistributionResponse[]> => {
    const response = await apiClient.get<FundDistributionResponse[]>('/api/fund-distributions');
    return response.data;
  },

  getDistributionById: async (id: number): Promise<FundDistributionResponse> => {
    const response = await apiClient.get<FundDistributionResponse>(`/api/fund-distributions/${id}`);
    return response.data;
  },

  getDistributionsByCitizen: async (citizenId: number): Promise<FundDistributionResponse[]> => {
    const response = await apiClient.get<FundDistributionResponse[]>(`/api/fund-distributions/citizen/${citizenId}`);
    return response.data;
  },

  getDistributionsByBeneficiary: async (beneficiaryId: number): Promise<FundDistributionResponse[]> => {
    const response = await apiClient.get<FundDistributionResponse[]>(`/api/fund-distributions/beneficiary/${beneficiaryId}`);
    return response.data;
  },

  getDistributionsByStatus: async (status: PaymentStatus): Promise<FundDistributionResponse[]> => {
    const response = await apiClient.get<FundDistributionResponse[]>(`/api/fund-distributions/status/${status}`);
    return response.data;
  },

  completeDistribution: async (id: number): Promise<FundDistributionResponse> => {
    const response = await apiClient.put<FundDistributionResponse>(`/api/fund-distributions/${id}/complete`);
    return response.data;
  },

  failDistribution: async (id: number): Promise<FundDistributionResponse> => {
    const response = await apiClient.put<FundDistributionResponse>(`/api/fund-distributions/${id}/fail`);
    return response.data;
  },

  // Audit Logs Endpoints
  getAllAuditLogs: async (): Promise<AuditLogResponse[]> => {
    const response = await apiClient.get<AuditLogResponse[]>('/api/audit');
    return response.data;
  },

  getAuditLogById: async (id: number): Promise<AuditLogResponse> => {
    const response = await apiClient.get<AuditLogResponse>(`/api/audit/${id}`);
    return response.data;
  },

  getAuditLogsByEntity: async (entityType: string): Promise<AuditLogResponse[]> => {
    const response = await apiClient.get<AuditLogResponse[]>(`/api/audit/entity/${entityType}`);
    return response.data;
  },

  // Analytics Endpoints
  getAnalyticsDashboard: async (): Promise<AnalyticsDashboardResponse> => {
    const response = await apiClient.get<AnalyticsDashboardResponse>('/api/analytics/dashboard');
    return response.data;
  },
};

export default budgetApi;
