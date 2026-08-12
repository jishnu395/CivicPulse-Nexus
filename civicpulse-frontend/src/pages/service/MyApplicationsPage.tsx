import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useAuth } from '../../auth/useAuth';
import { citizenApi } from '../../services/citizenApi';
import { certificateApi } from '../../services/certificateApi';
import { Application, ApplicationStatus } from '../../types/certificate.types';
import { CertificatePreviewDialog } from '../../components/service/CertificatePreviewDialog';

const getStatusChipColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'SUBMITTED':
      return 'info';
    case 'UNDER_VERIFICATION':
      return 'warning';
    case 'VERIFIED':
      return 'primary';
    case 'APPROVED':
      return 'success';
    case 'CERTIFICATE_GENERATED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

export const MyApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preview Dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [selectedAppNo, setSelectedAppNo] = useState<string>('');
  const [isCertificate, setIsCertificate] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const profile = await citizenApi.getCitizenByUserId(Number(user.id));
      if (profile?.id) {
        const data = await certificateApi.getMyApplications(profile.id);
        setApplications(data || []);
      } else {
        setApplications([]);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPreview = (app: Application) => {
    setSelectedAppId(app.id);
    setSelectedAppNo(app.applicationNo);
    setIsCertificate(!!app.certificateType);
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            My Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track certificate and permit applications, upload documents, and download issued records.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/services/apply')}
        >
          Apply New Service
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={fetchApplications}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <AssignmentTurnedInIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Applications Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You have not submitted any certificate or permit applications yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/services/apply')}
          >
            Apply for Certificate or Permit
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Application No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submitted On</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const serviceName = (app.certificateType || app.permitType || 'Application')
                  .replace(/_/g, ' ');
                const isCert = !!app.certificateType;
                const canDownload =
                  app.status === 'APPROVED' || app.status === 'CERTIFICATE_GENERATED';

                return (
                  <TableRow key={app.id} hover>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {app.applicationNo}
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {serviceName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={isCert ? 'Certificate' : 'Permit / License'}
                        color={isCert ? 'default' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{app.department}</TableCell>
                    <TableCell>
                      {new Date(app.submissionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={app.status.replace(/_/g, ' ')}
                        color={getStatusChipColor(app.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="View Application Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/services/applications/${app.id}`)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {canDownload && (
                          <Tooltip title="View & Download Official Document">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenPreview(app)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Reusable Certificate Preview & Download Modal */}
      <CertificatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        applicationId={selectedAppId}
        applicationNo={selectedAppNo}
        isCertificate={isCertificate}
      />
    </Box>
  );
};
