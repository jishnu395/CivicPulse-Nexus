import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import welfareApi from '../../services/welfareApi';
import { SchemeResponse } from '../../types/welfare.types';
import { toast } from 'react-toastify';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

const ApplyWelfarePage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { citizenProfile } = useAuth();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState<SchemeResponse | null>(null);
  const [loadingScheme, setLoadingScheme] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [age, setAge] = useState<number>(0);
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [ward, setWard] = useState('');
  const [familyStatus, setFamilyStatus] = useState('APL');
  const [supportingDocuments, setSupportingDocuments] = useState('');

  useEffect(() => {
    if (schemeId) {
      fetchSchemeDetails(parseInt(schemeId, 10));
    }
  }, [schemeId]);

  useEffect(() => {
    if (citizenProfile) {
      setWard(citizenProfile.wardNumber || '');
      if (citizenProfile.dateOfBirth) {
        const calculatedAge = calculateAge(citizenProfile.dateOfBirth);
        setAge(calculatedAge);
      }
    }
  }, [citizenProfile]);

  const calculateAge = (dobString: string): number => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const fetchSchemeDetails = async (id: number) => {
    try {
      setLoadingScheme(true);
      const data = await welfareApi.getSchemeById(id);
      setScheme(data);
    } catch (err: any) {
      toast.error('Failed to load scheme details');
      navigate('/welfare/schemes');
    } finally {
      setLoadingScheme(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizenProfile?.id) {
      toast.error('Citizen profile not found. Please complete profile registration first.');
      return;
    }

    if (!schemeId) return;

    if (annualIncome <= 0) {
      toast.error('Annual income must be greater than zero');
      return;
    }

    setSubmitting(true);
    try {
      await welfareApi.applyScheme({
        citizenId: citizenProfile.id,
        schemeId: parseInt(schemeId, 10),
        age,
        annualIncome,
        ward,
        familyStatus,
        supportingDocuments,
      });

      toast.success('Welfare application submitted successfully!');
      navigate('/welfare/applications');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!citizenProfile) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          You must have an active citizen profile to apply for welfare schemes. Please visit your Profile page first.
        </Alert>
      </Box>
    );
  }

  if (loadingScheme) {
    return <LoadingState message="Loading scheme information..." />;
  }

  if (!scheme) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Selected welfare scheme could not be found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Welfare Application"
        subtitle={`Submit your application for the "${scheme.schemeName}" program.`}
        actions={
          <Button variant="outlined" startIcon={<FiArrowLeft />} onClick={() => navigate('/welfare/schemes')}>
            Back to Schemes
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Scheme Details Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                Scheme Details
              </Typography>
              <Divider />
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  SCHEME NAME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                  {scheme.schemeName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  DEPARTMENT
                </Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>
                  {scheme.department}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  BENEFIT AMOUNT
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#15803d' }}>
                  ₹{scheme.benefitAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  ELIGIBILITY CRITERIA
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8125rem', whiteSpace: 'pre-line' }}>
                  {scheme.eligibilityCriteria}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Eligibility Validation Information
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Provide correct information to verify eligibility criteria enforced by the system.
                  </Typography>
                </Grid>

                {/* Age */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Applicant Age"
                    type="number"
                    required
                    fullWidth
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                  />
                </Grid>

                {/* Annual Income */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Annual Household Income (₹)"
                    type="number"
                    required
                    fullWidth
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                    placeholder="Enter income in INR"
                  />
                </Grid>

                {/* Ward */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Residential Ward"
                    required
                    fullWidth
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                  />
                </Grid>

                {/* Family Status */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="family-status-label">Family Income Category</InputLabel>
                    <Select
                      labelId="family-status-label"
                      value={familyStatus}
                      label="Family Income Category"
                      onChange={(e) => setFamilyStatus(e.target.value)}
                    >
                      <MenuItem value="APL">APL (Above Poverty Line)</MenuItem>
                      <MenuItem value="BPL">BPL (Below Poverty Line)</MenuItem>
                      <MenuItem value="OBC">OBC</MenuItem>
                      <MenuItem value="SC_ST">SC/ST</MenuItem>
                      <MenuItem value="GENERAL">General</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Supporting Documents Description */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Supporting Documents Details"
                    placeholder="Enter references to income certificates, ID proof, or document URLs..."
                    multiline
                    rows={3}
                    fullWidth
                    value={supportingDocuments}
                    onChange={(e) => setSupportingDocuments(e.target.value)}
                  />
                </Grid>

                {/* Submit bar */}
                <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                  <Button variant="outlined" onClick={() => navigate('/welfare/schemes')} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <FiSend />}
                    disabled={submitting}
                    sx={{
                      backgroundColor: '#0f3d64',
                      '&:hover': { backgroundColor: '#0c3050' },
                    }}
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper Loading State
const LoadingState: React.FC<{ message: string }> = ({ message }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2 }}>
    <CircularProgress size={40} sx={{ color: '#0f3d64' }} />
    <Typography sx={{ color: '#64748b', fontWeight: 600 }}>{message}</Typography>
  </Box>
);

export default ApplyWelfarePage;
