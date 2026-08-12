import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ROUTES } from '../constants/routes';
import {
  FiHome,
  FiUser,
  FiAlertCircle,
  FiPlusCircle,
  FiUsers,
  FiAward,
  FiFileText,
  FiCheckSquare,
} from 'react-icons/fi';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getCitizenNav = (): NavItem[] => [
    { label: 'Dashboard', path: ROUTES.CITIZEN_DASHBOARD, icon: <FiHome /> },
    { label: 'My Grievances', path: '/grievances', icon: <FiAlertCircle /> },
    { label: 'Raise Grievance', path: '/grievances/new', icon: <FiPlusCircle /> },
    { label: 'Apply for Service', path: ROUTES.SERVICE_APPLY, icon: <FiFileText /> },
    { label: 'My Applications', path: ROUTES.SERVICE_APPLICATIONS, icon: <FiCheckSquare /> },
    { label: 'My Profile', path: ROUTES.CITIZEN_PROFILE, icon: <FiUser /> },
  ];

  const getOfficerNav = (): NavItem[] => [
    { label: 'Grievance Management', path: '/grievances', icon: <FiAlertCircle /> },
    { label: 'Application Verification', path: ROUTES.STAFF_APPLICATIONS, icon: <FiCheckSquare /> },
    { label: 'Citizen Directory', path: '/citizens', icon: <FiUsers /> },
  ];

  const getCommissionerNav = (): NavItem[] => [
    { label: 'Grievance Oversight', path: '/grievances', icon: <FiAlertCircle /> },
    { label: 'Application Approvals', path: ROUTES.STAFF_APPLICATIONS, icon: <FiCheckSquare /> },
    { label: 'Citizen Directory', path: '/citizens', icon: <FiUsers /> },
  ];

  const getAdminNav = (): NavItem[] => [
    { label: 'Grievance Control', path: '/grievances', icon: <FiAlertCircle /> },
    { label: 'Applications Workbench', path: ROUTES.STAFF_APPLICATIONS, icon: <FiCheckSquare /> },
    { label: 'Citizen Directory', path: '/citizens', icon: <FiUsers /> },
  ];

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'CITIZEN':
        return getCitizenNav();
      case 'OFFICER':
        return getOfficerNav();
      case 'COMMISSIONER':
        return getCommissionerNav();
      case 'ADMIN':
        return getAdminNav();
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            backgroundColor: '#0f3d64',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
        >
          <FiAward />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f3d64', lineHeight: 1.2 }}>
            CIVICPULSE
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
            {role ? `${role} PORTAL` : 'GOVERNANCE'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5 }}>
        <List component="nav" disablePadding>
          {navItems.map((item) => {
            const isSelected = location.pathname === item.path;

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                    color: isSelected ? '#0f3d64' : '#475569',
                    fontWeight: isSelected ? 700 : 500,
                    borderLeft: isSelected ? '3px solid #0f3d64' : '3px solid transparent',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      color: '#0f3d64',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: isSelected ? '#0f3d64' : '#64748b',
                      fontSize: '1.125rem',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 700 : 600,
                        },
                      },
                    }}
                    primary={item.label}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
        <Typography variant="body2" sx={{ fontSize: '0.6875rem', color: '#94a3b8', textAlign: 'center' }}>
          CivicPulse Nexus (Milestones 1 & 2)
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            borderRight: '1px solid #e2e8f0',
            top: 64,
            height: 'calc(100% - 64px)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
