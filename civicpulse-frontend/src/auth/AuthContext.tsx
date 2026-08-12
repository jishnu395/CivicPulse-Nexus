import { createContext } from 'react';
import { User, UserRole, LoginRequest, LoginResponse } from '../types/auth.types';
import { Citizen } from '../types/citizen.types';

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  role: UserRole | null;
  citizenProfile: Citizen | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  setCitizenProfile: (profile: Citizen | null) => void;
  refreshCitizenProfile?: () => Promise<void>;
  getDashboardRoute: () => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
