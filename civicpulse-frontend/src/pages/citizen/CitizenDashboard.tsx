import React from 'react';
import { Box, Grid, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/ui/MetricCard';
import { FiAlertCircle, FiFileText, FiHeart, FiPlus } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export const CitizenDashboard: React.FC = () => {
  const { user, citizenProfile } = useAuth();
  const navigate = useNavigate();

  const citizenName = citizenProfile
    ? `${citizenProfile.firstName} ${citizenProfile.lastName}`
    : user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Citizen';

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${citizenName}`}
        subtitle="Manage your civic requests, service applications, and welfare schemes."
        actions={
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => navigate(ROUTES.CITIZEN_RAISE_GRIEVANCE)}
            sx={{ backgroundColor: '#0f3d64', '&:hover': { backgroundColor: '#1e5d94' } }}
          >
            Raise Grievance
          </Button>
        }
      />

      {/* Quick Action Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #0f3d64 0%, #1e5d94 100%)',
          color: '#ffffff',
          borderRadius: 3,
        }}
      >
        <Box sx={{ maxWidth: 650 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
            Municipal Smart Services at Your Fingertips
          </Typography>
          <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 2.5 }}>
            Apply for digital certificates, construction permits, track grievance resolutions, or verify welfare eligibility in real-time.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(ROUTES.CITIZEN_CERTIFICATES)}
              sx={{ backgroundColor: '#ffffff', color: '#0f3d64', fontWeight: 700, '&:hover': { backgroundColor: '#f1f5f9' } }}
            >
              Apply for Certificate
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(ROUTES.CITIZEN_WELFARE)}
              sx={{ color: '#ffffff', borderColor: '#ffffff', fontWeight: 600, '&:hover': { borderColor: '#e2e8f0', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Browse Welfare Schemes
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Key Metric Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="My Grievances"
            value="Active"
            subtitle="Track live resolution & SLA"
            icon={<FiAlertCircle />}
            color="#0284c7"
            onClick={() => navigate(ROUTES.CITIZEN_GRIEVANCES)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="My Applications"
            value="Services"
            subtitle="Certificates & Permits"
            icon={<FiFileText />}
            color="#10b981"
            onClick={() => navigate(ROUTES.CITIZEN_APPLICATIONS)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MetricCard
            title="Welfare Schemes"
            value="Benefits"
            subtitle="Enrolled citizen schemes"
            icon={<FiHeart />}
            color="#f59e0b"
            onClick={() => navigate(ROUTES.CITIZEN_WELFARE)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CitizenDashboard;
