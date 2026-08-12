import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in UI:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
            backgroundColor: '#f8fafc',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
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
              <FiAlertTriangle />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              An unexpected application error occurred. Please refresh or return to the main dashboard.
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{
                backgroundColor: '#0f3d64',
                '&:hover': { backgroundColor: '#1e5d94' },
                px: 3,
              }}
            >
              Return Home
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
