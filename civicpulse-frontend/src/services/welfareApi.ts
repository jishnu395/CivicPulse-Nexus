import apiClient from './api/client';
import {
  CreateSchemeRequest,
  SchemeResponse,
  ApplySchemeRequest,
  WelfareApplicationResponse,
  BeneficiaryResponse,
  WelfareStatsResponse,
  SchemeStatus,
} from '../types/welfare.types';

export const welfareApi = {
  // Scheme Endpoints
  getAllSchemes: async (): Promise<SchemeResponse[]> => {
    const response = await apiClient.get<SchemeResponse[]>('/api/welfare/schemes');
    return response.data;
  },

  getSchemeById: async (id: number): Promise<SchemeResponse> => {
    const response = await apiClient.get<SchemeResponse>(`/api/welfare/schemes/${id}`);
    return response.data;
  },

  createScheme: async (request: CreateSchemeRequest): Promise<SchemeResponse> => {
    const response = await apiClient.post<SchemeResponse>('/api/welfare/schemes', request);
    return response.data;
  },

  updateScheme: async (id: number, request: CreateSchemeRequest): Promise<SchemeResponse> => {
    const response = await apiClient.put<SchemeResponse>(`/api/welfare/schemes/${id}`, request);
    return response.data;
  },

  deleteScheme: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/welfare/schemes/${id}`);
  },

  getSchemesByStatus: async (status: SchemeStatus): Promise<SchemeResponse[]> => {
    const response = await apiClient.get<SchemeResponse[]>(`/api/welfare/schemes/status/${status}`);
    return response.data;
  },

  getStats: async (): Promise<WelfareStatsResponse> => {
    const response = await apiClient.get<WelfareStatsResponse>('/api/welfare/schemes/stats');
    return response.data;
  },

  // Application Endpoints
  applyScheme: async (request: ApplySchemeRequest): Promise<WelfareApplicationResponse> => {
    const response = await apiClient.post<WelfareApplicationResponse>('/api/welfare/applications/apply', request);
    return response.data;
  },

  getMyApplications: async (citizenId: number): Promise<WelfareApplicationResponse[]> => {
    const response = await apiClient.get<WelfareApplicationResponse[]>(`/api/welfare/applications/my/${citizenId}`);
    return response.data;
  },

  getPendingApplications: async (): Promise<WelfareApplicationResponse[]> => {
    const response = await apiClient.get<WelfareApplicationResponse[]>('/api/welfare/applications/pending');
    return response.data;
  },

  approveApplication: async (id: number): Promise<WelfareApplicationResponse> => {
    const response = await apiClient.put<WelfareApplicationResponse>(`/api/welfare/applications/${id}/approve`);
    return response.data;
  },

  rejectApplication: async (id: number, remarks: string): Promise<WelfareApplicationResponse> => {
    const response = await apiClient.put<WelfareApplicationResponse>(
      `/api/welfare/applications/${id}/reject`,
      null,
      { params: { remarks } }
    );
    return response.data;
  },

  // Beneficiary Endpoints
  registerBeneficiary: async (applicationId: number): Promise<BeneficiaryResponse> => {
    const response = await apiClient.post<BeneficiaryResponse>(`/api/welfare/beneficiaries/register/${applicationId}`);
    return response.data;
  },

  getBeneficiaryById: async (id: number): Promise<BeneficiaryResponse> => {
    const response = await apiClient.get<BeneficiaryResponse>(`/api/welfare/beneficiaries/${id}`);
    return response.data;
  },

  getAllBeneficiaries: async (): Promise<BeneficiaryResponse[]> => {
    const response = await apiClient.get<BeneficiaryResponse[]>('/api/welfare/beneficiaries');
    return response.data;
  },

  getBeneficiariesByCitizen: async (citizenId: number): Promise<BeneficiaryResponse[]> => {
    const response = await apiClient.get<BeneficiaryResponse[]>(`/api/welfare/beneficiaries/citizen/${citizenId}`);
    return response.data;
  },

  getBeneficiariesByScheme: async (schemeId: number): Promise<BeneficiaryResponse[]> => {
    const response = await apiClient.get<BeneficiaryResponse[]>(`/api/welfare/beneficiaries/scheme/${schemeId}`);
    return response.data;
  },
};

export default welfareApi;
