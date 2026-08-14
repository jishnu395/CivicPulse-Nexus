import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/ui/MetricCard';
import StatusChip from '../../components/status/StatusChip';
import PriorityChip from '../../components/status/PriorityChip';
import SLAIndicator from '../../components/status/SLAIndicator';
import { FiAlertCircle, FiCheckCircle, FiClock, FiPlus, FiUser, FiArrowRight } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';
import { grievanceApi } from '../../services/grievanceApi';
import { Grievance } from '../../types/grievance.types';

export const CitizenDashboard: React.FC = () => {
  const { user, citizenProfile } = useAuth();
  const navigate = useNavigate();

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grievanceApi
      .getMyGrievances()
      .then((data) => setGrievances(data || []))
      .catch(() => setGrievances([]))
      .finally(() => setLoading(false));
  }, []);

  const citizenName = citizenProfile
    ? `${citizenProfile.firstName} ${citizenProfile.lastName}`
    : user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : 'Citizen';

  const totalGrievances = grievances.length;
  const inProgressCount = grievances.filter(
    (g) => g.status === 'IN_PROGRESS' || g.status === 'ASSIGNED' || g.status === 'PENDING'
  ).length;
  const resolvedCount = grievances.filter(
    (g) => g.status === 'RESOLVED' || g.status === 'CLOSED'
  ).length;
  const overdueCount = grievances.filter((g) => g.slaStatus === 'OVERDUE').length;

  const recentGrievances = grievances.slice(0, 5);

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${citizenName}`}
        subtitle={`Ward ${citizenProfile?.wardNumber || 'General'} | Citizen ID: ${citizenProfile?.citizenId || 'Verified Citizen'}`}
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<FiUser />}
              onClick={() => navigate(ROUTES.CITIZEN_PROFILE)}
            >
              My Profile
            </Button>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => navigate('/grievances/new')}
            >
              Raise Grievance
            </Button>
          </Box>
        }
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Grievances"
            value={totalGrievances}
            subtitle="All reported issues"
            icon={<FiAlertCircle />}
            color="#0284c7"
            onClick={() => navigate('/grievances')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Under investigation / work"
            icon={<FiClock />}
            color="#f59e0b"
            onClick={() => navigate('/grievances')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Resolved"
            value={resolvedCount}
            subtitle="Closed or resolved"
            icon={<FiCheckCircle />}
            color="#10b981"
            onClick={() => navigate('/grievances')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="SLA Breached"
            value={overdueCount}
            subtitle="Urgent resolution needed"
            icon={<FiAlertCircle />}
            color="#ef4444"
            onClick={() => navigate('/grievances')}
          />
        </Grid>
      </Grid>

      {/* Recent Grievances Section */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Grievances
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track real-time status and SLA resolution targets
            </Typography>
          </Box>
          <Button
            variant="text"
            endIcon={<FiArrowRight />}
            onClick={() => navigate('/grievances')}
            sx={{ fontWeight: 600 }}
          >
            View All ({totalGrievances})
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={32} />
          </Box>
        ) : recentGrievances.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You have not filed any grievances yet.
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<FiPlus />}
              onClick={() => navigate('/grievances/new')}
            >
              Report an Issue
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tracking ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>SLA Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reported</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentGrievances.map((g) => (
                  <TableRow
                    key={g.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/grievances/${g.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>#{g.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{g.title}</TableCell>
                    <TableCell>{g.category}</TableCell>
                    <TableCell><PriorityChip priority={g.priority} /></TableCell>
                    <TableCell><StatusChip status={g.status} /></TableCell>
                    <TableCell><SLAIndicator slaStatus={g.slaStatus} status={g.status} dueDate={g.dueDate} /></TableCell>
                    <TableCell>{new Date(g.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/grievances/${g.id}`);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default CitizenDashboard;
