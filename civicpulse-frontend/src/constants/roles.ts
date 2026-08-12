import { UserRole } from '../types/auth.types';

export const ROLES: Record<UserRole, UserRole> = {
  CITIZEN: 'CITIZEN',
  OFFICER: 'OFFICER',
  COMMISSIONER: 'COMMISSIONER',
  ADMIN: 'ADMIN',
};

export const ROLE_NAMES: Record<UserRole, string> = {
  CITIZEN: 'Citizen',
  OFFICER: 'Municipal Officer',
  COMMISSIONER: 'Commissioner',
  ADMIN: 'Administrator',
};
