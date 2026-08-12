import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiHelpCircle } from 'react-icons/fi';
import { useAuth } from '../../auth/useAuth';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getDashboardRoute } = useAuth();

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
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '1.75rem',
          }}
        >
          <FiHelpCircle />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          The governance portal page you requested does not exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(isAuthenticated ? getDashboardRoute() : '/login')}
          sx={{ backgroundColor: '#0f3d64', '&:hover': { backgroundColor: '#1e5d94' } }}
        >
          {isAuthenticated ? 'Return to Dashboard' : 'Go to Login'}
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
