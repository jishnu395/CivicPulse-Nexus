import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import { grievanceApi } from '../../services/grievanceApi';
import { Priority } from '../../types/grievance.types';
import { toast } from 'react-toastify';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

const CATEGORIES = [
  'Sanitation & Waste Management',
  'Roads & Infrastructure',
  'Water Supply & Drainage',
  'Electricity & Streetlights',
  'Public Health & Safety',
  'Parks & Environment',
  'Revenue & Taxation',
  'Other Civic Grievance',
];

export const RaiseGrievancePage: React.FC = () => {
  const { citizenProfile } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [location, setLocation] = useState(
    citizenProfile ? `${citizenProfile.address}, Ward ${citizenProfile.wardNumber}` : ''
  );
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizenProfile?.id) {
      toast.error('Citizen profile not found. Please complete citizen profile registration first.');
      return;
    }

    if (!title.trim() || !category || !location.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const created = await grievanceApi.createGrievance({
        citizenId: citizenProfile.id,
        title: title.trim(),
        category,
        priority,
        location: location.trim(),
        description: description.trim(),
      });

      toast.success(`Grievance #${created.id} submitted successfully!`);
      navigate(`/grievances/${created.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to submit grievance. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!citizenProfile) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">
          You must have an active citizen profile to raise grievances. Please visit your Profile page to verify your status.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Raise Civic Grievance"
        subtitle="Report an issue to municipal authorities with automated SLA resolution tracking."
        actions={
          <Button
            variant="outlined"
            startIcon={<FiArrowLeft />}
            onClick={() => navigate('/grievances')}
          >
            Back to Grievances
          </Button>
        }
      />

      <Paper elevation={0} sx={{ p: 4, maxWidth: 800, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Grievance Title"
                placeholder="Brief summary of the issue (e.g., Broken water pipeline near Ward 4)"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Specific Location / Landmark"
                placeholder="Address or nearest landmark"
                required
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>

            {/* Priority */}
            <Grid size={{ xs: 12 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Severity & Priority Level
                </FormLabel>
                <RadioGroup
                  row
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                >
                  <FormControlLabel
                    value="LOW"
                    control={<Radio color="primary" />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>LOW</Typography>
                        <Typography variant="caption" color="text.secondary">Standard civic inquiry / maintenance</Typography>
                      </Box>
                    }
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel
                    value="MEDIUM"
                    control={<Radio color="primary" />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>MEDIUM</Typography>
                        <Typography variant="caption" color="text.secondary">Regular civic issue requiring action</Typography>
                      </Box>
                    }
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel
                    value="HIGH"
                    control={<Radio color="error" />}
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>HIGH</Typography>
                        <Typography variant="caption" color="text.secondary">Urgent / hazardous situation</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Detailed Description"
                placeholder="Please describe the issue, when it started, and any impact on the neighborhood..."
                required
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {/* Submit Bar */}
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/grievances')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <FiSend />}
                disabled={submitting}
              >
                {submitting ? 'Submitting Grievance...' : 'Submit Grievance'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default RaiseGrievancePage;
