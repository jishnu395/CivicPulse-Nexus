import React, { useEffect, useState } from 'react';
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
import { FiCheckSquare, FiAlertCircle, FiArrowRight, FiUsers } from 'react-icons/fi';
import welfareApi from '../../services/welfareApi';
import { WelfareApplicationResponse } from '../../types/welfare.types';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pendingApps, setPendingApps] = useState<WelfareApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    welfareApi
      .getPendingApplications()
      .then((data) => setPendingApps(data || []))
      .catch(() => setPendingApps([]))
      .finally(() => setLoading(false));
  }, []);

  const officerName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Officer';

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title={`Welcome back, ${officerName}`}
        subtitle="Officer Governance Dashboard | Quick workflow action panel"
      />

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard
            title="Pending Applications"
            value={pendingApps.length}
            subtitle="Welfare scheme verifications required"
            icon={<FiCheckSquare />}
            color="#f59e0b"
            onClick={() => navigate('/welfare/management')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard
            title="Grievances Management"
            value="View Board"
            subtitle="Municipal incident control"
            icon={<FiAlertCircle />}
            color="#0f3d64"
            onClick={() => navigate('/grievances')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <MetricCard
            title="Citizen Directory"
            value="Search"
            subtitle="Browse ward directories"
            icon={<FiUsers />}
            color="#10b981"
            onClick={() => navigate('/citizens')}
          />
        </Grid>
      </Grid>

      {/* Recent Welfare Applications */}
      <Paper variant="outlined" sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Recent Pending Welfare Applications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review municipal welfare applications and verify eligibility constraints.
            </Typography>
          </Box>
          <Button
            variant="text"
            endIcon={<FiArrowRight />}
            onClick={() => navigate('/welfare/management')}
            sx={{ fontWeight: 700 }}
          >
            Review All ({pendingApps.length})
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={32} />
          </Box>
        ) : pendingApps.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No pending welfare scheme applications to verify.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>App ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Citizen ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Scheme Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Submitted Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApps.slice(0, 5).map((app) => (
                  <TableRow key={app.id} hover onClick={() => navigate('/welfare/management')} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ fontWeight: 600 }}>APP-{app.id.toString().padStart(4, '0')}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CZN-{app.citizenId}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{app.schemeName}</TableCell>
                    <TableCell>
                      <StatusChip status={app.status} />
                    </TableCell>
                    <TableCell>{new Date(app.applicationDate).toLocaleDateString('en-IN')}</TableCell>
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

export default OfficerDashboard;
