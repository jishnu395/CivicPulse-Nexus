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
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatusChip from '../../components/status/StatusChip';
import CitizenDetailsDialog from '../../components/citizen/CitizenDetailsDialog';
import CitizenEditDialog from '../../components/citizen/CitizenEditDialog';
import { citizenApi } from '../../services/citizenApi';
import { Citizen } from '../../types/citizen.types';
import { FiSearch, FiRefreshCw, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const CitizenListPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [wardFilter, setWardFilter] = useState<string>('ALL');

  // Dialogs
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const data = await citizenApi.searchCitizens(searchQuery.trim());
        setCitizens(data || []);
      } else {
        const data = await citizenApi.getAllCitizens();
        setCitizens(data || []);
      }
    } catch {
      setCitizens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, [searchQuery]);

  const handleEditSuccess = (updated: Citizen) => {
    setCitizens((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to deactivate citizen #${id}?`)) return;

    try {
      await citizenApi.deleteCitizen(id);
      toast.success('Citizen deactivated successfully');
      fetchCitizens();
    } catch {
      toast.error('Failed to deactivate citizen');
    }
  };

  // Get distinct wards
  const wards = Array.from(new Set(citizens.map((c) => String(c.wardNumber)).filter(Boolean))).sort();

  // Filter citizens locally by status & ward
  const filteredCitizens = citizens.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesWard = wardFilter === 'ALL' || String(c.wardNumber) === wardFilter;
    return matchesStatus && matchesWard;
  });

  return (
    <Box>
      <PageHeader
        title="Citizen Directory"
        subtitle="Search and view registered citizens, verified civic demographics, and address jurisdictions."
        actions={
          <Button
            variant="outlined"
            startIcon={<FiRefreshCw />}
            onClick={fetchCitizens}
            disabled={loading}
          >
            Refresh
          </Button>
        }
      />

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              size="small"
              placeholder="Search citizens by name, email, phone number, or ward..."
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

          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="ward-filter-label">Ward</InputLabel>
              <Select
                labelId="ward-filter-label"
                value={wardFilter}
                label="Ward"
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Wards</MenuItem>
                {wards.map((w) => (
                  <MenuItem key={w} value={w}>
                    Ward {w}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Citizens Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading citizens directory...
            </Typography>
          </Box>
        ) : filteredCitizens.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', backgroundColor: '#f8fafc' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
              No Citizens Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query or ward filter criteria.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Citizen ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ward</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCitizens.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedCitizen(c);
                      setDetailsOpen(true);
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>
                      {c.citizenId || `#${c.id}`}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {c.firstName} {c.lastName}
                    </TableCell>
                    <TableCell>{c.email || '—'}</TableCell>
                    <TableCell>{c.phoneNumber}</TableCell>
                    <TableCell>Ward {c.wardNumber}</TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell>
                      <StatusChip status={c.status || 'ACTIVE'} />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedCitizen(c);
                              setDetailsOpen(true);
                            }}
                          >
                            <FiEye />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Demographics">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => {
                              setSelectedCitizen(c);
                              setEditOpen(true);
                            }}
                          >
                            <FiEdit2 />
                          </IconButton>
                        </Tooltip>

                        {isAdmin && (
                          <Tooltip title="Deactivate Citizen">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(c.id)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Citizen Details Dialog */}
      <CitizenDetailsDialog
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedCitizen(null);
        }}
        citizen={selectedCitizen}
        onEdit={(c) => {
          setSelectedCitizen(c);
          setEditOpen(true);
        }}
      />

      {/* Citizen Edit Dialog */}
      {selectedCitizen && (
        <CitizenEditDialog
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedCitizen(null);
          }}
          citizen={selectedCitizen}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
};

export default CitizenListPage;
