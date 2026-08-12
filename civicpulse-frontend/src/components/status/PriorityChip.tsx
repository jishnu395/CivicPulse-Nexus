import React from 'react';
import { Chip } from '@mui/material';

interface PriorityChipProps {
  priority: string;
  size?: 'small' | 'medium';
}

export const PriorityChip: React.FC<PriorityChipProps> = ({ priority, size = 'small' }) => {
  const getPriorityConfig = (rawPriority: string): { label: string; bg: string; text: string } => {
    const p = (rawPriority || '').toUpperCase();
    switch (p) {
      case 'URGENT':
      case 'CRITICAL':
        return { label: p, bg: '#fee2e2', text: '#991b1b' };
      case 'HIGH':
        return { label: 'HIGH', bg: '#ffedd5', text: '#c2410c' };
      case 'MEDIUM':
        return { label: 'MEDIUM', bg: '#fef3c7', text: '#b45309' };
      case 'LOW':
        return { label: 'LOW', bg: '#f1f5f9', text: '#475569' };
      default:
        return { label: rawPriority || 'NORMAL', bg: '#f1f5f9', text: '#475569' };
    }
  };

  const config = getPriorityConfig(priority);

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
      }}
    />
  );
};

export default PriorityChip;
