import React from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/ui/MetricCard';
import { FiUsers, FiShield, FiDollarSign, FiActivity } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="System Administration & Executive Control"
        subtitle="Full operational management of users, citizen records, services, welfare, finance, and system audit logs."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="User Management"
            value="Staff & Roles"
            subtitle="Provision Officer, Commissioner, Admin"
            icon={<FiUsers />}
            color="#0284c7"
            onClick={() => navigate(ROUTES.ADMIN_USERS)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Citizen Directory"
            value="Registry"
            subtitle="Verified citizen profiles"
            icon={<FiShield />}
            color="#10b981"
            onClick={() => navigate(ROUTES.ADMIN_CITIZENS)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Budget & Finance"
            value="Control"
            subtitle="Allocations and fund tracking"
            icon={<FiDollarSign />}
            color="#f59e0b"
            onClick={() => navigate(ROUTES.ADMIN_BUDGETS)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="System Audit"
            value="Logs"
            subtitle="Security and transaction audit trail"
            icon={<FiActivity />}
            color="#8b5cf6"
            onClick={() => navigate(ROUTES.ADMIN_AUDIT)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
