import React from 'react';
import { Chip, Tooltip, Box, Typography } from '@mui/material';
import { FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { GrievanceStatus, SLAStatus } from '../../types/grievance.types';

interface SLAIndicatorProps {
  slaStatus: SLAStatus;
  status?: GrievanceStatus;
  dueDate?: string;
  showCountdown?: boolean;
  size?: 'small' | 'medium';
}

export const SLAIndicator: React.FC<SLAIndicatorProps> = ({
  slaStatus,
  status,
  dueDate,
  showCountdown = false,
  size = 'small',
}) => {
  const isTerminal = status === 'RESOLVED' || status === 'CLOSED' || status === 'REJECTED';

  const getRemainingTime = (due?: string): string => {
    if (!due || isTerminal) return '';
    const now = new Date().getTime();
    const dueTime = new Date(due).getTime();
    const diffMs = dueTime - now;

    if (diffMs < 0) {
      const daysOverdue = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
      const hoursOverdue = Math.floor((Math.abs(diffMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return daysOverdue > 0 ? `${daysOverdue}d ${hoursOverdue}h overdue` : `${hoursOverdue}h overdue`;
    } else {
      const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h remaining` : `${hoursLeft}h remaining`;
    }
  };

  const remaining = dueDate ? getRemainingTime(dueDate) : '';

  const getSLAConfig = () => {
    switch (slaStatus) {
      case 'WITHIN_SLA':
        return {
          label: 'Within SLA',
          icon: <FiCheckCircle style={{ marginRight: 4 }} />,
          bg: '#ecfdf5',
          text: '#065f46',
          border: '#a7f3d0',
          tooltip: dueDate ? `Target Due Date: ${new Date(dueDate).toLocaleString()} (${remaining})` : 'Within SLA SLA Target',
        };
      case 'NEAR_DEADLINE':
        return {
          label: 'Near Deadline',
          icon: <FiClock style={{ marginRight: 4 }} />,
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fde68a',
          tooltip: dueDate ? `Approaching Due Date: ${new Date(dueDate).toLocaleString()} (${remaining})` : 'Approaching SLA Deadline',
        };
      case 'OVERDUE':
        return {
          label: 'SLA Breached',
          icon: <FiAlertTriangle style={{ marginRight: 4 }} />,
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fecaca',
          tooltip: dueDate ? `SLA Breached! Was Due: ${new Date(dueDate).toLocaleString()} (${remaining})` : 'SLA Target Breached',
        };
      default:
        return {
          label: slaStatus || 'SLA Active',
          icon: <FiClock style={{ marginRight: 4 }} />,
          bg: '#f8fafc',
          text: '#475569',
          border: '#e2e8f0',
          tooltip: 'SLA Status',
        };
    }
  };

  const config = getSLAConfig();

  return (
    <Tooltip title={config.tooltip} arrow>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={config.icon}
          label={config.label}
          size={size}
          sx={{
            backgroundColor: config.bg,
            color: config.text,
            borderColor: config.border,
            borderWidth: 1,
            borderStyle: 'solid',
            fontWeight: 600,
            fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />
        {showCountdown && remaining && (
          <Typography
            variant="caption"
            sx={{
              color: slaStatus === 'OVERDUE' ? 'error.main' : 'text.secondary',
              fontWeight: 500,
            }}
          >
            {remaining}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default SLAIndicator;
