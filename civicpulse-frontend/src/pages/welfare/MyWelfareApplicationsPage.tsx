import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiEye } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusChip } from '../../components/status/StatusChip';
import { useAuth } from '../../auth/useAuth';
import welfareApi from '../../services/welfareApi';
import budgetApi from '../../services/budgetApi';
import { WelfareApplicationResponse, BeneficiaryResponse } from '../../types/welfare.types';
import { FundDistributionResponse } from '../../types/budget.types';

const MyWelfareApplicationsPage: React.FC = () => {
  const { citizenProfile } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<WelfareApplicationResponse[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryResponse[]>([]);
  const [distributions, setDistributions] = useState<FundDistributionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected details modal
  const [selectedApp, setSelectedApp] = useState<WelfareApplicationResponse | null>(null);

  useEffect(() => {
    if (citizenProfile?.id) {
      fetchData();
    }
  }, [citizenProfile]);

  const fetchData = async () => {
    if (!citizenProfile?.id) return;
    try {
      setLoading(true);
      setError(null);
      
      const appsData = await welfareApi.getMyApplications(citizenProfile.id);
      setApplications(appsData);

      try {
        const benData = await welfareApi.getBeneficiariesByCitizen(citizenProfile.id);
        setBeneficiaries(benData);
      } catch (e) {
        console.warn('Could not load beneficiary data', e);
      }

      try {
        const distData = await budgetApi.getDistributionsByCitizen(citizenProfile.id);
        setDistributions(distData);
      } catch (e) {
        console.warn('Could not load distributions data', e);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to fetch your welfare applications');
    } finally {
      setLoading(false);
    }
  };

  const getMatchDetails = (schemeId: number) => {
    const isBeneficiary = beneficiaries.some((b) => b.schemeId === schemeId);
    const payment = distributions.find((d) => d.schemeId === schemeId);
    return { isBeneficiary, payment };
  };

  if (!citizenProfile) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          Citizen profile is required to view welfare applications.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return <LoadingState message="Loading your welfare applications..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="My Welfare Applications"
        subtitle="Track status and disbursement updates of your welfare scheme applications"
        actions={
          <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={fetchData}>
            Refresh
          </Button>
        }
      />

      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          description="You haven't submitted any welfare applications yet."
          actionText="Browse Schemes"
          onAction={() => navigate('/welfare/schemes')}
        />
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Application ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Scheme Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Submission Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Application Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Enrollment / Fund Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const date = new Date(app.applicationDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                
                const { isBeneficiary, payment } = getMatchDetails(app.schemeId);

                return (
                  <TableRow key={app.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                      APP-{app.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{app.schemeName}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{date}</TableCell>
                    <TableCell>
                      <StatusChip status={app.status} />
                    </TableCell>
                    <TableCell>
                      {app.status === 'APPROVED' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <StatusChip status={isBeneficiary ? 'ACTIVE' : 'APPROVED'} />
                          {payment && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                Payment:
                              </Typography>
                              <StatusChip status={payment.paymentStatus} size="small" />
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => setSelectedApp(app)}>
                        <FiEye />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details Dialog */}
      <Dialog
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        {selectedApp && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0f172a' }}>
              Application Detailed Status
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    APPLICATION ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    APP-{selectedApp.id.toString().padStart(4, '0')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    SCHEME NAME
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {selectedApp.schemeName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    SUBMISSION DATE
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155' }}>
                    {new Date(selectedApp.applicationDate).toLocaleString('en-IN')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    CURRENT STATUS
                  </Typography>
                  <StatusChip status={selectedApp.status} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    OFFICER REMARKS
                  </Typography>
                  <Box
                    sx={{
                      p: 1.5,
                      backgroundColor: '#f8fafc',
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      minHeight: 60,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#334155' }}>
                      {selectedApp.remarks || 'No remarks provided yet.'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Additional Benefit Card if Approved */}
                {selectedApp.status === 'APPROVED' && (
                  <Grid size={{ xs: 12 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2, borderColor: '#d1fae5', backgroundColor: '#f0fdf4' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#14532d', fontWeight: 700, mb: 1 }}>
                          Beneficiary & Fund Status
                        </Typography>
                        {beneficiaries.find((b) => b.schemeId === selectedApp.schemeId) ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#166534' }}>
                              ✔ Enrolled officially in the beneficiary database.
                            </Typography>
                            {distributions.find((d) => d.schemeId === selectedApp.schemeId) && (
                              <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                                Fund Status: {distributions.find((d) => d.schemeId === selectedApp.schemeId)?.paymentStatus}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#b45309' }}>
                            ⚠ Awaiting final beneficiary registry enrollment.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedApp(null)} sx={{ textTransform: 'none', borderRadius: 1.5 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MyWelfareApplicationsPage;
