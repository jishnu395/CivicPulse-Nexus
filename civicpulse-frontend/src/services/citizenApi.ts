import apiClient from './api/client';
import {
  Citizen,
  CitizenStats,
  CreateCitizenRequest,
  UpdateCitizenRequest,
  CitizenStatus,
} from '../types/citizen.types';

export const citizenApi = {
  // Register citizen profile
  registerCitizen: async (data: CreateCitizenRequest): Promise<Citizen> => {
    const response = await apiClient.post<Citizen>('/api/citizens', data);
    return response.data;
  },

  // Get all citizens
  getAllCitizens: async (): Promise<Citizen[]> => {
    const response = await apiClient.get<Citizen[]>('/api/citizens');
    return response.data;
  },

  // Get citizen by database ID
  getCitizenById: async (id: number): Promise<Citizen> => {
    const response = await apiClient.get<Citizen>(`/api/citizens/${id}`);
    return response.data;
  },

  // Get citizen profile by Keycloak / User ID
  getCitizenByUserId: async (userId: number): Promise<Citizen> => {
    const response = await apiClient.get<Citizen>(`/api/citizens/user/${userId}`);
    return response.data;
  },

  // Get citizen profile by email
  getCitizenByEmail: async (email: string): Promise<Citizen> => {
    const response = await apiClient.get<Citizen>(`/api/citizens/email/${email}`);
    return response.data;
  },

  // Search citizens by name, email, phone, or ward
  searchCitizens: async (query?: string): Promise<Citizen[]> => {
    const params = query ? { query } : {};
    const response = await apiClient.get<Citizen[]>('/api/citizens/search', { params });
    return response.data;
  },

  // Get citizen statistics
  getCitizenStats: async (): Promise<CitizenStats> => {
    const response = await apiClient.get<CitizenStats>('/api/citizens/stats');
    return response.data;
  },

  // Get citizens by ward
  getCitizensByWard: async (wardNumber: string): Promise<Citizen[]> => {
    const response = await apiClient.get<Citizen[]>(`/api/citizens/ward/${wardNumber}`);
    return response.data;
  },

  // Get citizens by status (ACTIVE, INACTIVE, SUSPENDED)
  getCitizensByStatus: async (status: CitizenStatus): Promise<Citizen[]> => {
    const response = await apiClient.get<Citizen[]>(`/api/citizens/status/${status}`);
    return response.data;
  },

  // Update citizen profile
  updateCitizen: async (id: number, data: UpdateCitizenRequest): Promise<Citizen> => {
    const response = await apiClient.put<Citizen>(`/api/citizens/${id}`, data);
    return response.data;
  },

  // Delete citizen profile (Admin)
  deleteCitizen: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/citizens/${id}`);
  },
};
