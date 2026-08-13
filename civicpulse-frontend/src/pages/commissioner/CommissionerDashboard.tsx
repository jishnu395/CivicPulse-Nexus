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
import { FiDollarSign, FiTrendingUp, FiCheckSquare, FiArrowRight, FiFileText } from 'react-icons/fi';
import budgetApi from '../../services/budgetApi';
import welfareApi from '../../services/welfareApi';
import { BudgetDashboardResponse } from '../../types/budget.types';
import { WelfareStatsResponse } from '../../types/welfare.types';
import reportingApi from '../../services/reportingApi';
import { ExecutiveDashboardResponse } from '../../types/reporting.types';

export const CommissionerDashboard: React.FC = () => {
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

  const commissionerName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Commissioner';

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
        title={`Welcome back, ${commissionerName}`}
        subtitle="Commissioner Portal | Governance, Budgets and Welfare Oversight"
      />

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Budget"
            value={budgetDashboard ? `₹${budgetDashboard.totalAllocated.toLocaleString('en-IN')}` : '₹0'}
            subtitle="Departmental allocations"
            icon={<FiDollarSign />}
            color="#0f3d64"
            onClick={() => navigate('/budget')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Budget Utilized"
            value={budgetDashboard ? `₹${budgetDashboard.totalUtilized.toLocaleString('en-IN')}` : '₹0'}
            subtitle="Operational expenses & DBTs"
            icon={<FiTrendingUp />}
            color="#b45309"
            onClick={() => navigate('/budget')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Active Welfare Schemes"
            value={welfareStats ? welfareStats.activeSchemes : 0}
            subtitle={`Out of ${welfareStats ? welfareStats.totalSchemes : 0} schemes`}
            icon={<FiFileText />}
            color="#10b981"
            onClick={() => navigate('/welfare/management')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Pending Applications"
            value={welfareStats ? welfareStats.pendingApplications : 0}
            subtitle="Verifications required"
            icon={<FiCheckSquare />}
            color="#f59e0b"
            onClick={() => navigate('/welfare/management')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Welfare Distribution Panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 280 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Welfare Beneficiaries Summary
              </Typography>
              <Button
                variant="text"
                endIcon={<FiArrowRight />}
                onClick={() => navigate('/welfare/management')}
                sx={{ fontWeight: 700 }}
              >
                Manage
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemText
                  primary="Enrolled Beneficiaries"
                  secondary="Citizens receiving direct welfare assistance"
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                  {welfareStats ? welfareStats.totalBeneficiaries : 0}
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total Disbursed Funds"
                  secondary="Direct benefit transfer (DBT) payouts"
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f3d64' }}>
                  ₹{welfareStats ? welfareStats.totalDisbursedBenefitAmount.toLocaleString('en-IN') : 0}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Budget Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', minHeight: 280 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Budget Performance Index
              </Typography>
              <Button
                variant="text"
                endIcon={<FiArrowRight />}
                onClick={() => navigate('/budget')}
                sx={{ fontWeight: 700 }}
              >
                Analyze
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemText
                  primary="Budget Utilization Rate"
                  secondary="Allocated amount vs operational expenses"
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#b45309' }}>
                  {budgetDashboard ? `${budgetDashboard.utilizationPercentage.toFixed(1)}%` : '0%'}
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Remaining Reserves"
                  secondary="Unutilized municipal funds"
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a' }}>
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
                Governance & Executive Reports Summary
              </Typography>
              <Button
                variant="contained"
                endIcon={<FiArrowRight />}
                onClick={() => navigate('/reports/dashboard')}
                sx={{ fontWeight: 700, backgroundColor: '#0f3d64' }}
              >
                View Full Reports Workspace
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
                    Welfare DBT Released
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#a21caf', mt: 0.5 }}>
                    {reportDashboard ? `₹${reportDashboard.totalWelfareDisbursed.toLocaleString('en-IN')}` : '₹0'}
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

export default CommissionerDashboard;
