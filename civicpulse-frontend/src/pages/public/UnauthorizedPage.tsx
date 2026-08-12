import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../../auth/useAuth';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { getDashboardRoute } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 480,
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '1.75rem',
          }}
        >
          <FiLock />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
          Access Restricted
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          You do not have administrative permission or the required role to access this governance area.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(getDashboardRoute())}
          sx={{ backgroundColor: '#0f3d64', '&:hover': { backgroundColor: '#1e5d94' } }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;
