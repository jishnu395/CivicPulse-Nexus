import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import DescriptionIcon from '@mui/icons-material/Description';
import { certificateApi } from '../../services/certificateApi';
import { Certificate, Permit } from '../../types/certificate.types';

interface CertificatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  applicationId: number | null;
  applicationNo?: string;
  isCertificate: boolean;
}

export const CertificatePreviewDialog: React.FC<CertificatePreviewDialogProps> = ({
  open,
  onClose,
  applicationId,
  applicationNo,
  isCertificate,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Certificate | Permit | null>(null);

  const loadDocumentDetails = useCallback(async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);
    try {
      if (isCertificate) {
        const cert = await certificateApi.getCertificate(applicationId);
        setData(cert);
      } else {
        const permit = await certificateApi.getPermit(applicationId);
        setData(permit);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to load document details');
    } finally {
      setLoading(false);
    }
  }, [applicationId, isCertificate]);

  useEffect(() => {
    if (open && applicationId) {
      loadDocumentDetails();
    } else {
      setData(null);
      setError(null);
    }
  }, [open, applicationId, loadDocumentDetails]);

  const handleDownload = async () => {
    if (!applicationId) return;
    setDownloading(true);
    try {
      const blob = isCertificate
        ? await certificateApi.downloadCertificate(applicationId)
        : await certificateApi.downloadPermit(applicationId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${isCertificate ? 'Certificate' : 'Permit'}_${applicationNo || applicationId}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const docNo = data
    ? isCertificate
      ? (data as Certificate).certificateNo
      : (data as Permit).permitNo
    : '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DescriptionIcon color="primary" />
        {isCertificate ? 'Official Certificate' : 'Official Permit / License'}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : data ? (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '2px solid #1976d2',
              background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 100%)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                GOVERNMENT OF CIVICPULSE NEXUS
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {isCertificate ? 'CERTIFICATE OF RECORD' : 'MUNICIPAL PERMIT & LICENSE'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Application Ref: {applicationNo || applicationId}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Document Number:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {docNo}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Issue Timestamp:
              </Typography>
              <Typography variant="body2">
                {new Date(data.issueDate).toLocaleString()}
              </Typography>
            </Box>

            {data.digitalSignature && (
              <Box
                sx={{
                  mt: 2.5,
                  p: 1.5,
                  backgroundColor: '#f1f8e9',
                  borderRadius: 1.5,
                  border: '1px solid #aed581',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <VerifiedIcon color="success" />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>
                    Digital Signature:
                  </Typography>
                  <Typography variant="caption" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontWeight: 'medium' }}>
                    {data.digitalSignature}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No document generated yet.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        {data && (
          <Button
            variant="contained"
            color="primary"
            startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download Official PDF'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
