import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";

import AdminDashboard from "../DashboardLayout/AdminDashboard";
import CommissionerDashboard from "../DashboardLayout/CommissionerDashboard";
import OfficerDashboard from "../DashboardLayout/OfficerDashboard";
import CitizenDashboard from "../DashboardLayout/CitizenDashboard";

import RegisterCitizen from "../pages/RegisterCitizen";
import CitizenList from "../pages/CitizenList";
import RegisterGrievance from "../pages/RegisterGrievance";
import GrievanceList from "../pages/GrievanceList";
import GrievanceHistory from "../pages/GrievanceHistory";

import ProtectedRoute from "../components/ProtectedRoute";
import MyGrievances from "../pages/MyGrievances";

export default function AppRoutes() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            {/* ADMIN */}

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* COMMISSIONER */}

            <Route
                path="/commissioner/dashboard"
                element={
                    <ProtectedRoute>
                        <CommissionerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* OFFICER */}

            <Route
                path="/officer/dashboard"
                element={
                    <ProtectedRoute>
                        <OfficerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* CITIZEN */}

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
                path="/grievances"
                element={
                    <ProtectedRoute>
                        <GrievanceList />
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
                path="/grievances/register"
                element={
                    <ProtectedRoute>
                        <RegisterGrievance />
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

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>

    );

}