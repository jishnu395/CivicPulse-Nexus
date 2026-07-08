import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import RegisterCitizen from "../pages/RegisterCitizen";
import CitizenList from "../pages/CitizenList";
import RegisterGrievance from "../pages/RegisterGrievance";
import GrievanceList from "../pages/GrievanceList";
import GrievanceHistory from "../pages/GrievanceHistory";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/citizens/register" element={<RegisterCitizen />} />
      <Route path="/citizens" element={<CitizenList />} />
      <Route path="/grievances/register" element={<RegisterGrievance />} />
      <Route path="/grievances" element={<GrievanceList />} />
      <Route path="/grievances/:id/history" element={<GrievanceHistory />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}