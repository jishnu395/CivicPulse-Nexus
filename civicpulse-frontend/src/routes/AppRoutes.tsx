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

// Milestone 2 Pages
import { ApplyServicePage } from '../pages/service/ApplyServicePage';
import { MyApplicationsPage } from '../pages/service/MyApplicationsPage';
import { ApplicationDetailPage } from '../pages/service/ApplicationDetailPage';
import { OfficerApplicationsPage } from '../pages/service/OfficerApplicationsPage';

// Milestone 3 Pages
import WelfareSchemesPage from '../pages/welfare/WelfareSchemesPage';
import ApplyWelfarePage from '../pages/welfare/ApplyWelfarePage';
import MyWelfareApplicationsPage from '../pages/welfare/MyWelfareApplicationsPage';
import WelfareManagementPage from '../pages/welfare/WelfareManagementPage';
import BudgetDashboardPage from '../pages/budget/BudgetDashboardPage';
import ExpenseManagementPage from '../pages/budget/ExpenseManagementPage';
import FundDistributionPage from '../pages/budget/FundDistributionPage';
import AuditLogsPage from '../pages/budget/AuditLogsPage';

// Milestone 4 Pages
import ExecutiveDashboardPage from '../pages/reporting/ExecutiveDashboardPage';
import CitizenReportPage from '../pages/reporting/CitizenReportPage';
import GrievanceReportPage from '../pages/reporting/GrievanceReportPage';
import RevenueReportPage from '../pages/reporting/RevenueReportPage';
import BudgetReportPage from '../pages/reporting/BudgetReportPage';
import DepartmentPerformancePage from '../pages/reporting/DepartmentPerformancePage';

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

      {/* Authenticated Application routes (Milestones 1 & 2) */}
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

        {/* CITIZEN Milestone 2: Apply for Certificate / Permit */}
        <Route
          path={ROUTES.SERVICE_APPLY}
          element={
            <RoleGuard allowedRoles={['CITIZEN', 'ADMIN']}>
              <ApplyServicePage />
            </RoleGuard>
          }
        />

        {/* CITIZEN Milestone 2: My Applications */}
        <Route
          path={ROUTES.SERVICE_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['CITIZEN', 'ADMIN']}>
              <MyApplicationsPage />
            </RoleGuard>
          }
        />

        {/* SHARED Milestone 2: Application Details */}
        <Route
          path={ROUTES.SERVICE_APPLICATION_DETAILS}
          element={
            <RoleGuard allowedRoles={['CITIZEN', 'OFFICER', 'COMMISSIONER', 'ADMIN']}>
              <ApplicationDetailPage />
            </RoleGuard>
          }
        />

        {/* STAFF Milestone 2: Officer Verification & Approval Workbench */}
        <Route
          path={ROUTES.STAFF_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'COMMISSIONER', 'ADMIN']}>
              <OfficerApplicationsPage />
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

        {/* CITIZEN Milestone 3: Welfare Schemes Catalog */}
        <Route
          path={ROUTES.WELFARE_SCHEMES}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <WelfareSchemesPage />
            </RoleGuard>
          }
        />

        {/* CITIZEN Milestone 3: Apply for Welfare Scheme */}
        <Route
          path={ROUTES.WELFARE_APPLY}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <ApplyWelfarePage />
            </RoleGuard>
          }
        />

        {/* CITIZEN Milestone 3: My Welfare Applications */}
        <Route
          path={ROUTES.WELFARE_APPLICATIONS}
          element={
            <RoleGuard allowedRoles={['CITIZEN']}>
              <MyWelfareApplicationsPage />
            </RoleGuard>
          }
        />

        {/* STAFF Milestone 3: Welfare Schemes & Application Workbench */}
        <Route
          path={ROUTES.WELFARE_MANAGEMENT}
          element={
            <RoleGuard allowedRoles={['OFFICER', 'COMMISSIONER', 'ADMIN']}>
              <WelfareManagementPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 3: Budget Dashboard */}
        <Route
          path={ROUTES.BUDGET_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <BudgetDashboardPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 3: Expense Management */}
        <Route
          path={ROUTES.EXPENSES}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExpenseManagementPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 3: Fund Distribution */}
        <Route
          path={ROUTES.FUND_DISTRIBUTIONS}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <FundDistributionPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 3: Financial Audit Logs */}
        <Route
          path={ROUTES.AUDIT_LOGS}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <AuditLogsPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 4: Executive Dashboard */}
        <Route
          path={ROUTES.REPORTING_DASHBOARD}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <ExecutiveDashboardPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 4: Citizen Report */}
        <Route
          path={ROUTES.REPORTING_CITIZENS}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <CitizenReportPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 4: Grievance Report */}
        <Route
          path={ROUTES.REPORTING_GRIEVANCES}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <GrievanceReportPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 4: Revenue Report */}
        <Route
          path={ROUTES.REPORTING_REVENUE}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <RevenueReportPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 4: Budget Report */}
        <Route
          path={ROUTES.REPORTING_BUDGET}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <BudgetReportPage />
            </RoleGuard>
          }
        />

        {/* COMMISSIONER / ADMIN Milestone 4: Department Performance */}
        <Route
          path={ROUTES.REPORTING_PERFORMANCE}
          element={
            <RoleGuard allowedRoles={['COMMISSIONER', 'ADMIN']}>
              <DepartmentPerformancePage />
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
