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
import { FiRefreshCw, FiCheckCircle, FiStar, FiFileText, FiClock } from 'react-icons/fi';
import reportingApi from '../../services/reportingApi';
import { GrievanceReportResponse } from '../../types/reporting.types';
import PageHeader from '../../components/ui/PageHeader';

export const GrievanceReportPage: React.FC = () => {
  const [data, setData] = useState<GrievanceReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrievanceReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportingApi.getGrievanceReport();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch grievance performance report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievanceReport();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#0f3d64' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Analyzing Grievance Redressal Metrics...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          {error || 'No grievance performance report data available'}
        </Typography>
        <Button variant="contained" startIcon={<FiRefreshCw />} onClick={fetchGrievanceReport} sx={{ backgroundColor: '#0f3d64' }}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  // Visualizations for category and priority breakdown
  const categoryEntries = Object.entries(data.categoryBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = categoryEntries.length > 0 ? Math.max(...categoryEntries.map(e => e[1])) : 1;

  const priorityEntries = Object.entries(data.priorityBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxPriorityCount = priorityEntries.length > 0 ? Math.max(...priorityEntries.map(e => e[1])) : 1;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <PageHeader
          title="Grievance Redressal & SLA Performance Report"
          subtitle="Analysis of municipal citizen complaint resolution cycles and compliance indices"
        />
        <Tooltip title="Refresh Grievance Data">
          <IconButton onClick={fetchGrievanceReport} sx={{ mt: 1, backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}>
            <FiRefreshCw />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main KPI Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <FiFileText size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total Grievances Filed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                  {data.totalGrievances.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <FiCheckCircle size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  SLA Compliance Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                  {data.slaComplianceRate.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fef2f2', color: '#ef4444' }}>
                <FiClock size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Overdue / Escalated
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#991b1b' }}>
                  {data.overdue + data.escalated}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                <FiStar size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Satisfaction Rating
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#b45309' }}>
                  {data.averageSatisfactionRating > 0 ? `${data.averageSatisfactionRating.toFixed(1)}/5.0` : 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid containing Status Breakdown and Category Breakdown */}
      <Grid container spacing={3}>
        {/* Status Pipeline */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                Operational Pipeline
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Submitted', count: data.submitted, color: '#3b82f6' },
                  { label: 'Assigned', count: data.assigned, color: '#6366f1' },
                  { label: 'In Progress', count: data.inProgress, color: '#f59e0b' },
                  { label: 'Pending / Delayed', count: data.pending, color: '#e11d48' },
                  { label: 'Escalated', count: data.escalated, color: '#b91c1c' },
                  { label: 'Resolved & Closed', count: data.resolved + data.closed, color: '#10b981' },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: '#f8fafc' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                      {item.count.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Priority and Category Breakdowns */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Categories */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                    Category Breakdown
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {categoryEntries.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                      No categories registered yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {categoryEntries.map(([category, count]) => {
                        const barWidth = `${(count / maxCategoryCount) * 100}%`;
                        return (
                          <Box key={category}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>
                                {category}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64', fontSize: '0.8125rem' }}>
                                {count.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                              <Box sx={{ width: barWidth, height: '100%', backgroundColor: '#6366f1', borderRadius: 4 }} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Priorities */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 2 }}>
                    Priority Breakdown
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {priorityEntries.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
                      No priority values registered yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {priorityEntries.map(([priority, count]) => {
                        const barWidth = `${(count / maxPriorityCount) * 100}%`;
                        return (
                          <Box key={priority}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8125rem' }}>
                                {priority}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f3d64', fontSize: '0.8125rem' }}>
                                {count.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                              <Box sx={{ width: barWidth, height: '100%', backgroundColor: '#ec4899', borderRadius: 4 }} />
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
        </Grid>
      </Grid>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>
        Performance metrics compiled: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default GrievanceReportPage;
