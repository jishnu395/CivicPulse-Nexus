import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { citizenApi } from '../../services/citizenApi';
import { Citizen, Gender, UpdateCitizenRequest } from '../../types/citizen.types';

interface CitizenEditDialogProps {
  open: boolean;
  onClose: () => void;
  citizen: Citizen;
  onSuccess: (updated: Citizen) => void;
}

export const CitizenEditDialog: React.FC<CitizenEditDialogProps> = ({
  open,
  onClose,
  citizen,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateCitizenRequest>({
    firstName: citizen.firstName || '',
    lastName: citizen.lastName || '',
    phoneNumber: citizen.phoneNumber || '',
    gender: citizen.gender || 'OTHER',
    dateOfBirth: citizen.dateOfBirth || '',
    address: citizen.address || '',
    wardNumber: String(citizen.wardNumber || ''),
    city: citizen.city || '',
    state: citizen.state || '',
    postalCode: citizen.postalCode || '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (citizen) {
      setFormData({
        firstName: citizen.firstName || '',
        lastName: citizen.lastName || '',
        phoneNumber: citizen.phoneNumber || '',
        gender: citizen.gender || 'OTHER',
        dateOfBirth: citizen.dateOfBirth || '',
        address: citizen.address || '',
        wardNumber: String(citizen.wardNumber || ''),
        city: citizen.city || '',
        state: citizen.state || '',
        postalCode: citizen.postalCode || '',
      });
    }
  }, [citizen]);

  const handleChange = (field: keyof UpdateCitizenRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.address) {
      toast.error('Please complete all required profile fields');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await citizenApi.updateCitizen(citizen.id, formData);
      toast.success('Citizen profile updated successfully');
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to update citizen profile';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Edit Citizen Profile ({citizen.citizenId || `ID #${citizen.id}`})
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                required
                fullWidth
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                required
                fullWidth
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                required
                fullWidth
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                >
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Birth"
                type="date"
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Ward Number"
                required
                fullWidth
                value={formData.wardNumber}
                onChange={(e) => handleChange('wardNumber', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Street Address"
                required
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="City"
                required
                fullWidth
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="State"
                required
                fullWidth
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Postal Code"
                required
                fullWidth
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CitizenEditDialog;
