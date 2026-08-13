import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { FiRefreshCw, FiTrendingUp, FiUsers, FiDollarSign, FiAlertCircle, FiAward, FiFileText } from 'react-icons/fi';
import reportingApi from '../../services/reportingApi';
import { ExecutiveDashboardResponse } from '../../types/reporting.types';
import PageHeader from '../../components/ui/PageHeader';

export const ExecutiveDashboardPage: React.FC = () => {
  const [data, setData] = useState<ExecutiveDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportingApi.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch executive dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#0f3d64' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Consolidating City-Wide Analytics...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          {error || 'No dashboard data available'}
        </Typography>
        <Button variant="contained" startIcon={<FiRefreshCw />} onClick={fetchDashboardData} sx={{ backgroundColor: '#0f3d64' }}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <PageHeader
          title="Executive Governance Dashboard"
          subtitle="Consolidated high-level key performance metrics across municipal operations"
        />
        <Tooltip title="Refresh Dashboard Data">
          <IconButton onClick={fetchDashboardData} sx={{ mt: 1, backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}>
            <FiRefreshCw />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Citizens Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Demographics
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                  <FiUsers size={20} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f3d64', mb: 0.5 }}>
                {data.totalCitizens.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                {data.activeCitizens.toLocaleString()} Active Citizens
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Grievance Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Grievances Active
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#fef2f2', color: '#ef4444' }}>
                  <FiAlertCircle size={20} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#991b1b', mb: 0.5 }}>
                {data.totalActiveGrievances.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                {data.grievanceResolutionRate.toFixed(1)}% Resolution Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Revenue Collected
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                  <FiDollarSign size={20} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#065f46', mb: 0.5 }}>
                ₹{data.totalRevenueCollected.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Certificates & Permits
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Card */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Budget Utilized
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                  <FiTrendingUp size={20} />
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#b45309', mb: 0.5 }}>
                {data.budgetUtilizationPercentage.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                ₹{data.totalBudgetUtilized.toLocaleString('en-IN')} of ₹{data.totalBudgetAllocated.toLocaleString('en-IN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Operational Highlights */}
      <Grid container spacing={3}>
        {/* SLA & Service Oversight */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 3 }}>
                Service Delivery & Compliance
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    SLA Compliance Index
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                    {data.slaComplianceRate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={data.slaComplianceRate}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { backgroundColor: '#3b82f6' } }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    Citizen Satisfaction Index
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                    {data.averageCitizenSatisfaction.toFixed(1)} / 5.0
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={data.averageCitizenSatisfaction * 20}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Certificates Generated
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                    {data.totalCertificatesIssued.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Permits Authorized
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                    {data.totalPermitsIssued.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Welfare Program Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 3 }}>
                Welfare Program Statistics
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                  <FiAward size={28} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Active Beneficiaries Enrolled
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                    {data.totalActiveBeneficiaries.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                  <FiFileText size={28} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Welfare Disbursements (DBT)
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e3a8a' }}>
                    ₹{data.totalWelfareDisbursed.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>
        Dashboard reports compiled: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default ExecutiveDashboardPage;
