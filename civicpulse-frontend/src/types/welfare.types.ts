export type SchemeStatus = 'ACTIVE' | 'INACTIVE';

export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface CreateSchemeRequest {
  schemeName: string;
  description: string;
  department: string;
  eligibilityCriteria: string;
  benefitAmount: number;
  status: SchemeStatus;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
}

export interface SchemeResponse {
  id: number;
  schemeName: string;
  description: string;
  department: string;
  eligibilityCriteria: string;
  benefitAmount: number;
  status: SchemeStatus;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
}

export interface ApplySchemeRequest {
  citizenId: number;
  schemeId: number;
  age?: number;
  annualIncome?: number;
  ward?: string;
  familyStatus?: string;
  supportingDocuments?: string;
}

export interface WelfareApplicationResponse {
  id: number;
  citizenId: number;
  schemeId: number;
  schemeName: string;
  status: ApplicationStatus;
  applicationDate: string; // ISO datetime string
  remarks?: string;
}

export interface BeneficiaryResponse {
  id: number;
  citizenId: number;
  schemeId: number;
  schemeName: string;
  benefitAmount: number;
  enrollmentDate: string; // ISO date string (YYYY-MM-DD)
  status: ApplicationStatus;
}

export interface WelfareStatsResponse {
  totalSchemes: number;
  activeSchemes: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalBeneficiaries: number;
  totalDisbursedBenefitAmount: number;
  schemesByDepartment: Record<string, number>;
}
