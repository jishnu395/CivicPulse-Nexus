import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';
import { User, UserRole, LoginRequest, LoginResponse } from '../types/auth.types';
import { Citizen } from '../types/citizen.types';
import { authApi } from '../services/authApi';
import { ROUTES } from '../constants/routes';
import apiClient from '../services/api/client';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub?: string;
  email?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
  roles?: string[];
  role?: string;
  exp?: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [role, setRole] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem('role');
    return (savedRole as UserRole) || null;
  });
  const [citizenProfile, setCitizenProfile] = useState<Citizen | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to extract clean role
  const normalizeRole = (rawRole: string | undefined): UserRole => {
    if (!rawRole) return 'CITIZEN';
    const clean = rawRole.replace('ROLE_', '').toUpperCase();
    if (['CITIZEN', 'OFFICER', 'COMMISSIONER', 'ADMIN'].includes(clean)) {
      return clean as UserRole;
    }
    return 'CITIZEN';
  };

  // Helper to get dashboard path by role
  const getDashboardRouteForRole = useCallback((userRole: UserRole | null): string => {
    switch (userRole) {
      case 'CITIZEN':
        return ROUTES.CITIZEN_DASHBOARD;
      case 'OFFICER':
      case 'COMMISSIONER':
      case 'ADMIN':
        return '/grievances';
      default:
        return ROUTES.LOGIN;
    }
  }, []);

  // Fetch citizen profile if citizen (supports userId or email fallback)
  const fetchCitizenProfile = useCallback(async (userId?: string | number, email?: string) => {
    try {
      let endpoint = '';
      if (userId !== undefined && userId !== null && String(userId).trim() !== '') {
        endpoint = `/api/citizens/user/${userId}`;
      } else if (email && email.trim() !== '') {
        endpoint = `/api/citizens/email/${encodeURIComponent(email.trim())}`;
      } else {
        setCitizenProfile(null);
        return;
      }

      const response = await apiClient.get<Citizen>(endpoint);
      if (response.data) {
        setCitizenProfile(response.data);
      }
    } catch {
      // Citizen profile might not be completed yet
      setCitizenProfile(null);
    }
  }, []);

  const refreshCitizenProfile = useCallback(async () => {
    if (user?.id || user?.email) {
      await fetchCitizenProfile(user.id, user.email);
    }
  }, [user, fetchCitizenProfile]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          // Check expiration
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            let userRole: UserRole = 'CITIZEN';
            if (decoded.roles && decoded.roles.length > 0) {
              userRole = normalizeRole(decoded.roles[0]);
            } else if (decoded.role) {
              userRole = normalizeRole(decoded.role);
            } else if (decoded.realm_access?.roles) {
              const matched = decoded.realm_access.roles.find((r) =>
                ['CITIZEN', 'OFFICER', 'COMMISSIONER', 'ADMIN', 'ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_COMMISSIONER', 'ROLE_ADMIN'].includes(r)
              );
              if (matched) userRole = normalizeRole(matched);
            }

            if (!role) {
              setRole(userRole);
              localStorage.setItem('role', userRole);
            }

            if ((user?.id || user?.email) && userRole === 'CITIZEN') {
              await fetchCitizenProfile(user.id, user.email);
            }
          }
        } catch {
          // Token decode issue
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [user, role, fetchCitizenProfile]);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);

      const token = data.accessToken;
      let detectedRole: UserRole = 'CITIZEN';

      if (data.role) {
        detectedRole = normalizeRole(data.role);
      } else if (data.user?.role) {
        detectedRole = normalizeRole(data.user.role);
      } else if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.roles && decoded.roles.length > 0) {
            detectedRole = normalizeRole(decoded.roles[0]);
          } else if (decoded.role) {
            detectedRole = normalizeRole(decoded.role);
          } else if (decoded.realm_access?.roles) {
            const matched = decoded.realm_access.roles.find((r) =>
              ['CITIZEN', 'OFFICER', 'COMMISSIONER', 'ADMIN', 'ROLE_CITIZEN', 'ROLE_OFFICER', 'ROLE_COMMISSIONER', 'ROLE_ADMIN'].includes(r)
            );
            if (matched) detectedRole = normalizeRole(matched);
          }
        } catch {
          // Ignore
        }
      }

      const newUser: User = data.user || { id: '', email: credentials.email, role: detectedRole };

      setAccessToken(token);
      setRefreshToken(data.refreshToken || null);
      setUser(newUser);
      setRole(detectedRole);

      localStorage.setItem('accessToken', token);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('role', detectedRole);

      if (detectedRole === 'CITIZEN') {
        await fetchCitizenProfile(newUser.id, credentials.email);
      }

      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setRole(null);
    setCitizenProfile(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const contextValue: AuthContextType = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      role,
      citizenProfile,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout,
      setCitizenProfile,
      refreshCitizenProfile,
      getDashboardRoute: () => getDashboardRouteForRole(role),
    }),
    [accessToken, refreshToken, user, role, citizenProfile, isLoading, refreshCitizenProfile, getDashboardRouteForRole]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
