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
import { FiRefreshCw, FiUsers, FiMapPin, FiActivity } from 'react-icons/fi';
import reportingApi from '../../services/reportingApi';
import { CitizenReportResponse } from '../../types/reporting.types';
import PageHeader from '../../components/ui/PageHeader';

export const CitizenReportPage: React.FC = () => {
  const [data, setData] = useState<CitizenReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCitizenReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportingApi.getCitizenReport();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch citizen demographics report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizenReport();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#0f3d64' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Analyzing Citizen Demographics...
        </Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          {error || 'No citizen demographics report data available'}
        </Typography>
        <Button variant="contained" startIcon={<FiRefreshCw />} onClick={fetchCitizenReport} sx={{ backgroundColor: '#0f3d64' }}>
          Retry Loading
        </Button>
      </Box>
    );
  }

  const wardEntries = Object.entries(data.wardDistribution || {}).sort((a, b) => b[1] - a[1]);
  const maxWardCount = wardEntries.length > 0 ? Math.max(...wardEntries.map(e => e[1])) : 1;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <PageHeader
          title="Citizen Demographics & Registration Report"
          subtitle="Detailed breakdown of user registration status and residential ward distributions"
        />
        <Tooltip title="Refresh Demographic Data">
          <IconButton onClick={fetchCitizenReport} sx={{ mt: 1, backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}>
            <FiRefreshCw />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Highlights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Citizens */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                <FiUsers size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Total Registered Population
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                  {data.totalCitizens.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Citizens */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <FiActivity size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Active Profiles
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#065f46' }}>
                  {data.activeCitizens.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Inactive Citizens */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: 3, backgroundColor: '#fcf6f6', color: '#ef4444' }}>
                <FiUsers size={24} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Inactive/Pending Profiles
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#991b1b' }}>
                  {data.inactiveCitizens.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ward Distribution Visualizer */}
      <Card sx={{ boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiMapPin /> Municipal Ward Distribution
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {wardEntries.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
              No ward demographic data has been populated yet.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {wardEntries.map(([ward, count]) => {
                const pct = ((count / (data.totalCitizens || 1)) * 100).toFixed(1);
                const barWidth = `${(count / maxWardCount) * 100}%`;

                return (
                  <Box key={ward}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                        {ward}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 750, color: '#0f3d64' }}>
                          {count.toLocaleString()} Citizens
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                          ({pct}%)
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%', height: 12, backgroundColor: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          width: barWidth,
                          height: '100%',
                          backgroundColor: '#3b82f6',
                          borderRadius: 6,
                          transition: 'width 0.8s ease-out-in',
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8', fontWeight: 600, textAlign: 'right' }}>
        Demographics compiled: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Box>
  );
};

export default CitizenReportPage;
