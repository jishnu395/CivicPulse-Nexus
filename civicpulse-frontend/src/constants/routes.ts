export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',

  // Citizen routes (Milestone 1)
  CITIZEN_DASHBOARD: '/citizen/dashboard',
  CITIZEN_PROFILE: '/citizen/profile',
  CITIZEN_GRIEVANCES: '/grievances',
  CITIZEN_RAISE_GRIEVANCE: '/grievances/new',
  CITIZEN_GRIEVANCE_DETAILS: '/grievances/:id',

  // Citizen routes (Milestone 2 - Certificates & Permits)
  SERVICE_APPLY: '/services/apply',
  SERVICE_APPLICATIONS: '/services/applications',
  SERVICE_APPLICATION_DETAILS: '/services/applications/:id',

  // Staff routes (Milestone 1 & 2)
  STAFF_GRIEVANCES: '/grievances',
  STAFF_GRIEVANCE_DETAILS: '/grievances/:id',
  STAFF_CITIZENS: '/citizens',
  STAFF_APPLICATIONS: '/staff/applications',

  // Milestone 3 Routes
  WELFARE_SCHEMES: '/welfare/schemes',
  WELFARE_APPLY: '/welfare/apply/:schemeId',
  WELFARE_APPLICATIONS: '/welfare/applications',
  WELFARE_MANAGEMENT: '/welfare/management',
  BUDGET_DASHBOARD: '/budget',
  EXPENSES: '/expenses',
  FUND_DISTRIBUTIONS: '/fund-distributions',
  AUDIT_LOGS: '/audit',

  // Milestone 4 Routes (Reporting & Governance Analytics)
  REPORTING_DASHBOARD: '/reports/dashboard',
  REPORTING_CITIZENS: '/reports/citizens',
  REPORTING_GRIEVANCES: '/reports/grievances',
  REPORTING_REVENUE: '/reports/revenue',
  REPORTING_BUDGET: '/reports/budget',
  REPORTING_PERFORMANCE: '/reports/performance',
};
