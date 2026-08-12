import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: string;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const getStatusConfig = (rawStatus: string): { label: string; color: ChipProps['color']; bg: string; text: string } => {
    const s = (rawStatus || '').toUpperCase();
    switch (s) {
      case 'SUBMITTED':
      case 'PENDING':
      case 'UNDER_VERIFICATION':
        return { label: s.replace('_', ' '), color: 'warning', bg: '#fef3c7', text: '#b45309' };
      case 'ASSIGNED':
      case 'IN_PROGRESS':
      case 'VERIFIED':
        return { label: s.replace('_', ' '), color: 'info', bg: '#dbeafe', text: '#1d4ed8' };
      case 'RESOLVED':
      case 'APPROVED':
      case 'COMPLETED':
      case 'ACTIVE':
      case 'PAID':
        return { label: s.replace('_', ' '), color: 'success', bg: '#d1fae5', text: '#047857' };
      case 'CLOSED':
        return { label: 'CLOSED', color: 'default', bg: '#f1f5f9', text: '#475569' };
      case 'REJECTED':
      case 'FAILED':
      case 'INACTIVE':
      case 'ESCALATED':
        return { label: s.replace('_', ' '), color: 'error', bg: '#fee2e2', text: '#b91c1c' };
      default:
        return { label: rawStatus || 'UNKNOWN', color: 'default', bg: '#f1f5f9', text: '#475569' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bg,
        color: config.text,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.8125rem',
        borderRadius: '6px',
        border: '1px solid transparent',
      }}
    />
  );
};

export default StatusChip;
