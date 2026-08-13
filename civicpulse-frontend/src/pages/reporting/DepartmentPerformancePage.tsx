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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
} from '@mui/material';
import { FiRefreshCw, FiAward, FiSmile, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import reportingApi from '../../services/reportingApi';
import { PerformanceReportResponse } from '../../types/reporting.types';
import PageHeader from '../../components/ui/PageHeader';

export const DepartmentPerformancePage: React.FC = () => {
  const [data, setData] = useState<PerformanceReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformanceReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportingApi.getPerformanceReport();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch department performance scorecards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceReport();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#0f3d64' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Calculating Department Performance Indices...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          {error || 'No performance scorecard data available'}
        </Typography>
        <Button variant="contained" startIcon={<FiRefreshCw />} onClick={fetchPerformanceReport} sx={{ backgroundColor: '#0f3d64' }}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <PageHeader
          title="Cross-Department Performance Scorecard"
          subtitle="Analysis of departmental efficiency, task resolution rates, SLA compliance, and collected revenue"
        />
        <Tooltip title="Refresh Scorecard Data">
          <IconButton onClick={fetchPerformanceReport} sx={{ mt: 1, backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}>
            <FiRefreshCw />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Overall SLA */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <FiAward size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Overall SLA Score
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                  {data.overallSlaScore.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Overall Satisfaction */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <FiSmile size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Citizen Satisfaction
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                  {data.overallCitizenSatisfaction > 0 ? `${data.overallCitizenSatisfaction.toFixed(1)}/5.0` : 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Resolution Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                <FiAlertCircle size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Resolution Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#b45309' }}>
                  {data.overallGrievanceResolutionRate.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Efficiency */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#faf5ff', color: '#a855f7' }}>
                <FiTrendingUp size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Budget Efficiency
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#6b21a8' }}>
                  {data.overallBudgetEfficiency.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Scorecard Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <CardContent sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64' }}>
            Department Scorecards
          </Typography>
        </CardContent>
        <Divider />
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Department Name</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Total Tasks</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Resolution Rate</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>SLA Compliance</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Revenue Collected</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Performance Index</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.departmentScorecards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#64748b', fontWeight: 500 }}>
                  No department performance records found.
                </TableCell>
              </TableRow>
            ) : (
              data.departmentScorecards.map((dept) => (
                <TableRow key={dept.departmentName} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: '#0f3d64' }}>{dept.departmentName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>{dept.totalTasks.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{dept.resolutionRate.toFixed(1)}%</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{dept.slaComplianceRate.toFixed(1)}%</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#059669' }}>₹{dept.revenueCollected.toLocaleString('en-IN')}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, dept.performanceScore)}
                          sx={{ height: 6, borderRadius: 3, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { backgroundColor: '#10b981' } }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                        {dept.performanceScore.toFixed(0)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>
        Performance metrics compiled: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default DepartmentPerformancePage;
