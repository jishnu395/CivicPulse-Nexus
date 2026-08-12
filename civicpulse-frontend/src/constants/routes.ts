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

  // Staff routes (Milestone 1)
  STAFF_GRIEVANCES: '/grievances',
  STAFF_GRIEVANCE_DETAILS: '/grievances/:id',
  STAFF_CITIZENS: '/citizens',
};
