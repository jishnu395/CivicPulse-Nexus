import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import { grievanceApi } from '../../services/grievanceApi';
import { Grievance, GrievanceStatus } from '../../types/grievance.types';
import StatusChip from '../status/StatusChip';

interface GrievanceStatusDialogProps {
  open: boolean;
  onClose: () => void;
  grievance: Grievance;
  onSuccess: (updated: Grievance) => void;
}

export const GrievanceStatusDialog: React.FC<GrievanceStatusDialogProps> = ({
  open,
  onClose,
  grievance,
  onSuccess,
}) => {
  // Compute allowed transitions strictly based on backend state machine
  const getAllowedStatuses = (current: GrievanceStatus): GrievanceStatus[] => {
    switch (current) {
      case 'SUBMITTED':
        return ['ASSIGNED'];
      case 'UNDER_REVIEW':
        return ['ASSIGNED', 'REJECTED'];
      case 'ASSIGNED':
        return ['IN_PROGRESS'];
      case 'IN_PROGRESS':
        return ['PENDING', 'RESOLVED', 'ESCALATED'];
      case 'PENDING':
        return ['IN_PROGRESS', 'RESOLVED'];
      case 'ESCALATED':
        return ['IN_PROGRESS', 'RESOLVED'];
      case 'RESOLVED':
        return ['CLOSED'];
      case 'REJECTED':
      case 'CLOSED':
      default:
        return [];
    }
  };

  const allowedStatuses = getAllowedStatuses(grievance.status);
  const [selectedStatus, setSelectedStatus] = useState<GrievanceStatus | ''>(
    allowedStatuses.length > 0 ? allowedStatuses[0] : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      toast.error('Please select a target status');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await grievanceApi.updateGrievanceStatus(grievance.id, {
        status: selectedStatus,
      });
      toast.success(`Grievance status updated to ${selectedStatus.replace('_', ' ')}`);
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to update grievance status';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Update Grievance Status
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ my: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Current Status:
              </Typography>
              <StatusChip status={grievance.status} size="small" />
            </Box>

            {allowedStatuses.length === 0 ? (
              <Alert severity="info">
                This grievance is in a terminal state ({grievance.status}) and cannot be transitioned further.
              </Alert>
            ) : (
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="target-status-label">Next Workflow State</InputLabel>
                <Select
                  labelId="target-status-label"
                  value={selectedStatus}
                  label="Next Workflow State"
                  onChange={(e) => setSelectedStatus(e.target.value as GrievanceStatus)}
                >
                  {allowedStatuses.map((st) => (
                    <MenuItem key={st} value={st}>
                      {st.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || allowedStatuses.length === 0 || !selectedStatus}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GrievanceStatusDialog;
