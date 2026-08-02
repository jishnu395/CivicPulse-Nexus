import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";

import AdminDashboard from "../DashboardLayout/AdminDashboard";
import CommissionerDashboard from "../DashboardLayout/CommissionerDashboard";
import OfficerDashboard from "../DashboardLayout/OfficerDashboard";
import CitizenDashboard from "../DashboardLayout/CitizenDashboard";
import ApprovalDashboard from "../DashboardLayout/ApprovalDashboard";

import ProtectedRoute from "../components/ProtectedRoute";

import RegisterCitizen from "../pages/RegisterCitizen";
import CitizenList from "../pages/CitizenList";

import RegisterGrievance from "../pages/RegisterGrievance";
import GrievanceList from "../pages/GrievanceList";
import MyGrievances from "../pages/MyGrievances";
import GrievanceHistory from "../pages/GrievanceHistory";

import ApplyCertificate from "../pages/ApplyCertificate";
import MyApplications from "../pages/MyApplications";
import UploadDocument from "../pages/UploadDocument";
import TrackApplication from "../pages/TrackApplication";
import PendingApplications from "../pages/PendingApplications";
import Verification from "../pages/Verification";
import Approval from "../pages/Approval";

import ApplyPermit from "../pages/ApplyPermit";
import MyPermits from "../pages/MyPermits";

import WelfareSchemeList from "../pages/WelfareSchemeList";
import WelfareApplicationList from "../pages/WelfareApplicationList";
import BeneficiaryList from "../pages/BeneficiaryList";

import BudgetList from "../pages/BudgetList";
import BudgetAllocationList from "../pages/BudgetAllocationList";
import ExpenseList from "../pages/ExpenseList";

import FundDistributionList from "../pages/FundDistributionList";

import AnalyticsDashboard from "../pages/AnalyticsDashboard";
import AuditList from "../pages/AuditList";

export default function AppRoutes() {
    return (
        <Routes>

            {/* Login */}

            <Route path="/" element={<Login />} />

            {/* ================= ADMIN ================= */}

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/welfare-schemes"
                element={
                    <ProtectedRoute>
                        <WelfareSchemeList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/welfare-applications"
                element={
                    <ProtectedRoute>
                        <WelfareApplicationList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/beneficiaries"
                element={
                    <ProtectedRoute>
                        <BeneficiaryList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/budgets"
                element={
                    <ProtectedRoute>
                        <BudgetList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/budget-allocation"
                element={
                    <ProtectedRoute>
                        <BudgetAllocationList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/expenses"
                element={
                    <ProtectedRoute>
                        <ExpenseList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/fund-distributions"
                element={
                    <ProtectedRoute>
                        <FundDistributionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <AnalyticsDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/audit"
                element={
                    <ProtectedRoute>
                        <AuditList />
                    </ProtectedRoute>
                }
            />

            {/* ================= COMMISSIONER ================= */}

            <Route
                path="/commissioner/dashboard"
                element={
                    <ProtectedRoute>
                        <CommissionerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ================= OFFICER ================= */}

            <Route
                path="/officer/dashboard"
                element={
                    <ProtectedRoute>
                        <OfficerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ================= APPROVAL ================= */}

            <Route
                path="/approval/dashboard"
                element={
                    <ProtectedRoute>
                        <ApprovalDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/pending-applications"
                element={
                    <ProtectedRoute>
                        <PendingApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/verification/:id"
                element={
                    <ProtectedRoute>
                        <Verification />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/approval/:id"
                element={
                    <ProtectedRoute>
                        <Approval />
                    </ProtectedRoute>
                }
            />

                        {/* ================= CITIZEN ================= */}

            <Route
                path="/citizen/dashboard"
                element={
                    <ProtectedRoute>
                        <CitizenDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/citizens"
                element={
                    <ProtectedRoute>
                        <CitizenList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/citizens/register"
                element={
                    <ProtectedRoute>
                        <RegisterCitizen />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-applications"
                element={
                    <ProtectedRoute>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/upload-document/:applicationId"
                element={
                    <ProtectedRoute>
                        <UploadDocument />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/track-application/:applicationId"
                element={
                    <ProtectedRoute>
                        <TrackApplication />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/apply-certificate"
                element={
                    <ProtectedRoute>
                        <ApplyCertificate />
                    </ProtectedRoute>
                }
            />

            {/* ================= GRIEVANCES ================= */}

            <Route
                path="/grievances"
                element={
                    <ProtectedRoute>
                        <GrievanceList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/grievances/register"
                element={
                    <ProtectedRoute>
                        <RegisterGrievance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-grievances"
                element={
                    <ProtectedRoute>
                        <MyGrievances />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/grievances/:id/history"
                element={
                    <ProtectedRoute>
                        <GrievanceHistory />
                    </ProtectedRoute>
                }
            />

            {/* ================= PERMITS ================= */}

            <Route
                path="/apply-permit"
                element={
                    <ProtectedRoute>
                        <ApplyPermit />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my-permits"
                element={
                    <ProtectedRoute>
                        <MyPermits />
                    </ProtectedRoute>
                }
            />

            {/* ================= FALLBACK ================= */}

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}