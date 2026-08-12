export type UserRole = 'CITIZEN' | 'OFFICER' | 'COMMISSIONER' | 'ADMIN';

export interface User {
  id: string | number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  enabled?: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: User;
  role?: UserRole;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  message?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
