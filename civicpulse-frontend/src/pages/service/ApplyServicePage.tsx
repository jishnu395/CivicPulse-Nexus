import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useAuth } from '../../auth/useAuth';
import { citizenApi } from '../../services/citizenApi';
import { certificateApi } from '../../services/certificateApi';
import { CertificateType, PermitType } from '../../types/certificate.types';

const CERTIFICATE_OPTIONS: { value: CertificateType; label: string; desc: string }[] = [
  {
    value: 'BIRTH_CERTIFICATE',
    label: 'Birth Certificate',
    desc: 'Official registration of birth with municipal records.',
  },
  {
    value: 'DEATH_CERTIFICATE',
    label: 'Death Certificate',
    desc: 'Official record of death for estate and legal processing.',
  },
  {
    value: 'INCOME_CERTIFICATE',
    label: 'Income Certificate',
    desc: 'Proof of annual household income for subsidies and schemes.',
  },
  {
    value: 'RESIDENCE_CERTIFICATE',
    label: 'Residence / Domicile Certificate',
    desc: 'Proof of permanent residency in the municipal ward.',
  },
  {
    value: 'MARRIAGE_CERTIFICATE',
    label: 'Marriage Certificate',
    desc: 'Legal registration and validation of solemnized marriage.',
  },
];

const PERMIT_OPTIONS: { value: PermitType; label: string; desc: string }[] = [
  {
    value: 'TRADE_LICENSE',
    label: 'Trade License',
    desc: 'Municipal authorization to carry out commercial trades.',
  },
  {
    value: 'SHOP_LICENSE',
    label: 'Shop & Commercial Establishment License',
    desc: 'License to operate a shop, store, or commercial premise.',
  },
  {
    value: 'BUILDING_PERMIT',
    label: 'Building / Construction Permit',
    desc: 'Approval for architectural plans and structural construction.',
  },
  {
    value: 'WATER_CONNECTION_PERMIT',
    label: 'Municipal Water Connection Permit',
    desc: 'Sanction for new domestic or commercial water pipeline connection.',
  },
];

export const ApplyServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [citizenId, setCitizenId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [serviceCategory, setServiceCategory] = useState<'CERTIFICATE' | 'PERMIT'>('CERTIFICATE');
  const [certificateType, setCertificateType] = useState<CertificateType>('BIRTH_CERTIFICATE');
  const [permitType, setPermitType] = useState<PermitType>('TRADE_LICENSE');

  const [supportingFile, setSupportingFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCitizenProfile();
  }, [user]);

  const fetchCitizenProfile = async () => {
    if (!user?.id) {
      setProfileLoading(false);
      return;
    }
    try {
      const profile = await citizenApi.getCitizenByUserId(Number(user.id));
      if (profile?.id) {
        setCitizenId(profile.id);
      }
    } catch {
      setError('Citizen profile required. Please complete your profile before applying for certificates/permits.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenId) {
      setError('Active citizen profile not found. Please complete your citizen profile.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      let application;
      if (serviceCategory === 'CERTIFICATE') {
        application = await certificateApi.applyCertificate({
          citizenId,
          certificateType,
        });
      } else {
        application = await certificateApi.applyPermit({
          citizenId,
          permitType,
        });
      }

      if (supportingFile && application?.id) {
        try {
          await certificateApi.uploadDocument(application.id, supportingFile);
        } catch {
          // Document upload warning
        }
      }

      setSuccessMsg(`Application submitted successfully! Application No: ${application.applicationNo}`);
      setTimeout(() => {
        navigate(`/services/applications/${application.id}`);
      }, 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message || e.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Apply for Municipal Certificate or Permit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Digitally submit applications, upload supporting documents, and track officer verification in real time.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {!citizenId && !profileLoading && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#fff8e1', border: '1px solid #ffe082' }}>
          <Typography variant="subtitle1" color="warning.dark" sx={{ fontWeight: 'bold', mb: 1 }}>
            Citizen Profile Incomplete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Before applying for municipal certificates or licenses, your official citizen profile must be registered.
          </Typography>
          <Button variant="contained" color="warning" onClick={() => navigate('/citizen/profile')}>
            Complete Citizen Profile
          </Button>
        </Paper>
      )}

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Service Category Selection */}
            <Grid size={{ xs: 12 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Select Service Category
                </FormLabel>
                <RadioGroup
                  row
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value as 'CERTIFICATE' | 'PERMIT')}
                >
                  <FormControlLabel
                    value="CERTIFICATE"
                    control={<Radio />}
                    label="Citizen Certificate (Birth, Death, Income, Residence, Marriage)"
                  />
                  <FormControlLabel
                    value="PERMIT"
                    control={<Radio />}
                    label="Permit & Commercial License (Trade, Shop, Building, Water)"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>

            {/* Service Type Dropdown & Descriptions */}
            <Grid size={{ xs: 12 }}>
              {serviceCategory === 'CERTIFICATE' ? (
                <TextField
                  select
                  fullWidth
                  required
                  label="Select Certificate Type"
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value as CertificateType)}
                >
                  {CERTIFICATE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {opt.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opt.desc}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  select
                  fullWidth
                  required
                  label="Select Permit / License Type"
                  value={permitType}
                  onChange={(e) => setPermitType(e.target.value as PermitType)}
                >
                  {PERMIT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {opt.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opt.desc}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>

            {/* Supporting Document Upload */}
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined" sx={{ p: 2, backgroundColor: '#fbfcfd' }}>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CloudUploadIcon color="primary" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Supporting Verification Document (Optional / Recommended)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Upload Aadhaar, Address proof, Property tax receipt, or relevant certificate proof (PDF, JPG, PNG).
                  </Typography>

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    size="small"
                  >
                    Choose Document File
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSupportingFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>

                  {supportingFile && (
                    <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedUserIcon color="success" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Selected: {supportingFile.name} ({(supportingFile.size / 1024).toFixed(1)} KB)
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setSupportingFile(null)}
                      >
                        Remove
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Action */}
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/services/applications')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting || !citizenId}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <AssignmentIcon />}
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
