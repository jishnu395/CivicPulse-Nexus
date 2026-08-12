export type CertificateType =
  | 'BIRTH_CERTIFICATE'
  | 'DEATH_CERTIFICATE'
  | 'INCOME_CERTIFICATE'
  | 'RESIDENCE_CERTIFICATE'
  | 'MARRIAGE_CERTIFICATE';

export type PermitType =
  | 'TRADE_LICENSE'
  | 'SHOP_LICENSE'
  | 'BUILDING_PERMIT'
  | 'WATER_CONNECTION_PERMIT';

export type DepartmentType =
  | 'REVENUE'
  | 'MUNICIPALITY'
  | 'WATER'
  | 'HOUSING'
  | 'EDUCATION';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CERTIFICATE_GENERATED';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'NEEDS_CORRECTION';

export interface Application {
  id: number;
  applicationNo: string;
  citizenId: number;
  certificateType?: CertificateType | null;
  permitType?: PermitType | null;
  department: DepartmentType;
  status: ApplicationStatus;
  submissionDate: string;
  approvalDate?: string | null;
}

export interface ApplyCertificateRequest {
  citizenId: number;
  certificateType: CertificateType;
}

export interface PermitApplicationRequest {
  citizenId: number;
  permitType: PermitType;
}

export interface DocumentResponse {
  id: number;
  documentName: string;
  documentUrl: string;
  fileType: string;
  fileSize: number;
  verificationStatus: VerificationStatus;
  remarks?: string | null;
}

export interface UploadDocumentResponse {
  id: number;
  documentName: string;
  fileUrl: string;
}

export interface VerifyDocumentRequest {
  remarks: string;
  verified: boolean;
}

export interface DocumentVerificationRequest {
  verified: boolean;
  remarks?: string;
}

export interface ApprovalRequest {
  remarks: string;
}

export interface Certificate {
  id: number;
  certificateNo: string;
  issueDate: string;
  digitalSignature: string;
  pdfUrl?: string;
  applicationId: number;
}

export interface Permit {
  id: number;
  permitNo: string;
  issueDate: string;
  digitalSignature: string;
  pdfUrl?: string;
  applicationId: number;
}

export interface ServiceDashboardStats {
  totalApplications: number;
  submitted: number;
  underVerification: number;
  verified: number;
  approved: number;
  rejected: number;
  certificatesGenerated: number;
  permitsGenerated: number;
  totalRevenue: number;
  totalDownloads: number;
  applicationsByDepartment: Record<string, number>;
  revenueByDepartment: Record<string, number>;
}
