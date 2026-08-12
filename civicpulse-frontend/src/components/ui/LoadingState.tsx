import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  minHeight?: string | number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  minHeight = '300px',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        width: '100%',
        p: 3,
      }}
    >
      <CircularProgress size={36} thickness={4} sx={{ color: '#0f3d64', mb: 2 }} />
      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState;
