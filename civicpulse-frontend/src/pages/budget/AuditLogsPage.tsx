import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import { FiRefreshCw } from 'react-icons/fi';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import budgetApi from '../../services/budgetApi';
import { AuditLogResponse } from '../../types/budget.types';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [entityType, setEntityType] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetApi.getAllAuditLogs();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch financial audit trail');
    } finally {
      setLoading(false);
    }
  };

  const entityTypes = ['ALL', ...Array.from(new Set(logs.map((l) => l.entityType)))];

  const filteredLogs = logs.filter((log) => {
    return entityType === 'ALL' || log.entityType === entityType;
  });

  if (loading) {
    return <LoadingState message="Loading immutable financial audit trail..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchLogs} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Financial Audit Trail"
        subtitle="Immutable transaction logs recording all budget creations, allocations, expenses, and disbursements."
        actions={
          <Button variant="outlined" startIcon={<FiRefreshCw />} onClick={fetchLogs}>
            Refresh
          </Button>
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
          label="Filter by Entity Type"
          size="small"
          fullWidth
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
        >
          {entityTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type === 'ALL' ? 'ALL ENTITIES' : type}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState title="No Audit Logs" description="There are no transaction records matching the entity type filter." />
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Log ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Entity Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Entity ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Performed By</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => {
                const date = new Date(log.timestamp).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>
                      AUD-{log.id.toString().padStart(4, '0')}
                    </TableCell>
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
                        {log.entityType}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>#{log.entityId}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0f3d64' }}>{log.action}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.performedBy || 'System'}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AuditLogsPage;
