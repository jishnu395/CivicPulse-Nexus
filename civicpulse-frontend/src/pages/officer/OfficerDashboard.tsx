import React from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/ui/MetricCard';
import { FiAlertCircle, FiCheckSquare, FiClock, FiHeart } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Municipal Officer Workstation"
        subtitle="Review assigned grievances, process service verifications, and manage approvals."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Assigned Tickets"
            value="Active"
            subtitle="Grievances awaiting review"
            icon={<FiAlertCircle />}
            color="#0284c7"
            onClick={() => navigate(ROUTES.OFFICER_GRIEVANCES_ASSIGNED)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Pending Queue"
            value="Verification"
            subtitle="Citizen certificate & permit applications"
            icon={<FiCheckSquare />}
            color="#10b981"
            onClick={() => navigate(ROUTES.OFFICER_APPLICATIONS_VERIFICATION)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="SLA Compliance"
            value="Active"
            subtitle="Escalations and priority tickets"
            icon={<FiClock />}
            color="#f59e0b"
            onClick={() => navigate(ROUTES.OFFICER_GRIEVANCES_SLA)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Welfare Queue"
            value="Benefits"
            subtitle="Scheme application reviews"
            icon={<FiHeart />}
            color="#8b5cf6"
            onClick={() => navigate(ROUTES.OFFICER_WELFARE_APPLICATIONS)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfficerDashboard;
