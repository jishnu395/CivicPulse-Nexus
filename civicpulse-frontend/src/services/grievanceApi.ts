import apiClient from './api/client';
import {
  Grievance,
  GrievanceHistory,
  GrievanceStats,
  GrievanceDashboard,
  CreateGrievanceRequest,
  UpdateGrievanceRequest,
  UpdateGrievanceStatusRequest,
  AssignGrievanceRequest,
  CreateFeedbackRequest,
  Feedback,
} from '../types/grievance.types';

export const grievanceApi = {
  // Create grievance (Citizen)
  createGrievance: async (data: CreateGrievanceRequest): Promise<Grievance> => {
    const response = await apiClient.post<Grievance>('/api/grievances', data);
    return response.data;
  },

  // Get all grievances (Staff)
  getAllGrievances: async (): Promise<Grievance[]> => {
    const response = await apiClient.get<Grievance[]>('/api/grievances');
    return response.data;
  },

  // Get logged-in citizen's grievances
  getMyGrievances: async (): Promise<Grievance[]> => {
    const response = await apiClient.get<Grievance[]>('/api/grievances/my');
    return response.data;
  },

  // Get grievances for specific citizen ID
  getGrievancesByCitizenId: async (citizenId: number): Promise<Grievance[]> => {
    const response = await apiClient.get<Grievance[]>(`/api/grievances/citizen/${citizenId}`);
    return response.data;
  },

  // Get grievance by database ID
  getGrievanceById: async (id: number): Promise<Grievance> => {
    const response = await apiClient.get<Grievance>(`/api/grievances/${id}`);
    return response.data;
  },

  // Update grievance metadata (Title, Description, Category, Location, Priority)
  updateGrievance: async (id: number, data: UpdateGrievanceRequest): Promise<Grievance> => {
    const response = await apiClient.put<Grievance>(`/api/grievances/${id}`, data);
    return response.data;
  },

  // Delete grievance (Admin)
  deleteGrievance: async (id: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/api/grievances/${id}`);
    return response.data;
  },

  // Assign grievance to department and officer (Commissioner / Admin)
  assignGrievance: async (id: number, data: AssignGrievanceRequest): Promise<Grievance> => {
    const response = await apiClient.put<Grievance>(`/api/grievances/${id}/assign`, data);
    return response.data;
  },

  // Update grievance status workflow
  updateGrievanceStatus: async (
    id: number,
    data: UpdateGrievanceStatusRequest
  ): Promise<Grievance> => {
    const response = await apiClient.put<Grievance>(`/api/grievances/${id}/status`, data);
    return response.data;
  },

  // Get grievance history timeline
  getGrievanceHistory: async (id: number): Promise<GrievanceHistory[]> => {
    const response = await apiClient.get<GrievanceHistory[]>(`/api/grievances/${id}/history`);
    return response.data;
  },

  // Get grievance high-level dashboard metrics
  getDashboard: async (): Promise<GrievanceDashboard> => {
    const response = await apiClient.get<GrievanceDashboard>('/api/grievances/dashboard');
    return response.data;
  },

  // Get detailed grievance statistics & SLA analytics
  getGrievanceStats: async (): Promise<GrievanceStats> => {
    const response = await apiClient.get<GrievanceStats>('/api/grievances/stats');
    return response.data;
  },

  // Submit citizen feedback for resolved/closed grievance
  submitFeedback: async (id: number, data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await apiClient.post<Feedback>(`/api/grievances/${id}/feedback`, data);
    return response.data;
  },

  // Get citizen feedback for grievance
  getFeedback: async (id: number): Promise<Feedback> => {
    const response = await apiClient.get<Feedback>(`/api/grievances/${id}/feedback`);
    return response.data;
  },
};
