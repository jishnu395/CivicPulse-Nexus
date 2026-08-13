import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiInfo, FiSend } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import welfareApi from '../../services/welfareApi';
import { SchemeResponse } from '../../types/welfare.types';

const WelfareSchemesPage: React.FC = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<SchemeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');

  // Selected scheme for details dialog
  const [selectedScheme, setSelectedScheme] = useState<SchemeResponse | null>(null);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await welfareApi.getAllSchemes();
      setSchemes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch welfare schemes');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['ALL', ...Array.from(new Set(schemes.map((s) => s.department)))];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.schemeName.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === 'ALL' || scheme.department === department;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return <LoadingState message="Loading welfare schemes..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchSchemes} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Welfare Schemes"
        subtitle="Explore active welfare programs and apply for eligibility-based benefits"
        breadcrumbs={[
          { label: 'Dashboard', path: '/citizen/dashboard' },
          { label: 'Welfare Schemes', path: '' },
        ]}
      />

      {/* Filters Section */}
      <Box
        sx={{
          mb: 4,
          p: 2.5,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          label="Search Schemes"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch color="#64748b" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          label="Filter by Department"
          size="small"
          sx={{ minWidth: 200 }}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <EmptyState
          title="No Schemes Found"
          description={
            search || department !== 'ALL'
              ? 'Try modifying your search or filter keywords'
              : 'Welfare schemes will appear here once published'
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredSchemes.map((scheme) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={scheme.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Chip
                      label={scheme.department}
                      size="small"
                      sx={{
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label={scheme.status}
                      size="small"
                      sx={{
                        backgroundColor: scheme.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: scheme.status === 'ACTIVE' ? '#15803d' : '#b91c1c',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', minHeight: 48, mt: 1 }}>
                    {scheme.schemeName}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#475569',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: 60,
                    }}
                  >
                    {scheme.description}
                  </Typography>

                  <Box
                    sx={{
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px dashed #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        BENEFIT AMOUNT
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                        ₹{scheme.benefitAmount.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<FiInfo />}
                    onClick={() => setSelectedScheme(scheme)}
                    sx={{ borderRadius: 1.5, textTransform: 'none' }}
                  >
                    Details
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    disabled={scheme.status !== 'ACTIVE'}
                    startIcon={<FiSend />}
                    onClick={() => navigate(`/welfare/apply/${scheme.id}`)}
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      backgroundColor: '#0f3d64',
                      '&:hover': { backgroundColor: '#0c3050' },
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Details Dialog */}
      <Dialog
        open={!!selectedScheme}
        onClose={() => setSelectedScheme(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        {selectedScheme && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>
              {selectedScheme.schemeName}
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 0.5 }}>
                  Department
                </Typography>
                <Typography variant="body2" sx={{ color: '#0f172a' }}>
                  {selectedScheme.department}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: '#0f172a', lineHeight: 1.6 }}>
                  {selectedScheme.description}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 0.5 }}>
                  Eligibility Criteria
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#334155', whiteSpace: 'pre-line' }}>
                    {selectedScheme.eligibilityCriteria}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 0.5 }}>
                    Benefit Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                    ₹{selectedScheme.benefitAmount.toLocaleString('en-IN')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 0.5 }}>
                    Duration
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                    {selectedScheme.startDate} to {selectedScheme.endDate}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedScheme(null)} sx={{ textTransform: 'none', borderRadius: 1.5 }}>
                Close
              </Button>
              <Button
                variant="contained"
                disabled={selectedScheme.status !== 'ACTIVE'}
                onClick={() => {
                  const id = selectedScheme.id;
                  setSelectedScheme(null);
                  navigate(`/welfare/apply/${id}`);
                }}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  backgroundColor: '#0f3d64',
                  '&:hover': { backgroundColor: '#0c3050' },
                }}
              >
                Apply Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WelfareSchemesPage;
