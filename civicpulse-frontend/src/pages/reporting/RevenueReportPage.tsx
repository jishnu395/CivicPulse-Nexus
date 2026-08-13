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
} from '@mui/material';
import { FiRefreshCw, FiDollarSign, FiCreditCard, FiAward, FiCheckCircle } from 'react-icons/fi';
import reportingApi from '../../services/reportingApi';
import { RevenueReportResponse } from '../../types/reporting.types';
import PageHeader from '../../components/ui/PageHeader';

export const RevenueReportPage: React.FC = () => {
  const [data, setData] = useState<RevenueReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportingApi.getRevenueReport();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch revenue collections report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueReport();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#0f3d64' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Calculating Revenue Collections...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          {error || 'No revenue report data available'}
        </Typography>
        <Button variant="contained" startIcon={<FiRefreshCw />} onClick={fetchRevenueReport} sx={{ backgroundColor: '#0f3d64' }}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  const deptRevenueEntries = Object.entries(data.revenueByDepartment || {}).sort((a, b) => b[1] - a[1]);
  const maxDeptRevenue = deptRevenueEntries.length > 0 ? Math.max(...deptRevenueEntries.map(e => e[1])) : 1;

  const deptAppEntries = Object.entries(data.applicationsByDepartment || {}).sort((a, b) => b[1] - a[1]);
  const maxDeptApp = deptAppEntries.length > 0 ? Math.max(...deptAppEntries.map(e => e[1])) : 1;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <PageHeader
          title="Municipal Revenue & Collections Report"
          subtitle="Consolidated analysis of fee collections across municipal certificates, permits, and licensing departments"
        />
        <Tooltip title="Refresh Revenue Data">
          <IconButton onClick={fetchRevenueReport} sx={{ mt: 1, backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}>
            <FiRefreshCw />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main KPI Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Revenue */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <FiDollarSign size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total Collected Revenue
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                  ₹{data.totalRevenue.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions Count */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <FiCreditCard size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total Transactions
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                  {data.totalTransactions.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Certificates Issued */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#faf5ff', color: '#a855f7' }}>
                <FiAward size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Certificates Authorized
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#6b21a8' }}>
                  {data.certificatesIssued.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Permits Issued */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                <FiCheckCircle size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Permits Authorized
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#b45309' }}>
                  {data.permitsIssued.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid containing Revenue by Department & Application distribution */}
      <Grid container spacing={3}>
        {/* Revenue by Department */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 340 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                Revenue Collection by Department
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {deptRevenueEntries.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 6 }}>
                  No revenue collections have been logged across departments yet.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {deptRevenueEntries.map(([dept, rev]) => {
                    const barWidth = `${(rev / maxDeptRevenue) * 100}%`;
                    return (
                      <Box key={dept}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                            {dept}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                            ₹{rev.toLocaleString('en-IN')}
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                          <Box sx={{ width: barWidth, height: '100%', backgroundColor: '#10b981', borderRadius: 5 }} />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Applications by Department */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 340 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                Applications Registered by Department
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {deptAppEntries.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 6 }}>
                  No applications have been logged across departments yet.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {deptAppEntries.map(([dept, count]) => {
                    const barWidth = `${(count / maxDeptApp) * 100}%`;
                    return (
                      <Box key={dept}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                            {dept}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                            {count.toLocaleString()} Applications
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' }}>
                          <Box sx={{ width: barWidth, height: '100%', backgroundColor: '#3b82f6', borderRadius: 5 }} />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>
        Financial ledger compiled: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default RevenueReportPage;
