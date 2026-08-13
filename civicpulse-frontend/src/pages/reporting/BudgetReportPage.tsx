import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
} from '@mui/material';
import { FiRefreshCw, FiDollarSign, FiActivity, FiBriefcase, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import reportingApi from '../../services/reportingApi';
import { BudgetReportResponse } from '../../types/reporting.types';
import PageHeader from '../../components/ui/PageHeader';

export const BudgetReportPage: React.FC = () => {
  const [data, setData] = useState<BudgetReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgetReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportingApi.getBudgetReport();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch budget performance report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetReport();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#0f3d64' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Analyzing Budgetary Disbursals...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          {error || 'No budget performance report data available'}
        </Typography>
        <Button variant="contained" startIcon={<FiRefreshCw />} onClick={fetchBudgetReport} sx={{ backgroundColor: '#0f3d64' }}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <PageHeader
          title="Budget Allocation & Welfare Disbursement Report"
          subtitle="Analysis of municipal fund utilization ratios and direct benefit transfer (DBT) disbursement statuses"
        />
        <Tooltip title="Refresh Budget Data">
          <IconButton onClick={fetchBudgetReport} sx={{ mt: 1, backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}>
            <FiRefreshCw />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Allocated */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <FiDollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total Allocated Budget
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                  ₹{data.totalAllocated.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Utilized */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                <FiActivity size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total Utilized Budget
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#b45309' }}>
                  ₹{data.totalUtilized.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <FiDollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Remaining Reserves
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                  ₹{data.totalRemaining.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* DBT Distributed */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fdf4ff', color: '#d946ef' }}>
                <FiBriefcase size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total DBT Disbursed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#a21caf' }}>
                  ₹{data.totalDistributedWelfare.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Utilization Rate Visualizer and DBT Status */}
      <Grid container spacing={3}>
        {/* Utilization Rate Progress */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 280 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                Budget Utilization Rate
              </Typography>
              <Divider sx={{ mb: 4 }} />

              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                  Overall Fund Utilization Rate
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 850, color: '#b45309' }}>
                  {data.utilizationPercentage.toFixed(1)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={data.utilizationPercentage}
                sx={{ height: 16, borderRadius: 8, backgroundColor: '#f1f5f9', mb: 4, '& .MuiLinearProgress-bar': { backgroundColor: '#f59e0b', borderRadius: 8 } }}
              />

              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5, fontWeight: 500 }}>
                This rate represents the percentage of allocated municipal funding utilized across department operational budgets, scheme allocations, and welfare disbursements.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* DBT Payment Statuses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 280 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                Welfare DBT Transaction Statuses
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Completed */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: '#ecfdf5' }}>
                  <Typography variant="body2" sx={{ fontWeight: 750, color: '#065f46', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiCheckCircle /> Completed Transactions
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#065f46' }}>
                    {data.completedPaymentsCount.toLocaleString()}
                  </Typography>
                </Box>

                {/* Pending */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: '#eff6ff' }}>
                  <Typography variant="body2" sx={{ fontWeight: 750, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiActivity /> Pending / In-Transit Disbursements
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e3a8a' }}>
                    {data.pendingPaymentsCount.toLocaleString()}
                  </Typography>
                </Box>

                {/* Failed */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: '#fef2f2' }}>
                  <Typography variant="body2" sx={{ fontWeight: 750, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiAlertTriangle /> Failed Payments
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#991b1b' }}>
                    {data.failedPaymentsCount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>
        Budget ledger compiled: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default BudgetReportPage;
