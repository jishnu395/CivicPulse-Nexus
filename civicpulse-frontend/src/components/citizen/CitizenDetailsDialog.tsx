import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Citizen } from '../../types/citizen.types';
import { Grievance } from '../../types/grievance.types';
import { grievanceApi } from '../../services/grievanceApi';
import StatusChip from '../status/StatusChip';
import PriorityChip from '../status/PriorityChip';
import SLAIndicator from '../status/SLAIndicator';

interface CitizenDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  citizen: Citizen | null;
  onEdit?: (citizen: Citizen) => void;
}

export const CitizenDetailsDialog: React.FC<CitizenDetailsDialogProps> = ({
  open,
  onClose,
  citizen,
  onEdit,
}) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loadingGrievances, setLoadingGrievances] = useState(false);

  useEffect(() => {
    if (open && citizen?.id) {
      setLoadingGrievances(true);
      grievanceApi
        .getGrievancesByCitizenId(citizen.id)
        .then((res) => setGrievances(res || []))
        .catch(() => setGrievances([]))
        .finally(() => setLoadingGrievances(false));
    }
  }, [open, citizen]);

  if (!citizen) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {citizen.firstName} {citizen.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Citizen ID: {citizen.citizenId || `#${citizen.id}`} | User Account ID: {citizen.userId}
          </Typography>
        </Box>
        <StatusChip status={citizen.status || 'ACTIVE'} size="medium" />
      </DialogTitle>

      <DialogContent dividers>
        {/* Demographics Card */}
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5 }}>
          Demographics & Contact Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Email Address</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{citizen.email || 'Not provided'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Phone Number</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{citizen.phoneNumber}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Gender / Date of Birth</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{citizen.gender} | {citizen.dateOfBirth}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Ward Number</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Ward {citizen.wardNumber}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Typography variant="caption" color="text.secondary">Full Residential Address</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {citizen.address}, {citizen.city}, {citizen.state} - {citizen.postalCode}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Citizen Grievance History */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
            Filed Grievances ({grievances.length})
          </Typography>
        </Box>

        {loadingGrievances ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : grievances.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            This citizen has not filed any grievances yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tracking ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SLA Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reported Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grievances.map((g) => (
                  <TableRow key={g.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{g.id}</TableCell>
                    <TableCell>{g.title}</TableCell>
                    <TableCell>{g.category}</TableCell>
                    <TableCell><PriorityChip priority={g.priority} /></TableCell>
                    <TableCell><StatusChip status={g.status} /></TableCell>
                    <TableCell><SLAIndicator slaStatus={g.slaStatus} status={g.status} dueDate={g.dueDate} /></TableCell>
                    <TableCell>{new Date(g.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {onEdit && (
          <Button
            variant="contained"
            onClick={() => {
              onClose();
              onEdit(citizen);
            }}
          >
            Edit Demographics
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CitizenDetailsDialog;
