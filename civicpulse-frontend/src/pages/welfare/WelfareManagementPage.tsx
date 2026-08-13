import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
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
  TextField,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiRefreshCw, FiUserPlus, FiLayers } from 'react-icons/fi';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import { StatusChip } from '../../components/status/StatusChip';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import welfareApi from '../../services/welfareApi';
import { SchemeResponse, WelfareApplicationResponse, BeneficiaryResponse, SchemeStatus } from '../../types/welfare.types';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const WelfareManagementPage: React.FC = () => {
  const { role } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Data states
  const [schemes, setSchemes] = useState<SchemeResponse[]>([]);
  const [applications, setApplications] = useState<WelfareApplicationResponse[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog States
  const [schemeDialogOpen, setSchemeDialogOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<SchemeResponse | null>(null);
  
  // Rejection Remarks Dialog
  const [rejectAppId, setRejectAppId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState('');

  // Scheme Form Fields
  const [schemeName, setSchemeName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [benefitAmount, setBenefitAmount] = useState<number>(0);
  const [status, setStatus] = useState<SchemeStatus>('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const schemesData = await welfareApi.getAllSchemes();
      setSchemes(schemesData);

      const appsData = await welfareApi.getPendingApplications();
      setApplications(appsData);

      const benData = await welfareApi.getAllBeneficiaries();
      setBeneficiaries(benData);

    } catch (err: any) {
      setError(err.message || 'Failed to retrieve management data');
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (benefitAmount <= 0) {
      toast.error('Benefit amount must be greater than zero');
      return;
    }

    try {
      if (editingScheme) {
        await welfareApi.updateScheme(editingScheme.id, {
          schemeName,
          description,
          department,
          eligibilityCriteria,
          benefitAmount,
          status,
          startDate,
          endDate,
        });
        toast.success('Scheme updated successfully');
      } else {
        await welfareApi.createScheme({
          schemeName,
          description,
          department,
          eligibilityCriteria,
          benefitAmount,
          status,
          startDate,
          endDate,
        });
        toast.success('Scheme created successfully');
      }
      setSchemeDialogOpen(false);
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save scheme');
    }
  };

  const openCreateScheme = () => {
    setEditingScheme(null);
    setSchemeName('');
    setDescription('');
    setDepartment('');
    setEligibilityCriteria('');
    setBenefitAmount(0);
    setStatus('ACTIVE');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setSchemeDialogOpen(true);
  };

  const openEditScheme = (scheme: SchemeResponse) => {
    setEditingScheme(scheme);
    setSchemeName(scheme.schemeName);
    setDescription(scheme.description);
    setDepartment(scheme.department);
    setEligibilityCriteria(scheme.eligibilityCriteria);
    setBenefitAmount(scheme.benefitAmount);
    setStatus(scheme.status);
    setStartDate(scheme.startDate);
    setEndDate(scheme.endDate);
    setSchemeDialogOpen(true);
  };

  const handleDeleteScheme = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this welfare scheme?')) return;
    try {
      await welfareApi.deleteScheme(id);
      toast.success('Scheme deleted successfully');
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete scheme');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await welfareApi.approveApplication(id);
      toast.success('Application approved successfully');
      
      // Auto register the beneficiary database enrollment
      try {
        await welfareApi.registerBeneficiary(id);
        toast.info('Beneficiary registered successfully');
      } catch (benErr: any) {
        console.warn('Manual beneficiary registration required', benErr);
      }

      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve application');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectAppId) return;
    if (!remarks.trim()) {
      toast.error('Rejection remarks are required');
      return;
    }
    try {
      await welfareApi.rejectApplication(rejectAppId, remarks);
      toast.success('Application rejected');
      setRejectAppId(null);
      setRemarks('');
      loadAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject application');
    }
  };



  if (loading) {
    return <LoadingState message="Loading welfare management dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAllData} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Welfare Management"
        subtitle="Manage municipal welfare schemes, verify eligibility applications, and register beneficiaries"
        actions={
          <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={loadAllData}>
            Refresh
          </Button>
        }
      />

      <Paper sx={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 3, p: 1 }} elevation={0}>
        <Tabs
          value={tabValue}
          onChange={(_, val) => setTabValue(val)}
          sx={{
            borderBottom: '1px solid #f1f5f9',
            px: 2,
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.9rem' },
          }}
        >
          <Tab label="Welfare Schemes" icon={<FiLayers style={{ marginRight: 8 }} />} iconPosition="start" />
          <Tab
            label={`Pending Applications (${applications.length})`}
            icon={<FiCheck style={{ marginRight: 8 }} />}
            iconPosition="start"
          />
          <Tab label="Enrolled Beneficiaries" icon={<FiUserPlus style={{ marginRight: 8 }} />} iconPosition="start" />
        </Tabs>

        {/* Tab 1: Schemes Management */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Published Schemes
            </Typography>
            {(role === 'ADMIN' || role === 'COMMISSIONER') && (
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={openCreateScheme}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  backgroundColor: '#0f3d64',
                  '&:hover': { backgroundColor: '#0c3050' },
                }}
              >
                Create Scheme
              </Button>
            )}
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, mx: 2, width: 'calc(100% - 32px)' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Scheme Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Benefit Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schemes.map((scheme) => (
                  <TableRow key={scheme.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{scheme.schemeName}</TableCell>
                    <TableCell>{scheme.department}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f3d64' }}>
                      ₹{scheme.benefitAmount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>{scheme.startDate}</TableCell>
                    <TableCell>{scheme.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={scheme.status}
                        size="small"
                        sx={{
                          backgroundColor: scheme.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                          color: scheme.status === 'ACTIVE' ? '#15803d' : '#b91c1c',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {(role === 'ADMIN' || role === 'COMMISSIONER') && (
                        <IconButton size="small" color="primary" onClick={() => openEditScheme(scheme)}>
                          <FiEdit />
                        </IconButton>
                      )}
                      {role === 'ADMIN' && (
                        <IconButton size="small" color="error" onClick={() => handleDeleteScheme(scheme.id)}>
                          <FiTrash2 />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Pending Applications */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 2 }}>
            {applications.length === 0 ? (
              <EmptyState title="No Pending Applications" description="There are no applications awaiting review." />
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>App ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Citizen ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Scheme Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Submitted Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Review Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>APP-{app.id.toString().padStart(4, '0')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>CZN-{app.citizenId}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{app.schemeName}</TableCell>
                        <TableCell>{new Date(app.applicationDate).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>
                          <StatusChip status={app.status} />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<FiCheck />}
                            onClick={() => handleApprove(app.id)}
                            sx={{ mr: 1, textTransform: 'none', borderRadius: 1.5 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            startIcon={<FiX />}
                            onClick={() => setRejectAppId(app.id)}
                            sx={{ textTransform: 'none', borderRadius: 1.5 }}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        {/* Tab 3: Enrolled Beneficiaries */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 2 }}>
            {beneficiaries.length === 0 ? (
              <EmptyState title="No Enrolled Beneficiaries" description="Beneficiaries will appear here once applications are approved." />
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Beneficiary ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Citizen ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Scheme Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Benefit Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Enrollment Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Enrollment Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {beneficiaries.map((ben) => (
                      <TableRow key={ben.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>BEN-{ben.id.toString().padStart(4, '0')}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>CZN-{ben.citizenId}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{ben.schemeName}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#15803d' }}>
                          ₹{ben.benefitAmount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>{ben.enrollmentDate}</TableCell>
                        <TableCell>
                          <StatusChip status={ben.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Scheme Form Dialog */}
      <Dialog open={schemeDialogOpen} onClose={() => setSchemeDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSchemeSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editingScheme ? 'Edit Welfare Scheme' : 'Create Welfare Scheme'}
          </DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Scheme Name"
              required
              fullWidth
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
            />

            <TextField
              label="Description"
              required
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Department"
                  required
                  fullWidth
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Benefit Amount (₹)"
                  type="number"
                  required
                  fullWidth
                  value={benefitAmount}
                  onChange={(e) => setBenefitAmount(parseFloat(e.target.value) || 0)}
                />
              </Grid>
            </Grid>

            <TextField
              label="Eligibility Criteria"
              required
              multiline
              rows={3}
              fullWidth
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              placeholder="Detail eligibility conditions (e.g. Annual Income < ₹2,00,000, Age > 60)"
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  required
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="End Date"
                  type="date"
                  required
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SchemeStatus)}
              fullWidth
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSchemeDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f3d64' }}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Reject Application Remarks Dialog */}
      <Dialog open={!!rejectAppId} onClose={() => setRejectAppId(null)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Welfare Application</DialogTitle>
        <DialogContent sx={{ minWidth: 360, pt: 1 }}>
          <TextField
            label="Rejection Remarks / Reason"
            required
            multiline
            rows={3}
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Explain why this applicant is ineligible..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectAppId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRejectSubmit}>
            Reject Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WelfareManagementPage;
