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
};
