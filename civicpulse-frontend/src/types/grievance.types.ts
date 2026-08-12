export type GrievanceStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'ESCALATED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type SLAStatus = 'WITHIN_SLA' | 'NEAR_DEADLINE' | 'OVERDUE';

export interface Grievance {
  id: number;
  citizenId: number;
  departmentId?: number | null;
  assignedOfficerId?: number | null;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: Priority;
  status: GrievanceStatus;
  createdAt: string;
  updatedAt?: string;
  dueDate?: string;
  resolvedAt?: string | null;
  slaStatus: SLAStatus;
}

export interface CreateGrievanceRequest {
  citizenId: number;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: Priority;
}

export interface UpdateGrievanceRequest {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  priority?: Priority;
}

export interface UpdateGrievanceStatusRequest {
  status: GrievanceStatus;
}

export interface AssignGrievanceRequest {
  departmentId: number;
  assignedOfficerId: number;
}

export interface GrievanceHistory {
  id: number;
  grievanceId: number;
  status: GrievanceStatus;
  remarks?: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  citizenId: number;
  rating: number; // 1 to 5
  comments?: string;
}

export interface Feedback {
  id: number;
  grievanceId: number;
  citizenId: number;
  rating: number;
  comments?: string;
  createdAt: string;
}

export interface GrievanceStats {
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
  categoryDistribution?: Record<string, number>;
  priorityDistribution?: Record<string, number>;
}

export interface GrievanceDashboard {
  total: number;
  submitted: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  closed: number;
  escalated: number;
  overdue: number;
}
