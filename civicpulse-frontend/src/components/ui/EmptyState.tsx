import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  minHeight?: string | number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionText,
  onAction,
  icon,
  minHeight = '280px',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        width: '100%',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 420,
          border: '1px dashed #cbd5e1',
          backgroundColor: '#f8fafc',
          borderRadius: 2.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#e2e8f0',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '1.5rem',
          }}
        >
          {icon || <FiInbox />}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: actionText ? 2.5 : 0 }}>
          {description}
        </Typography>
        {actionText && onAction && (
          <Button
            variant="contained"
            size="small"
            onClick={onAction}
            sx={{
              backgroundColor: '#0f3d64',
              '&:hover': { backgroundColor: '#1e5d94' },
            }}
          >
            {actionText}
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default EmptyState;
