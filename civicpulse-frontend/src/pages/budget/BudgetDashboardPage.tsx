import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import { FiPlus, FiTrendingUp, FiDollarSign, FiRefreshCw, FiPieChart } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import budgetApi from '../../services/budgetApi';
import welfareApi from '../../services/welfareApi';
import { BudgetResponse, BudgetDashboardResponse, BudgetAllocationResponse } from '../../types/budget.types';
import { SchemeResponse } from '../../types/welfare.types';
import { toast } from 'react-toastify';

const BudgetDashboardPage: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [allocations, setAllocations] = useState<BudgetAllocationResponse[]>([]);
  const [schemes, setSchemes] = useState<SchemeResponse[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<BudgetDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);

  // Budget Form
  const [department, setDepartment] = useState('');
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0);

  // Allocation Form
  const [selectedBudgetId, setSelectedBudgetId] = useState<number>(0);
  const [selectedSchemeId, setSelectedSchemeId] = useState<number>(0);
  const [allocationAmount, setAllocationAmount] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const budgetList = await budgetApi.getAllBudgets();
      setBudgets(budgetList);

      const summary = await budgetApi.getBudgetDashboard();
      setDashboardSummary(summary);

      const allocList = await budgetApi.getAllAllocations();
      setAllocations(allocList);

      const schemesList = await welfareApi.getAllSchemes();
      setSchemes(schemesList);

    } catch (err: any) {
      setError(err.message || 'Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (allocatedAmount <= 0) {
      toast.error('Allocated amount must be greater than zero');
      return;
    }

    try {
      await budgetApi.createBudget({
        department,
        financialYear,
        allocatedAmount,
      });
      toast.success('Budget created successfully');
      setBudgetDialogOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create budget');
    }
  };

  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (allocationAmount <= 0) {
      toast.error('Allocation amount must be greater than zero');
      return;
    }

    // Check remaining budget limit
    const targetBudget = budgets.find((b) => b.id === selectedBudgetId);
    if (targetBudget && allocationAmount > targetBudget.remainingAmount) {
      toast.error(`Allocation amount exceeds remaining budget of ₹${targetBudget.remainingAmount.toLocaleString()}`);
      return;
    }

    try {
      await budgetApi.allocateBudget({
        budgetId: selectedBudgetId,
        schemeId: selectedSchemeId,
        allocatedAmount: allocationAmount,
      });
      toast.success('Funds allocated to scheme successfully');
      setAllocationDialogOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to allocate budget');
    }
  };

  if (loading) {
    return <LoadingState message="Loading financial dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Budget & Financial Oversight"
        subtitle="Manage municipal annual budgets, department disbursements, and scheme allocations."
        actions={
          <>
            <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={loadDashboardData}>
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<FiPlus />}
              onClick={() => setAllocationDialogOpen(true)}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Allocate to Scheme
            </Button>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => setBudgetDialogOpen(true)}
              sx={{
                borderRadius: 1.5,
                textTransform: 'none',
                backgroundColor: '#0f3d64',
                '&:hover': { backgroundColor: '#0c3050' },
              }}
            >
              New Department Budget
            </Button>
          </>
        }
      />

      {/* Metrics Summary Row */}
      {dashboardSummary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Total Budget"
              value={`₹${dashboardSummary.totalAllocated.toLocaleString('en-IN')}`}
              icon={<FiDollarSign />}
              color="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Allocated / Utilized"
              value={`₹${dashboardSummary.totalUtilized.toLocaleString('en-IN')}`}
              icon={<FiTrendingUp />}
              color="warning"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Remaining Funds"
              value={`₹${dashboardSummary.totalRemaining.toLocaleString('en-IN')}`}
              icon={<FiDollarSign />}
              color="success"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              title="Utilization Rate"
              value={`${dashboardSummary.utilizationPercentage.toFixed(1)}%`}
              icon={<FiPieChart />}
              color="info"
            />
          </Grid>
        </Grid>
      )}

      {/* Budgets Grid & Allocations Row */}
      <Grid container spacing={3}>
        {/* Budgets List */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: '#e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2.5 }}>
              Departmental Budget Status
            </Typography>
            {budgets.length === 0 ? (
              <EmptyState title="No Budgets Defined" description="No department budgets have been created yet." />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Financial Year</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Allocated Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Utilized Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Remaining</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Utilization</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {budgets.map((budget) => {
                      const utilRate = budget.allocatedAmount > 0 
                        ? (budget.utilizedAmount / budget.allocatedAmount) * 100 
                        : 0;
                      
                      return (
                        <TableRow key={budget.id} hover>
                          <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{budget.department}</TableCell>
                          <TableCell>{budget.financialYear}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>₹{budget.allocatedAmount.toLocaleString('en-IN')}</TableCell>
                          <TableCell sx={{ color: '#b45309', fontWeight: 600 }}>
                            ₹{budget.utilizedAmount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell sx={{ color: '#16a34a', fontWeight: 600 }}>
                            ₹{budget.remainingAmount.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell sx={{ width: 140 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(utilRate, 100)}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: '#f1f5f9',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: utilRate > 85 ? '#ef4444' : '#0f3d64',
                                  },
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                                {utilRate.toFixed(0)}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Allocations Table */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: '#e2e8f0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2.5 }}>
              Scheme Allocations
            </Typography>
            {allocations.length === 0 ? (
              <EmptyState title="No Allocations" description="No funds allocated to schemes yet." />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 400, overflowY: 'auto' }}>
                {allocations.map((alloc) => {
                  const matchingScheme = schemes.find((s) => s.id === alloc.schemeId);
                  const matchingBudget = budgets.find((b) => b.id === alloc.budgetId);
                  
                  return (
                    <Card key={alloc.id} variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          {matchingScheme ? matchingScheme.schemeName : `Scheme ID #${alloc.schemeId}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                          Source Dept: {matchingBudget ? matchingBudget.department : 'Unknown'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, alignItems: 'center' }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>ALLOCATED</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f3d64' }}>
                              ₹{alloc.allocatedAmount.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>UTILIZED</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309' }}>
                              ₹{alloc.utilizedAmount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* New Budget Dialog */}
      <Dialog open={budgetDialogOpen} onClose={() => setBudgetDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleBudgetSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Create Department Budget</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Department Name"
              required
              fullWidth
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Sanitation, Roads, Water"
            />
            <TextField
              label="Financial Year"
              required
              fullWidth
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              placeholder="e.g. 2026-27"
            />
            <TextField
              label="Allocated Budget Amount (₹)"
              type="number"
              required
              fullWidth
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(parseFloat(e.target.value) || 0)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setBudgetDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f3d64' }}>
              Create Budget
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Allocate Dialog */}
      <Dialog open={allocationDialogOpen} onClose={() => setAllocationDialogOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleAllocationSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Allocate Budget to Welfare Scheme</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            
            <TextField
              select
              label="Select Department Source Budget"
              required
              fullWidth
              value={selectedBudgetId || ''}
              onChange={(e) => setSelectedBudgetId(parseInt(e.target.value as string, 10) || 0)}
            >
              {budgets.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.department} ({b.financialYear}) - Bal: ₹{b.remainingAmount.toLocaleString()}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select Destination Welfare Scheme"
              required
              fullWidth
              value={selectedSchemeId || ''}
              onChange={(e) => setSelectedSchemeId(parseInt(e.target.value as string, 10) || 0)}
            >
              {schemes.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.schemeName} (Req ₹{s.benefitAmount.toLocaleString()})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Allocation Amount (₹)"
              type="number"
              required
              fullWidth
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(parseFloat(e.target.value) || 0)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAllocationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f3d64' }}>
              Allocate Funds
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BudgetDashboardPage;
