import apiClient from './api/client';
import {
  ExecutiveDashboardResponse,
  CitizenReportResponse,
  GrievanceReportResponse,
  RevenueReportResponse,
  BudgetReportResponse,
  PerformanceReportResponse
} from '../types/reporting.types';

export const reportingApi = {
  getDashboard: async (): Promise<ExecutiveDashboardResponse> => {
    const response = await apiClient.get<ExecutiveDashboardResponse>('/api/reports/dashboard');
    return response.data;
  },

  getCitizenReport: async (): Promise<CitizenReportResponse> => {
    const response = await apiClient.get<CitizenReportResponse>('/api/reports/citizens');
    return response.data;
  },

  getGrievanceReport: async (): Promise<GrievanceReportResponse> => {
    const response = await apiClient.get<GrievanceReportResponse>('/api/reports/grievances');
    return response.data;
  },

  getRevenueReport: async (): Promise<RevenueReportResponse> => {
    const response = await apiClient.get<RevenueReportResponse>('/api/reports/revenue');
    return response.data;
  },

  getBudgetReport: async (): Promise<BudgetReportResponse> => {
    const response = await apiClient.get<BudgetReportResponse>('/api/reports/budget');
    return response.data;
  },

  getPerformanceReport: async (): Promise<PerformanceReportResponse> => {
    const response = await apiClient.get<PerformanceReportResponse>('/api/reports/performance');
    return response.data;
  }
};

export default reportingApi;
