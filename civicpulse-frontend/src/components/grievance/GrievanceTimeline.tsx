import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { GrievanceHistory } from '../../types/grievance.types';
import StatusChip from '../status/StatusChip';

interface GrievanceTimelineProps {
  history: GrievanceHistory[];
  loading?: boolean;
}

export const GrievanceTimeline: React.FC<GrievanceTimelineProps> = ({ history, loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Loading history timeline...
        </Typography>
      </Box>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No history records available yet.
        </Typography>
      </Box>
    );
  }

  // Sort history chronologically (latest at top or bottom)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  return (
    <Box sx={{ position: 'relative', pl: 3, my: 2 }}>
      {/* Vertical tracking line */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          bottom: 16,
          left: 11,
          width: 2,
          backgroundColor: '#e2e8f0',
        }}
      />

      <Stack spacing={3}>
        {sortedHistory.map((item, index) => {
          const isLatest = index === sortedHistory.length - 1;
          return (
            <Box key={item.id || index} sx={{ position: 'relative' }}>
              {/* Dot Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  left: -24,
                  top: 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: isLatest ? 'primary.main' : '#ffffff',
                  border: isLatest ? '3px solid #bfdbfe' : '2px solid #94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isLatest ? '#ffffff' : '#64748b',
                  zIndex: 1,
                }}
              >
                {isLatest ? (
                  <FiCheckCircle size={10} />
                ) : item.status === 'ESCALATED' ? (
                  <FiAlertCircle size={10} color="#ef4444" />
                ) : (
                  <FiClock size={10} />
                )}
              </Box>

              {/* Card content */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: isLatest ? '#f8fafc' : '#ffffff',
                  border: '1px solid',
                  borderColor: isLatest ? '#cbd5e1' : '#e2e8f0',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75, flexWrap: 'wrap', gap: 1 }}>
                  <StatusChip status={item.status} size="small" />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {new Date(item.updatedAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </Typography>
                </Box>
                {item.remarks && (
                  <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
                    {item.remarks}
                  </Typography>
                )}
              </Paper>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default GrievanceTimeline;
