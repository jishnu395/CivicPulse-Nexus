export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',

  // Citizen routes
  CITIZEN_DASHBOARD: '/citizen/dashboard',
  CITIZEN_PROFILE: '/citizen/profile',
  CITIZEN_GRIEVANCES: '/citizen/grievances',
  CITIZEN_RAISE_GRIEVANCE: '/citizen/grievances/create',
  CITIZEN_GRIEVANCE_DETAILS: '/citizen/grievances/:id',
  CITIZEN_SERVICES: '/citizen/services',
  CITIZEN_CERTIFICATES: '/citizen/certificates',
  CITIZEN_PERMITS: '/citizen/permits',
  CITIZEN_APPLICATIONS: '/citizen/applications',
  CITIZEN_WELFARE: '/citizen/welfare',
  CITIZEN_NOTIFICATIONS: '/citizen/notifications',

  // Officer routes
  OFFICER_DASHBOARD: '/officer/dashboard',
  OFFICER_GRIEVANCES_ASSIGNED: '/officer/grievances/assigned',
  OFFICER_GRIEVANCES_PENDING: '/officer/grievances/pending',
  OFFICER_GRIEVANCES_SLA: '/officer/grievances/sla',
  OFFICER_GRIEVANCES_ESCALATED: '/officer/grievances/escalated',
  OFFICER_APPLICATIONS_VERIFICATION: '/officer/applications/pending',
  OFFICER_APPLICATIONS_DOCUMENTS: '/officer/applications/documents',
  OFFICER_APPLICATIONS_APPROVALS: '/officer/applications/approvals',
  OFFICER_WELFARE_APPLICATIONS: '/officer/welfare/applications',
  OFFICER_WELFARE_BENEFICIARIES: '/officer/welfare/beneficiaries',
  OFFICER_FUND_DISTRIBUTION: '/officer/fund-distribution',

  // Commissioner routes
  COMMISSIONER_DASHBOARD: '/commissioner/dashboard',
  COMMISSIONER_GRIEVANCES_MONITORING: '/commissioner/grievances/monitoring',
  COMMISSIONER_GRIEVANCES_SLA: '/commissioner/grievances/sla',
  COMMISSIONER_GRIEVANCES_ESCALATIONS: '/commissioner/grievances/escalations',
  COMMISSIONER_DEPARTMENT_PERFORMANCE: '/commissioner/departments',
  COMMISSIONER_BUDGET: '/commissioner/budget',
  COMMISSIONER_WELFARE: '/commissioner/welfare',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_USERS_CREATE: '/admin/users/create',
  ADMIN_CITIZENS: '/admin/citizens',
  ADMIN_GRIEVANCES: '/admin/grievances',
  ADMIN_CERTIFICATES: '/admin/certificates',
  ADMIN_PERMITS: '/admin/permits',
  ADMIN_WELFARE: '/admin/welfare',
  ADMIN_BENEFICIARIES: '/admin/beneficiaries',
  ADMIN_BUDGETS: '/admin/budgets',
  ADMIN_ALLOCATIONS: '/admin/allocations',
  ADMIN_EXPENSES: '/admin/expenses',
  ADMIN_FUND_DISTRIBUTION: '/admin/fund-distribution',
  ADMIN_AUDIT: '/admin/audit',

  // Milestone 4 Analytics & Reporting
  ANALYTICS_EXECUTIVE: '/analytics',
  ANALYTICS_CITIZENS: '/analytics/citizens',
  ANALYTICS_GRIEVANCES: '/analytics/grievances',
  ANALYTICS_REVENUE: '/analytics/revenue',
  ANALYTICS_BUDGET: '/analytics/budget',
  ANALYTICS_DEPARTMENTS: '/analytics/departments',
  ANALYTICS_SATISFACTION: '/analytics/satisfaction',
};
