import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { grievanceApi } from '../../services/grievanceApi';
import { Grievance } from '../../types/grievance.types';

interface GrievanceAssignDialogProps {
  open: boolean;
  onClose: () => void;
  grievance: Grievance;
  onSuccess: (updated: Grievance) => void;
}

export const GrievanceAssignDialog: React.FC<GrievanceAssignDialogProps> = ({
  open,
  onClose,
  grievance,
  onSuccess,
}) => {
  const [departmentId, setDepartmentId] = useState<string>(
    grievance.departmentId ? String(grievance.departmentId) : '1'
  );
  const [assignedOfficerId, setAssignedOfficerId] = useState<string>(
    grievance.assignedOfficerId ? String(grievance.assignedOfficerId) : '1'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deptIdNum = Number(departmentId);
    const officerIdNum = Number(assignedOfficerId);

    if (!deptIdNum || isNaN(deptIdNum) || !officerIdNum || isNaN(officerIdNum)) {
      toast.error('Please enter valid Department ID and Officer ID numbers');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await grievanceApi.assignGrievance(grievance.id, {
        departmentId: deptIdNum,
        assignedOfficerId: officerIdNum,
      });
      toast.success(`Grievance successfully assigned to Department ${deptIdNum}`);
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to assign grievance';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Assign Grievance
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Assign this grievance to a municipal department and responsible field officer.
            </Typography>

            <TextField
              label="Department ID"
              type="number"
              required
              fullWidth
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              helperText="E.g., 1 (Sanitation), 2 (Public Works), 3 (Water), 4 (Revenue)"
            />

            <TextField
              label="Assigned Officer ID"
              type="number"
              required
              fullWidth
              value={assignedOfficerId}
              onChange={(e) => setAssignedOfficerId(e.target.value)}
              helperText="Database ID of the assigned municipal officer"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !departmentId || !assignedOfficerId}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Assigning...' : 'Assign Grievance'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GrievanceAssignDialog;
