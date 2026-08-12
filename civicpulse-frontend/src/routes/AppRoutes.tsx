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

// Dashboards
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import OfficerDashboard from '../pages/officer/OfficerDashboard';
import CommissionerDashboard from '../pages/commissioner/CommissionerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ExecutiveDashboardPage from '../pages/reports/ExecutiveDashboardPage';

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

      {/* Authenticated Application routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* CITIZEN Routes */}
        <Route
          path={ROUTES.CITIZEN_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_PROFILE}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_GRIEVANCES}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_RAISE_GRIEVANCE}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_CERTIFICATES}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_PERMITS}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.CITIZEN_WELFARE}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <CitizenDashboard />
            </RoleGuard>
          }
        />

        {/* OFFICER Routes */}
        <Route
          path={ROUTES.OFFICER_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_GRIEVANCES_ASSIGNED}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_GRIEVANCES_PENDING}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_GRIEVANCES_SLA}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_GRIEVANCES_ESCALATED}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_APPLICATIONS_VERIFICATION}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_APPLICATIONS_APPROVALS}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_WELFARE_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_WELFARE_BENEFICIARIES}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.OFFICER_FUND_DISTRIBUTION}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'ADMIN']}>
              <OfficerDashboard />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER Routes */}
        <Route
          path={ROUTES.COMMISSIONER_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CommissionerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.COMMISSIONER_GRIEVANCES_MONITORING}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CommissionerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.COMMISSIONER_GRIEVANCES_SLA}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CommissionerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.COMMISSIONER_DEPARTMENT_PERFORMANCE}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CommissionerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.COMMISSIONER_BUDGET}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CommissionerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.COMMISSIONER_WELFARE}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CommissionerDashboard />
            </RoleGuard>
          }
        />

        {/* ADMIN Routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_CITIZENS}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_GRIEVANCES}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_CERTIFICATES}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_PERMITS}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_WELFARE}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_BUDGETS}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_ALLOCATIONS}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_EXPENSES}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_FUND_DISTRIBUTION}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ADMIN_AUDIT}
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleGuard>
          }
        />

        {/* Milestone 4 Analytics Routes */}
        <Route
          path={ROUTES.ANALYTICS_EXECUTIVE}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_CITIZENS}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_GRIEVANCES}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_REVENUE}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_BUDGET}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_DEPARTMENTS}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />
        <Route
          path={ROUTES.ANALYTICS_SATISFACTION}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
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
