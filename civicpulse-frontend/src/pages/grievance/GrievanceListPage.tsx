import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatusChip from '../../components/status/StatusChip';
import PriorityChip from '../../components/status/PriorityChip';
import SLAIndicator from '../../components/status/SLAIndicator';
import GrievanceStatusDialog from '../../components/grievance/GrievanceStatusDialog';
import GrievanceAssignDialog from '../../components/grievance/GrievanceAssignDialog';
import { grievanceApi } from '../../services/grievanceApi';
import { Grievance } from '../../types/grievance.types';
import { FiPlus, FiSearch, FiRefreshCw, FiArrowRight, FiEdit3, FiUserPlus } from 'react-icons/fi';

export const GrievanceListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCitizen = user?.role === 'CITIZEN';
  const isCommissionerOrAdmin = user?.role === 'COMMISSIONER' || user?.role === 'ADMIN';
  const isStaff = !isCitizen;

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [slaFilter, setSlaFilter] = useState<string>('ALL');

  // Dialog states
  const [statusDialogGrievance, setStatusDialogGrievance] = useState<Grievance | null>(null);
  const [assignDialogGrievance, setAssignDialogGrievance] = useState<Grievance | null>(null);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      if (isCitizen) {
        const data = await grievanceApi.getMyGrievances();
        setGrievances(data || []);
      } else {
        const data = await grievanceApi.getAllGrievances();
        setGrievances(data || []);
      }
    } catch {
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [user]);

  const handleStatusUpdateSuccess = (updated: Grievance) => {
    setGrievances((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleAssignSuccess = (updated: Grievance) => {
    setGrievances((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  // Filter grievances
  const filteredGrievances = grievances.filter((g) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      g.title.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query) ||
      g.location.toLowerCase().includes(query) ||
      String(g.id).includes(query);

    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || g.priority === priorityFilter;
    const matchesSla = slaFilter === 'ALL' || g.slaStatus === slaFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesSla;
  });

  return (
    <Box>
      <PageHeader
        title={isCitizen ? 'My Grievances' : 'Grievance Management'}
        subtitle={
          isCitizen
            ? 'Track your filed complaints and municipal resolution SLAs in real-time.'
            : 'Review, assign, and manage city-wide public grievances and SLA resolution timelines.'
        }
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<FiRefreshCw />}
              onClick={fetchGrievances}
              disabled={loading}
            >
              Refresh
            </Button>
            {isCitizen && (
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => navigate('/grievances/new')}
              >
                Raise Grievance
              </Button>
            )}
          </Box>
        }
      />

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              size="small"
              placeholder="Search by ID, title, category, or location..."
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <FiSearch style={{ marginRight: 8, color: '#94a3b8' }} />,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="SUBMITTED">Submitted</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ESCALATED">Escalated</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="sla-filter-label">SLA Compliance</InputLabel>
              <Select
                labelId="sla-filter-label"
                value={slaFilter}
                label="SLA Compliance"
                onChange={(e) => setSlaFilter(e.target.value)}
              >
                <MenuItem value="ALL">All SLA States</MenuItem>
                <MenuItem value="WITHIN_SLA">Within SLA</MenuItem>
                <MenuItem value="NEAR_DEADLINE">Near Deadline</MenuItem>
                <MenuItem value="OVERDUE">SLA Breached</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Grievances Data Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading grievances...
            </Typography>
          </Box>
        ) : filteredGrievances.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', backgroundColor: '#f8fafc' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              No Grievances Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || slaFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filter options.'
                : isCitizen
                ? 'You have not submitted any grievances yet.'
                : 'No public grievances are currently in the system.'}
            </Typography>
            {isCitizen && (
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => navigate('/grievances/new')}
              >
                Report a New Grievance
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title & Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SLA Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reported Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrievances.map((g) => (
                  <TableRow
                    key={g.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/grievances/${g.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>#{g.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {g.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {g.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{g.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <PriorityChip priority={g.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={g.status} />
                    </TableCell>
                    <TableCell>
                      <SLAIndicator slaStatus={g.slaStatus} dueDate={g.dueDate} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(g.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {isCommissionerOrAdmin && g.status === 'SUBMITTED' && (
                          <Tooltip title="Assign Department & Officer">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setAssignDialogGrievance(g)}
                            >
                              <FiUserPlus />
                            </IconButton>
                          </Tooltip>
                        )}
                        {isStaff && g.status !== 'CLOSED' && g.status !== 'REJECTED' && (
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setStatusDialogGrievance(g)}
                            >
                              <FiEdit3 />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          endIcon={<FiArrowRight />}
                          onClick={() => navigate(`/grievances/${g.id}`)}
                        >
                          Details
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Staff Status Dialog */}
      {statusDialogGrievance && (
        <GrievanceStatusDialog
          open={Boolean(statusDialogGrievance)}
          onClose={() => setStatusDialogGrievance(null)}
          grievance={statusDialogGrievance}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}

      {/* Commissioner/Admin Assign Dialog */}
      {assignDialogGrievance && (
        <GrievanceAssignDialog
          open={Boolean(assignDialogGrievance)}
          onClose={() => setAssignDialogGrievance(null)}
          grievance={assignDialogGrievance}
          onSuccess={handleAssignSuccess}
        />
      )}
    </Box>
  );
};

export default GrievanceListPage;
