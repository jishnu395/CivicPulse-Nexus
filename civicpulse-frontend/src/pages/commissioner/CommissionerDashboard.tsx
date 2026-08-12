import React from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/ui/MetricCard';
import { FiTrendingUp, FiAlertCircle, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export const CommissionerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Commissioner Governance Dashboard"
        subtitle="Executive oversight of city-wide operations, department SLA compliance, and budget efficiency."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="City Grievances"
            value="Oversight"
            subtitle="Resolution velocity & satisfaction"
            icon={<FiAlertCircle />}
            color="#0284c7"
            onClick={() => navigate(ROUTES.COMMISSIONER_GRIEVANCES_MONITORING)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Departments"
            value="Scorecards"
            subtitle="Cross-department performance"
            icon={<FiTrendingUp />}
            color="#10b981"
            onClick={() => navigate(ROUTES.COMMISSIONER_DEPARTMENT_PERFORMANCE)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Budget Utilization"
            value="Fiscal"
            subtitle="Municipal fund distributions"
            icon={<FiDollarSign />}
            color="#f59e0b"
            onClick={() => navigate(ROUTES.COMMISSIONER_BUDGET)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Executive Reports"
            value="Analytics"
            subtitle="Milestone 4 governance analytics"
            icon={<FiBarChart2 />}
            color="#8b5cf6"
            onClick={() => navigate(ROUTES.ANALYTICS_EXECUTIVE)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommissionerDashboard;
