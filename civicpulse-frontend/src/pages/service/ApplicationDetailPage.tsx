import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { certificateApi } from '../../services/certificateApi';
import { Application, DocumentResponse, ApplicationStatus, VerificationStatus } from '../../types/certificate.types';
import { CertificatePreviewDialog } from '../../components/service/CertificatePreviewDialog';

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case 'SUBMITTED':
      return 'info';
    case 'UNDER_VERIFICATION':
      return 'warning';
    case 'VERIFIED':
      return 'primary';
    case 'APPROVED':
    case 'CERTIFICATE_GENERATED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

const getVerificationStatusChip = (status: VerificationStatus) => {
  switch (status) {
    case 'VERIFIED':
      return <Chip size="small" icon={<VerifiedIcon />} label="Verified" color="success" />;
    case 'NEEDS_CORRECTION':
      return <Chip size="small" icon={<WarningAmberIcon />} label="Correction Required" color="warning" />;
    case 'PENDING':
    default:
      return <Chip size="small" icon={<PendingIcon />} label="Pending Verification" color="default" />;
  }
};

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Preview Dialog state
  const [previewOpen, setPreviewOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const appId = Number(id);
      const appData = await certificateApi.getApplicationById(appId);
      setApplication(appData);

      const docsData = await certificateApi.getDocumentsByApplication(appId);
      setDocuments(docsData || []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !application?.id) return;
    const file = e.target.files[0];
    setUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      await certificateApi.uploadDocument(application.id, file);
      setUploadSuccess(`Document '${file.name}' uploaded successfully!`);
      const updatedDocs = await certificateApi.getDocumentsByApplication(application.id);
      setDocuments(updatedDocs || []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await certificateApi.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !application) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services/applications')}>
          Back to Applications
        </Button>
      </Box>
    );
  }

  if (!application) return null;

  const isCert = !!application.certificateType;
  const serviceName = (application.certificateType || application.permitType || 'Service Application')
    .replace(/_/g, ' ');
  const canDownload =
    application.status === 'APPROVED' || application.status === 'CERTIFICATE_GENERATED';

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/services/applications')}
        sx={{ mb: 2 }}
      >
        Back to Applications
      </Button>

      {/* Header Banner */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
              APPLICATION DETAILS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {application.applicationNo}
            </Typography>
            <Typography variant="subtitle1" color="primary" sx={{ textTransform: 'capitalize' }}>
              {serviceName} ({isCert ? 'Certificate' : 'Permit / License'})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={application.status.replace(/_/g, ' ')}
              color={getStatusColor(application.status)}
              sx={{ fontWeight: 'bold', fontSize: '0.9rem', py: 2, px: 1 }}
            />
            {canDownload && (
              <Button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={() => setPreviewOpen(true)}
              >
                View & Download Document
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {uploadSuccess}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Application Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Application Overview
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Application Number:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{application.applicationNo}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Citizen ID:</Typography>
                <Typography variant="body2">{application.citizenId}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Department:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{application.department}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Submission Date:</Typography>
                <Typography variant="body2">{new Date(application.submissionDate).toLocaleString()}</Typography>
              </Box>

              {application.approvalDate && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">Approval Date:</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {new Date(application.approvalDate).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow State */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Verification & Approval Lifecycle
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ py: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Current Stage:</Typography>
                <Chip
                  label={application.status.replace(/_/g, ' ')}
                  color={getStatusColor(application.status)}
                  size="small"
                />
              </Box>

              <Box sx={{ py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {application.status === 'SUBMITTED' &&
                    'Your application is waiting for officer assignment and document verification.'}
                  {application.status === 'UNDER_VERIFICATION' &&
                    'A verification officer is currently reviewing your uploaded documents.'}
                  {application.status === 'VERIFIED' &&
                    'Your documents have been verified and forwarded for administrative approval.'}
                  {application.status === 'APPROVED' &&
                    'Application approved! The official certificate/permit is being generated.'}
                  {application.status === 'CERTIFICATE_GENERATED' &&
                    'Official certificate/permit with cryptographic digital signature is ready for download.'}
                  {application.status === 'REJECTED' &&
                    'Application was rejected by the approving authority. Please check officer remarks.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Supporting Documents Section */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Uploaded Supporting Documents
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Verification documents uploaded for this application.
                </Typography>
              </Box>

              {application.status !== 'APPROVED' && application.status !== 'CERTIFICATE_GENERATED' && (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={uploading ? <CircularProgress size={18} /> : <CloudUploadIcon />}
                  disabled={uploading}
                  size="small"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </Button>
              )}
            </Box>

            {documents.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#fcfcfc', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  No supporting documents uploaded yet.
                </Typography>
              </Box>
            ) : (
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Document Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Format</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Verification Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} hover>
                      <TableCell sx={{ fontWeight: 'medium' }}>{doc.documentName}</TableCell>
                      <TableCell>{doc.fileType || 'PDF'}</TableCell>
                      <TableCell>
                        {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                      </TableCell>
                      <TableCell>{getVerificationStatusChip(doc.verificationStatus)}</TableCell>
                      <TableCell>{doc.remarks || '-'}</TableCell>
                      <TableCell align="right">
                        {application.status !== 'APPROVED' &&
                          application.status !== 'CERTIFICATE_GENERATED' && (
                            <Tooltip title="Delete Document">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <CertificatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        applicationId={application.id}
        applicationNo={application.applicationNo}
        isCertificate={isCert}
      />
    </Box>
  );
};
