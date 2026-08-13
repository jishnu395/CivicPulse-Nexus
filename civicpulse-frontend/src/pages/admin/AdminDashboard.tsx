import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import MetricCard from '../../components/ui/MetricCard';
import { FiDollarSign, FiCheckSquare, FiArrowRight, FiShield, FiDatabase } from 'react-icons/fi';
import budgetApi from '../../services/budgetApi';
import welfareApi from '../../services/welfareApi';
import { BudgetDashboardResponse } from '../../types/budget.types';
import { WelfareStatsResponse } from '../../types/welfare.types';
import reportingApi from '../../services/reportingApi';
import { ExecutiveDashboardResponse } from '../../types/reporting.types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [budgetDashboard, setBudgetDashboard] = useState<BudgetDashboardResponse | null>(null);
  const [welfareStats, setWelfareStats] = useState<WelfareStatsResponse | null>(null);
  const [reportDashboard, setReportDashboard] = useState<ExecutiveDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      budgetApi.getBudgetDashboard().catch(() => null),
      welfareApi.getStats().catch(() => null),
      reportingApi.getDashboard().catch(() => null),
    ])
      .then(([budgetData, welfareData, reportData]) => {
        setBudgetDashboard(budgetData);
        setWelfareStats(welfareData);
        setReportDashboard(reportData);
      })
      .finally(() => setLoading(false));
  }, []);

  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Administrator';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title={`Welcome back, ${adminName}`}
        subtitle="System Administration | CivicPulse Platform Oversight & Security Control Panel"
      />

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Welfare Applications"
            value={welfareStats ? welfareStats.totalApplications : 0}
            subtitle={`${welfareStats ? welfareStats.pendingApplications : 0} pending verification`}
            icon={<FiCheckSquare />}
            color="#f59e0b"
            onClick={() => navigate('/welfare/management')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total City Budget"
            value={budgetDashboard ? `₹${budgetDashboard.totalAllocated.toLocaleString('en-IN')}` : '₹0'}
            subtitle="Departmental reserves"
            icon={<FiDollarSign />}
            color="#0f3d64"
            onClick={() => navigate('/budget')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Financial Audit Access"
            value="Secure Logs"
            subtitle="View immutable trails"
            icon={<FiDatabase />}
            color="#ef4444"
            onClick={() => navigate('/audit')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Welfare Beneficiaries"
            value={welfareStats ? welfareStats.totalBeneficiaries : 0}
            subtitle="Direct Benefit recipients"
            icon={<FiShield />}
            color="#10b981"
            onClick={() => navigate('/welfare/management')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Welfare Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 240 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Welfare Operational Index
              </Typography>
              <Button
                variant="text"
                endIcon={<FiArrowRight />}
                onClick={() => navigate('/welfare/management')}
                sx={{ fontWeight: 700 }}
              >
                Inspect
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemText primary="Published Welfare Schemes" />
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {welfareStats ? welfareStats.totalSchemes : 0}
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Approved Applicants" />
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {welfareStats ? welfareStats.approvedApplications : 0}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Financial Index */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 240 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Financial Index
              </Typography>
              <Button
                variant="text"
                endIcon={<FiArrowRight />}
                onClick={() => navigate('/budget')}
                sx={{ fontWeight: 700 }}
              >
                Inspect
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemText primary="Budget Utilization Rate" />
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#b45309' }}>
                  {budgetDashboard ? `${budgetDashboard.utilizationPercentage.toFixed(1)}%` : '0%'}
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemText primary="Remaining Reserves" />
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#16a34a' }}>
                  ₹{budgetDashboard ? budgetDashboard.totalRemaining.toLocaleString('en-IN') : 0}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Governance Oversight Summary */}
        <Grid size={{ xs: 12 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                Consolidated Governance Analytics
              </Typography>
              <Button
                variant="contained"
                endIcon={<FiArrowRight />}
                onClick={() => navigate('/reports/dashboard')}
                sx={{ fontWeight: 700, backgroundColor: '#0f3d64' }}
              >
                Governance Console
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    SLA Compliance
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f3d64', mt: 0.5 }}>
                    {reportDashboard ? `${reportDashboard.slaComplianceRate.toFixed(1)}%` : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Grievance Resolution
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                    {reportDashboard ? `${reportDashboard.grievanceResolutionRate.toFixed(1)}%` : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Citizen Satisfaction
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#b45309', mt: 0.5 }}>
                    {reportDashboard && reportDashboard.averageCitizenSatisfaction > 0 ? `${reportDashboard.averageCitizenSatisfaction.toFixed(1)}/5.0` : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Active Grievances
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#ef4444', mt: 0.5 }}>
                    {reportDashboard ? reportDashboard.totalActiveGrievances.toLocaleString() : '0'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
