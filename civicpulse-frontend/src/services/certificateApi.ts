import { apiClient } from './api/client';
import {
  Application,
  ApplyCertificateRequest,
  PermitApplicationRequest,
  DocumentResponse,
  UploadDocumentResponse,
  VerifyDocumentRequest,
  DocumentVerificationRequest,
  ApprovalRequest,
  Certificate,
  Permit,
  ServiceDashboardStats,
} from '../types/certificate.types';

export const certificateApi = {
  // Applications
  applyCertificate: async (request: ApplyCertificateRequest): Promise<Application> => {
    const response = await apiClient.post<Application>(
      '/api/applications/certificates/apply',
      request
    );
    return response.data;
  },

  applyPermit: async (request: PermitApplicationRequest): Promise<Application> => {
    const response = await apiClient.post<Application>(
      '/api/applications/permits/apply',
      request
    );
    return response.data;
  },

  getMyApplications: async (citizenId: number): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>(
      `/api/applications/my/${citizenId}`
    );
    return response.data;
  },

  getApplicationById: async (applicationId: number): Promise<Application> => {
    const response = await apiClient.get<Application>(
      `/api/applications/${applicationId}`
    );
    return response.data;
  },

  // Documents
  uploadDocument: async (
    applicationId: number,
    file: File
  ): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadDocumentResponse>(
      `/api/documents/upload/${applicationId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getDocumentsByApplication: async (
    applicationId: number
  ): Promise<DocumentResponse[]> => {
    const response = await apiClient.get<DocumentResponse[]>(
      `/api/documents/application/${applicationId}`
    );
    return response.data;
  },

  getDocument: async (documentId: number): Promise<UploadDocumentResponse> => {
    const response = await apiClient.get<UploadDocumentResponse>(
      `/api/documents/${documentId}`
    );
    return response.data;
  },

  deleteDocument: async (documentId: number): Promise<string> => {
    const response = await apiClient.delete<string>(`/api/documents/${documentId}`);
    return response.data;
  },

  // Officer Workbench
  getPendingApplications: async (): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>('/api/officer/pending');
    return response.data;
  },

  verifyApplication: async (
    applicationId: number,
    request: VerifyDocumentRequest
  ): Promise<Application> => {
    const response = await apiClient.put<Application>(
      `/api/officer/verify/${applicationId}`,
      request
    );
    return response.data;
  },

  verifyDocument: async (
    documentId: number,
    request: DocumentVerificationRequest
  ): Promise<Application> => {
    const response = await apiClient.put<Application>(
      `/api/officer/document/${documentId}`,
      request
    );
    return response.data;
  },

  approveApplication: async (
    applicationId: number,
    request: ApprovalRequest
  ): Promise<Application> => {
    const response = await apiClient.put<Application>(
      `/api/officer/approve/${applicationId}`,
      request
    );
    return response.data;
  },

  rejectApplication: async (
    applicationId: number,
    request: ApprovalRequest
  ): Promise<Application> => {
    const response = await apiClient.put<Application>(
      `/api/officer/reject/${applicationId}`,
      request
    );
    return response.data;
  },

  getOfficerDocuments: async (
    applicationId: number
  ): Promise<DocumentResponse[]> => {
    const response = await apiClient.get<DocumentResponse[]>(
      `/api/officer/documents/${applicationId}`
    );
    return response.data;
  },

  // Certificate Output & Download
  generateCertificate: async (applicationId: number): Promise<Certificate> => {
    const response = await apiClient.post<Certificate>(
      `/api/certificate/generate/${applicationId}`
    );
    return response.data;
  },

  getCertificate: async (applicationId: number): Promise<Certificate> => {
    const response = await apiClient.get<Certificate>(
      `/api/certificate/${applicationId}`
    );
    return response.data;
  },

  downloadCertificate: async (applicationId: number): Promise<Blob> => {
    const response = await apiClient.get(
      `/api/certificate/download/${applicationId}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // Permit Output & Download
  generatePermit: async (applicationId: number): Promise<Permit> => {
    const response = await apiClient.post<Permit>(
      `/api/permit/generate/${applicationId}`
    );
    return response.data;
  },

  getPermit: async (applicationId: number): Promise<Permit> => {
    const response = await apiClient.get<Permit>(
      `/api/permit/${applicationId}`
    );
    return response.data;
  },

  downloadPermit: async (applicationId: number): Promise<Blob> => {
    const response = await apiClient.get(
      `/api/permit/download/${applicationId}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<ServiceDashboardStats> => {
    const response = await apiClient.get<ServiceDashboardStats>(
      '/api/dashboard/stats'
    );
    return response.data;
  },
};
