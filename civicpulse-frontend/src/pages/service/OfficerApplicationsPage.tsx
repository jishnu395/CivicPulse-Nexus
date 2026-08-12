import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DownloadIcon from '@mui/icons-material/Download';
import FolderIcon from '@mui/icons-material/Folder';
import { certificateApi } from '../../services/certificateApi';
import { Application, DocumentResponse, ApplicationStatus } from '../../types/certificate.types';
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
    case 'CERTIFICATE_GENERATED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

export const OfficerApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Inspection & Documents modal
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Verification modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verificationRemarks, setVerificationRemarks] = useState('All supporting documents verified and authentic.');
  const [verificationPassed, setVerificationPassed] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Approval/Rejection modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [isRejectAction, setIsRejectAction] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('Approved by competent municipal authority.');

  // Preview Dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewAppId, setPreviewAppId] = useState<number | null>(null);
  const [previewAppNo, setPreviewAppNo] = useState<string>('');
  const [previewIsCert, setPreviewIsCert] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificateApi.getPendingApplications();
      setApplications(data || []);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to load pending applications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocs = async (app: Application) => {
    setSelectedApp(app);
    setDocsModalOpen(true);
    setLoadingDocs(true);
    try {
      const docs = await certificateApi.getOfficerDocuments(app.id);
      setDocuments(docs || []);
    } catch {
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleOpenVerify = (app: Application) => {
    setSelectedApp(app);
    setVerificationRemarks('All supporting documents verified and authentic.');
    setVerificationPassed(true);
    setVerifyModalOpen(true);
  };

  const handleExecuteVerification = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      await certificateApi.verifyApplication(selectedApp.id, {
        remarks: verificationRemarks,
        verified: verificationPassed,
      });
      setActionSuccess(`Application ${selectedApp.applicationNo} marked as ${verificationPassed ? 'VERIFIED' : 'NEEDS CORRECTION'}`);
      setVerifyModalOpen(false);
      fetchPending();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenApproval = (app: Application, reject = false) => {
    setSelectedApp(app);
    setIsRejectAction(reject);
    setApprovalRemarks(
      reject
        ? 'Application rejected due to insufficient documentation.'
        : 'Approved by competent municipal authority.'
    );
    setApprovalModalOpen(true);
  };

  const handleExecuteApproval = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      if (isRejectAction) {
        await certificateApi.rejectApplication(selectedApp.id, {
          remarks: approvalRemarks,
        });
        setActionSuccess(`Application ${selectedApp.applicationNo} REJECTED.`);
      } else {
        await certificateApi.approveApplication(selectedApp.id, {
          remarks: approvalRemarks,
        });
        setActionSuccess(`Application ${selectedApp.applicationNo} APPROVED!`);
      }
      setApprovalModalOpen(false);
      fetchPending();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Approval/Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerate = async (app: Application) => {
    setActionLoading(true);
    try {
      if (app.certificateType) {
        await certificateApi.generateCertificate(app.id);
        setActionSuccess(`Certificate successfully generated for application ${app.applicationNo}!`);
      } else {
        await certificateApi.generatePermit(app.id);
        setActionSuccess(`Permit successfully generated for application ${app.applicationNo}!`);
      }
      fetchPending();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Document generation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePreview = (app: Application) => {
    setPreviewAppId(app.id);
    setPreviewAppNo(app.applicationNo);
    setPreviewIsCert(!!app.certificateType);
    setPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Officer Verification & Approval Workbench
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review submitted citizen applications, inspect documents, execute verification, approve, and generate digitally signed certificates.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={fetchPending} disabled={loading}>
          Refresh Queue
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            No Pending Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All submitted citizen certificate and permit applications have been verified and processed.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Application No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Citizen ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submitted On</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Officer Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const serviceName = (app.certificateType || app.permitType || 'Application')
                  .replace(/_/g, ' ');

                return (
                  <TableRow key={app.id} hover>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                      {app.applicationNo}
                    </TableCell>
                    <TableCell>{app.citizenId}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {serviceName}
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
                        {/* Inspect Documents */}
                        <Tooltip title="Inspect Documents">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDocs(app)}
                          >
                            <FolderIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* Verify Application */}
                        {app.status === 'SUBMITTED' || app.status === 'UNDER_VERIFICATION' ? (
                          <Tooltip title="Verify Application & Documents">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenVerify(app)}
                            >
                              <VerifiedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {/* Approve */}
                        {app.status === 'VERIFIED' ? (
                          <Tooltip title="Approve Application">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenApproval(app, false)}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {/* Reject */}
                        {app.status !== 'APPROVED' &&
                        app.status !== 'CERTIFICATE_GENERATED' &&
                        app.status !== 'REJECTED' ? (
                          <Tooltip title="Reject Application">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleOpenApproval(app, true)}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {/* Generate Document */}
                        {app.status === 'APPROVED' ? (
                          <Tooltip title="Generate Official Certificate / Permit">
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              startIcon={<AutoFixHighIcon />}
                              onClick={() => handleGenerate(app)}
                              disabled={actionLoading}
                            >
                              Generate
                            </Button>
                          </Tooltip>
                        ) : null}

                        {/* View Generated */}
                        {app.status === 'CERTIFICATE_GENERATED' ? (
                          <Tooltip title="View & Download Official Document">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handlePreview(app)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Inspect Documents Modal */}
      <Dialog open={docsModalOpen} onClose={() => setDocsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FolderIcon color="primary" />
          Supporting Documents: {selectedApp?.applicationNo}
        </DialogTitle>
        <DialogContent dividers>
          {loadingDocs ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : documents.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
              No supporting documents attached to this application.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Document Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Format</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{doc.documentName}</TableCell>
                    <TableCell>{doc.fileType || 'PDF'}</TableCell>
                    <TableCell>{doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : '-'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={doc.verificationStatus}
                        color={doc.verificationStatus === 'VERIFIED' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{doc.remarks || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Verify Application Dialog */}
      <Dialog open={verifyModalOpen} onClose={() => setVerifyModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VerifiedIcon color="primary" />
          Verify Application: {selectedApp?.applicationNo}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={verificationPassed}
                  onChange={(e) => setVerificationPassed(e.target.checked)}
                  color="success"
                />
              }
              label={
                verificationPassed
                  ? 'Verification Passed (Ready for Approval)'
                  : 'Verification Incomplete (Needs Correction)'
              }
            />
          </Box>
          <TextField
            fullWidth
            required
            multiline
            rows={3}
            label="Verification Officer Remarks"
            value={verificationRemarks}
            onChange={(e) => setVerificationRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExecuteVerification}
            disabled={actionLoading || !verificationRemarks.trim()}
          >
            {actionLoading ? 'Saving...' : 'Submit Verification'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval / Rejection Dialog */}
      <Dialog open={approvalModalOpen} onClose={() => setApprovalModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isRejectAction ? <CancelIcon color="error" /> : <CheckCircleIcon color="success" />}
          {isRejectAction ? 'Reject Application' : 'Approve Application'}: {selectedApp?.applicationNo}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isRejectAction
              ? 'Are you sure you want to reject this application? Provide specific reason in remarks.'
              : 'Approve this application and authorize official certificate/permit generation.'}
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            rows={3}
            label="Decision Remarks"
            value={approvalRemarks}
            onChange={(e) => setApprovalRemarks(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color={isRejectAction ? 'error' : 'success'}
            onClick={handleExecuteApproval}
            disabled={actionLoading || !approvalRemarks.trim()}
          >
            {actionLoading ? 'Processing...' : isRejectAction ? 'Confirm Rejection' : 'Authorize Approval'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <CertificatePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        applicationId={previewAppId}
        applicationNo={previewAppNo}
        isCertificate={previewIsCert}
      />
    </Box>
  );
};
