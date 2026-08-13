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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  InputAdornment,
} from '@mui/material';
import { FiPlus, FiTrash2, FiSearch, FiRefreshCw, FiDollarSign } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import budgetApi from '../../services/budgetApi';
import { ExpenseResponse, BudgetResponse, ExpenseCategory } from '../../types/budget.types';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/useAuth';

const CATEGORIES: ExpenseCategory[] = [
  'INFRASTRUCTURE',
  'HEALTHCARE',
  'EDUCATION',
  'PENSION',
  'SUBSIDY',
  'ADMINISTRATION',
  'OTHER',
];

const ExpenseManagementPage: React.FC = () => {
  const { role } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  // Form states
  const [selectedBudgetId, setSelectedBudgetId] = useState<number>(0);
  const [dept, setDept] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('OTHER');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const expensesData = await budgetApi.getAllExpenses();
      setExpenses(expensesData);

      const budgetsData = await budgetApi.getAllBudgets();
      setBudgets(budgetsData);

    } catch (err: any) {
      setError(err.message || 'Failed to load expense records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error('Expense amount must be greater than zero');
      return;
    }

    const targetBudget = budgets.find((b) => b.id === selectedBudgetId);
    if (targetBudget && amount > targetBudget.remainingAmount) {
      toast.error(`Expense amount exceeds remaining budget of ₹${targetBudget.remainingAmount.toLocaleString()}`);
      return;
    }

    try {
      await budgetApi.createExpense({
        budgetId: selectedBudgetId,
        department: dept,
        category,
        description,
        amount,
      });
      toast.success('Expense recorded successfully');
      setExpenseDialogOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record expense');
    }
  };

  const resetForm = () => {
    setSelectedBudgetId(0);
    setDept('');
    setCategory('OTHER');
    setDescription('');
    setAmount(0);
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense record? This will adjust the budget utilization.')) return;
    try {
      await budgetApi.deleteExpense(id);
      toast.success('Expense deleted successfully');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete expense record');
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.department.toLowerCase().includes(search.toLowerCase()) ||
      exp.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || exp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingState message="Loading expense ledger..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Expense Ledger"
        subtitle="Record city operational expenses and link them to departmental budgets."
        actions={
          <>
            <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={loadData}>
              Refresh
            </Button>
            {(role === 'ADMIN' || role === 'COMMISSIONER') && (
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => setExpenseDialogOpen(true)}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  backgroundColor: '#0f3d64',
                  '&:hover': { backgroundColor: '#0c3050' },
                }}
              >
                Log New Expense
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
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          label="Search description or department"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch color="#64748b" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          label="Filter by Category"
          size="small"
          sx={{ minWidth: 200 }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <MenuItem value="ALL">ALL CATEGORIES</MenuItem>
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Expense list */}
      {filteredExpenses.length === 0 ? (
        <EmptyState title="No Expenses Found" description="Try modifying filters or log a new operational expense." />
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Recorded At</TableCell>
                {(role === 'ADMIN' || role === 'COMMISSIONER') && (
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((exp) => (
                <TableRow key={exp.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>EXP-{exp.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{exp.department}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {exp.category}
                    </Box>
                  </TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#b45309' }}>
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    {new Date(exp.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  {(role === 'ADMIN' || role === 'COMMISSIONER') && (
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => handleDeleteExpense(exp.id)}>
                        <FiTrash2 />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Log Expense Dialog */}
      <Dialog open={expenseDialogOpen} onClose={() => setExpenseDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateExpense}>
          <DialogTitle sx={{ fontWeight: 800 }}>Log Municipal Expense</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            
            <TextField
              select
              label="Select Source Budget"
              required
              fullWidth
              value={selectedBudgetId || ''}
              onChange={(e) => {
                const bId = parseInt(e.target.value as string, 10) || 0;
                setSelectedBudgetId(bId);
                const selected = budgets.find((b) => b.id === bId);
                if (selected) {
                  setDept(selected.department);
                }
              }}
            >
              {budgets.map((b) => (
                <MenuItem key={b.id} value={b.id}>
                  {b.department} - Bal: ₹{b.remainingAmount.toLocaleString()}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Department Name"
              required
              disabled
              fullWidth
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            />

            <TextField
              select
              label="Expense Category"
              required
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Expense Description / Invoice reference"
              required
              multiline
              rows={2}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label="Expense Amount (₹)"
              type="number"
              required
              fullWidth
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
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
            <Button onClick={() => setExpenseDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#0f3d64' }}>
              Log Expense
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ExpenseManagementPage;
