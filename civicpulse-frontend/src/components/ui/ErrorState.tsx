import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  minHeight?: string | number;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An error occurred while communicating with the server. Please try again.',
  onRetry,
  minHeight = '300px',
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
          maxWidth: 460,
          border: '1px solid #fee2e2',
          backgroundColor: '#fffaf0',
          borderRadius: 2.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '1.5rem',
          }}
        >
          <FiAlertCircle />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#991b1b', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#7f1d1d', mb: onRetry ? 2.5 : 0 }}>
          {message}
        </Typography>
        {onRetry && (
          <Button
            variant="outlined"
            size="small"
            onClick={onRetry}
            startIcon={<FiRefreshCw />}
            sx={{
              color: '#991b1b',
              borderColor: '#fca5a5',
              '&:hover': {
                borderColor: '#ef4444',
                backgroundColor: '#fee2e2',
              },
            }}
          >
            Retry Request
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorState;
