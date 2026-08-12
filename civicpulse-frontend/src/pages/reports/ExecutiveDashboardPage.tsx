import React from 'react';
import { Box, Typography } from '@mui/material';
import PageHeader from '../../components/ui/PageHeader';

export const ExecutiveDashboardPage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Executive Governance Analytics"
        subtitle="Consolidated Milestone 4 analytics across citizen demographics, grievances, municipal revenue, and budgets."
      />
      <Typography variant="body1" sx={{ color: '#64748b' }}>
        Milestone 4 Analytics Dashboard loaded.
      </Typography>
    </Box>
  );
};

export default ExecutiveDashboardPage;
