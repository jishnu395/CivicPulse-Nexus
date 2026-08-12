import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../auth/useAuth';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

// Layouts
import AppLayout from '../layouts/AppLayout';
import PublicLayout from '../layouts/PublicLayout';

// Public Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Milestone 1 Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CitizenProfilePage from '../pages/citizen/CitizenProfilePage';
import RaiseGrievancePage from '../pages/citizen/RaiseGrievancePage';
import GrievanceListPage from '../pages/grievance/GrievanceListPage';
import GrievanceDetailPage from '../pages/grievance/GrievanceDetailPage';
import CitizenListPage from '../pages/admin/CitizenListPage';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, getDashboardRoute } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path={ROUTES.HOME}
        element={
          isAuthenticated ? (
            <Navigate to={getDashboardRoute()} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      {/* Public Authentication routes */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
      </Route>

      {/* Authenticated Application routes (Milestone 1) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* CITIZEN Dashboard */}
        <Route
          path={ROUTES.CITIZEN_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />

        {/* CITIZEN Profile */}
        <Route
          path={ROUTES.CITIZEN_PROFILE}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenProfilePage />
            </RoleGuard>
          }
        />

        {/* CITIZEN Raise Grievance */}
        <Route
          path="/grievances/new"
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <RaiseGrievancePage />
            </RoleGuard>
          }
        />

        {/* SHARED Grievance List (Citizen & Staff) */}
        <Route
          path="/grievances"
          element={
            <RoleGuard allowedRoles={['CITIZEN', 'OFFICER', 'COMMISSIONER', 'ADMIN']}>
              <GrievanceListPage />
            </RoleGuard>
          }
        />

        {/* SHARED Grievance Details (Citizen & Staff) */}
        <Route
          path="/grievances/:id"
          element={
            <RoleGuard allowedRoles={['CITIZEN', 'OFFICER', 'COMMISSIONER', 'ADMIN']}>
              <GrievanceDetailPage />
            </RoleGuard>
          }
        />

        {/* STAFF Citizen Directory & Demographics (Officer, Commissioner, Admin) */}
        <Route
          path="/citizens"
          element={
            <RoleGuard allowedRoles={['OFFICER', 'COMMISSIONER', 'ADMIN']}>
              <CitizenListPage />
            </RoleGuard>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
