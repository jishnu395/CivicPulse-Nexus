import React from 'react';
import { Navigate } from 'react-router-dom';

export const CommissionerDashboard: React.FC = () => {
  return <Navigate to="/grievances" replace />;
};

export default CommissionerDashboard;
