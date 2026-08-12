import React from 'react';
import { Navigate } from 'react-router-dom';

export const OfficerDashboard: React.FC = () => {
  return <Navigate to="/grievances" replace />;
};

export default OfficerDashboard;
