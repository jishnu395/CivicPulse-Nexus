import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  InputAdornment,
} from '@mui/material';
import { FiPlus, FiCheckCircle, FiXCircle, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusChip } from '../../components/status/StatusChip';
import budgetApi from '../../services/budgetApi';
import welfareApi from '../../services/welfareApi';
import { FundDistributionResponse, BudgetResponse } from '../../types/budget.types';
import { BeneficiaryResponse } from '../../types/welfare.types';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/useAuth';

const FundDistributionPage: React.FC = () => {
  const { role } = useAuth();
  const [distributions, setDistributions] = useState<FundDistributionResponse[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryResponse[]>([]);
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [distDialogOpen, setDistDialogOpen] = useState(false);

  // Form states
  const [selectedBenId, setSelectedBenId] = useState<number>(0);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number>(0);
  const [citizenId, setCitizenId] = useState<number>(0);
  const [schemeId, setSchemeId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const distData = await budgetApi.getAllDistributions();
      setDistributions(distData);

      const benData = await welfareApi.getAllBeneficiaries();
      setBeneficiaries(benData);

      const budgetsData = await budgetApi.getAllBudgets();
      setBudgets(budgetsData);

    } catch (err: any) {
      setError(err.message || 'Failed to load fund distribution data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDistribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error('Distribution amount must be greater than zero');
      return;
    }

    const targetBudget = budgets.find((b) => b.id === selectedBudgetId);
    if (targetBudget && amount > targetBudget.remainingAmount) {
      toast.error(`Amount exceeds remaining budget of ₹${targetBudget.remainingAmount.toLocaleString()}`);
      return;
    }

    try {
      await budgetApi.distributeFunds({
        beneficiaryId: selectedBenId,
        citizenId,
        schemeId,
        budgetId: selectedBudgetId,
        amount,
      });
      toast.success('Fund distribution transaction created successfully');
      setDistDialogOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to trigger fund distribution');
    }
  };

  const resetForm = () => {
    setSelectedBenId(0);
    setSelectedBudgetId(0);
    setCitizenId(0);
    setSchemeId(0);
    setAmount(0);
  };

  const handleComplete = async (id: number) => {
    if (!window.confirm('Mark this transaction as COMPLETED? This will process payment.')) return;
    try {
      await budgetApi.completeDistribution(id);
      toast.success('Fund distribution transaction marked complete');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to complete transaction');
    }
  };

  const handleFail = async (id: number) => {
    if (!window.confirm('Mark this transaction as FAILED? This will revert allocation block.')) return;
    try {
      await budgetApi.failDistribution(id);
      toast.warn('Fund distribution transaction marked failed');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject transaction');
    }
  };

  const filteredDistributions = distributions.filter((dist) => {
    return statusFilter === 'ALL' || dist.paymentStatus === statusFilter;
  });

  if (loading) {
    return <LoadingState message="Loading disbursement ledger..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Fund Distributions"
        subtitle="Authorize direct benefit transfers (DBT) and track municipal disbursement transactions."
        actions={
          <>
            <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={loadData}>
              Refresh
            </Button>
            {(role === 'ADMIN' || role === 'COMMISSIONER') && (
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => setDistDialogOpen(true)}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  backgroundColor: '#0f3d64',
                  '&:hover': { backgroundColor: '#0c3050' },
                }}
              >
                Disburse New Benefit
              </Button>
            )}
          </>
        }
      />

      {/* Filter Row */}
      <Box
        sx={{
          mb: 4,
          p: 2.5,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          gap: 2,
          maxWidth: 320,
        }}
      >
        <TextField
          select
          label="Filter by Payment Status"
          size="small"
          fullWidth
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="ALL">ALL TRANSACTIONS</MenuItem>
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          <MenuItem value="FAILED">FAILED</MenuItem>
        </TextField>
      </Box>

      {/* List */}
      {filteredDistributions.length === 0 ? (
        <EmptyState title="No Transactions Found" description="Try modifying status filter or trigger a new benefit disbursement." />
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Scheme Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Citizen ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Disbursement Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Distributed Date</TableCell>
                {(role === 'ADMIN' || role === 'COMMISSIONER') && (
                  <TableCell align="center" sx={{ fontWeight: 700 }}>DBT Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDistributions.map((dist) => {
                const dateStr = dist.distributedAt
                  ? new Date(dist.distributedAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Pending';

                return (
                  <TableRow key={dist.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>
                      {dist.transactionId || `TXN-PEND-${dist.id}`}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{dist.schemeName}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CZN-{dist.citizenId}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#15803d' }}>
                      ₹{dist.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={dist.paymentStatus} />
                    </TableCell>
                    <TableCell>{dateStr}</TableCell>
                    {(role === 'ADMIN' || role === 'COMMISSIONER') && (
                      <TableCell align="center">
                        {dist.paymentStatus === 'PENDING' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              startIcon={<FiCheckCircle />}
                              onClick={() => handleComplete(dist.id)}
                              sx={{ borderRadius: 1.5, textTransform: 'none' }}
                            >
                              Release
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              startIcon={<FiXCircle />}
                              onClick={() => handleFail(dist.id)}
                              sx={{ borderRadius: 1.5, textTransform: 'none' }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Disburse Dialog */}
      <Dialog open={distDialogOpen} onClose={() => setDistDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateDistribution}>
          <DialogTitle sx={{ fontWeight: 800 }}>Disburse Direct Benefit Transfer (DBT)</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            
            <TextField
              select
              label="Select Enrolled Beneficiary Target"
              required
              fullWidth
              value={selectedBenId || ''}
              onChange={(e) => {
                const benId = parseInt(e.target.value as string, 10) || 0;
                setSelectedBenId(benId);
                const selected = beneficiaries.find((b) => b.id === benId);
                if (selected) {
                  setCitizenId(selected.citizenId);
                  setSchemeId(selected.schemeId);
                  setAmount(selected.benefitAmount);
                }
              }}
            >
              {beneficiaries.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  CZN-{b.citizenId} - {b.schemeName} (₹{b.benefitAmount.toLocaleString()})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Select Funding Department Budget Source"
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
              label="Amount to Transfer (₹)"
              type="number"
              required
              disabled
              fullWidth
              value={amount}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiDollarSign />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDistDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f3d64' }}>
              Disburse Funds
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default FundDistributionPage;
