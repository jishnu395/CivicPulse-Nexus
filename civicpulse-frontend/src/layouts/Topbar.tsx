import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../auth/useAuth';
import { ROLE_NAMES } from '../constants/roles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface TopbarProps {
  onSidebarToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onSidebarToggle }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleGoProfile = () => {
    handleMenuClose();
    if (role === 'CITIZEN') {
      navigate(ROUTES.CITIZEN_PROFILE);
    }
  };

  const roleLabel = role ? ROLE_NAMES[role] || role : 'User';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onSidebarToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <FiMenu size={20} />
        </IconButton>

        {/* Brand / Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              backgroundColor: '#0f3d64',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
            }}
          >
            <FiShield />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              color: '#0f3d64',
              letterSpacing: '-0.02em',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            CIVICPULSE <span style={{ color: '#0284c7' }}>NEXUS</span>
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Role badge */}
        {role && (
          <Chip
            size="small"
            label={roleLabel}
            sx={{
              mr: 2,
              display: { xs: 'none', sm: 'inline-flex' },
              backgroundColor:
                role === 'ADMIN'
                  ? '#fee2e2'
                  : role === 'COMMISSIONER'
                  ? '#fef3c7'
                  : role === 'OFFICER'
                  ? '#dbeafe'
                  : '#d1fae5',
              color:
                role === 'ADMIN'
                  ? '#991b1b'
                  : role === 'COMMISSIONER'
                  ? '#92400e'
                  : role === 'OFFICER'
                  ? '#1e40af'
                  : '#065f46',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Notification UI Shell */}
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{
            mr: 1,
            color: '#64748b',
            '&:hover': { color: '#0f3d64', backgroundColor: '#f1f5f9' },
          }}
        >
          <FiBell size={18} />
        </IconButton>

        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                width: 320,
                p: 1,
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                mt: 1,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
              System notifications and activity alerts
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              No new notifications
            </Typography>
          </Box>
        </Menu>

        {/* User profile dropdown */}
        <Box
          onClick={handleProfileMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            cursor: 'pointer',
            p: 0.5,
            pr: 1,
            borderRadius: 2,
            '&:hover': { backgroundColor: '#f1f5f9' },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor: '#0f3d64',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {user?.firstName ? user.firstName[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                width: 220,
                p: 0.5,
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                mt: 1,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Signed in as'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              {user?.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {role === 'CITIZEN' && (
            <MenuItem onClick={handleGoProfile} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 32, color: '#64748b' }}>
                <FiUser size={16} />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    sx: { fontSize: '0.875rem' },
                  },
                }}
                primary="Citizen Profile"
              />
            </MenuItem>
          )}

          <MenuItem onClick={handleLogout} sx={{ borderRadius: 1, color: '#ef4444' }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#ef4444' }}>
              <FiLogOut size={16} />
            </ListItemIcon>
            <ListItemText
              slotProps={{
                primary: {
                  sx: { fontSize: '0.875rem', fontWeight: 600 },
                },
              }}
              primary="Sign Out"
            />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
