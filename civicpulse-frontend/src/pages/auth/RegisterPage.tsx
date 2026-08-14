import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Grid,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiShield, FiCheckCircle } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';
import { authApi } from '../../services/authApi';
import apiClient from '../../services/api/client';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, refreshCitizenProfile } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 State: User Account
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createdUserId, setCreatedUserId] = useState<string | number | null>(null);

  // Step 2 State: Citizen Demographics
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [wardNumber, setWardNumber] = useState('21');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        role: 'CITIZEN',
      });

      setCreatedUserId(response.id);

      // Authenticate newly registered user so Bearer token is saved in localStorage for Step 2
      await login({ email, password });

      toast.success('Account created. Please complete your citizen profile.');
      setActiveStep(1);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      const msg = apiErr.response?.data?.message || 'Registration failed. Email may already be in use.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdUserId) {
      setError('User account was not found. Please start over.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/citizens', {
        userId: createdUserId,
        firstName,
        lastName,
        phoneNumber,
        gender,
        dateOfBirth,
        address,
        wardNumber,
        city,
        state,
        postalCode,
      });

      if (refreshCitizenProfile) {
        await refreshCitizenProfile();
      }

      toast.success('Citizen profile registered successfully!');
      setActiveStep(2);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      const msg = apiErr.response?.data?.message || 'Failed to create citizen profile. Please check your details.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 5 },
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        backgroundColor: '#ffffff',
        maxWidth: activeStep === 1 ? 640 : 500,
        mx: 'auto',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: '#0f3d64',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '1.5rem',
          }}
        >
          <FiShield />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f3d64', letterSpacing: '-0.02em' }}>
          Citizen Registration
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Create an official citizen portal account with civic access
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Account Details</StepLabel>
        </Step>
        <Step>
          <StepLabel>Citizen Profile</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirmation</StepLabel>
        </Step>
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Step 1: User Account */}
      {activeStep === 0 && (
        <form onSubmit={handleStep1Submit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                required
              />
            </Box>

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="new-password"
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                backgroundColor: '#0f3d64',
                py: 1.25,
                fontWeight: 700,
                fontSize: '0.9375rem',
                '&:hover': { backgroundColor: '#1e5d94' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Continue to Profile Details'}
            </Button>
          </Box>
        </form>
      )}

      {/* Step 2: Citizen Profile */}
      {activeStep === 1 && (
        <form onSubmit={handleStep2Submit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                required
                placeholder="+1-555-0199"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                fullWidth
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Ward Number"
                value={wardNumber}
                onChange={(e) => setWardNumber(e.target.value)}
                fullWidth
                required
                placeholder="21"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Residential Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                required
                placeholder="104 Elm Street, Apt 3B"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                required
                placeholder="Springfield"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                fullWidth
                required
                placeholder="IL"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                fullWidth
                required
                placeholder="62701"
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{
                  backgroundColor: '#0f3d64',
                  py: 1.25,
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  '&:hover': { backgroundColor: '#1e5d94' },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {/* Step 3: Success Confirmation */}
      {activeStep === 2 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              color: '#047857',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '2rem',
            }}
          >
            <FiCheckCircle />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Registration Complete!
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
            Your citizen account and official demographics profile have been successfully registered with CivicPulse Nexus.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(ROUTES.LOGIN)}
            sx={{
              backgroundColor: '#0f3d64',
              px: 4,
              py: 1.25,
              fontWeight: 700,
              '&:hover': { backgroundColor: '#1e5d94' },
            }}
          >
            Go to Sign In
          </Button>
        </Box>
      )}

      {activeStep < 2 && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to={ROUTES.LOGIN}
              sx={{
                color: '#0284c7',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default RegisterPage;
