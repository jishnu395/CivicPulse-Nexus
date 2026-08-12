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
  Collapse,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ROUTES } from '../constants/routes';
import {
  FiHome,
  FiUser,
  FiAlertCircle,
  FiFileText,
  FiHeart,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
  FiActivity,
  FiChevronDown,
  FiChevronRight,
  FiCheckSquare,
  FiTrendingUp,
  FiAward,
} from 'react-icons/fi';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  children?: { label: string; path: string; icon?: React.ReactNode }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    Grievances: true,
    Services: true,
    Welfare: true,
    Finance: true,
    Reports: true,
    Governance: true,
  });

  const handleToggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const getCitizenNav = (): NavItem[] => [
    { label: 'Dashboard', path: ROUTES.CITIZEN_DASHBOARD, icon: <FiHome /> },
    { label: 'Profile', path: ROUTES.CITIZEN_PROFILE, icon: <FiUser /> },
    {
      label: 'Grievances',
      icon: <FiAlertCircle />,
      children: [
        { label: 'My Grievances', path: ROUTES.CITIZEN_GRIEVANCES },
        { label: 'Raise Grievance', path: ROUTES.CITIZEN_RAISE_GRIEVANCE },
      ],
    },
    {
      label: 'Services',
      icon: <FiFileText />,
      children: [
        { label: 'Certificates', path: ROUTES.CITIZEN_CERTIFICATES },
        { label: 'Permits', path: ROUTES.CITIZEN_PERMITS },
        { label: 'My Applications', path: ROUTES.CITIZEN_APPLICATIONS },
      ],
    },
    {
      label: 'Welfare',
      icon: <FiHeart />,
      children: [{ label: 'Welfare Schemes', path: ROUTES.CITIZEN_WELFARE }],
    },
  ];

  const getOfficerNav = (): NavItem[] => [
    { label: 'Dashboard', path: ROUTES.OFFICER_DASHBOARD, icon: <FiHome /> },
    {
      label: 'Grievances',
      icon: <FiAlertCircle />,
      children: [
        { label: 'Assigned Tickets', path: ROUTES.OFFICER_GRIEVANCES_ASSIGNED },
        { label: 'Pending Queue', path: ROUTES.OFFICER_GRIEVANCES_PENDING },
        { label: 'SLA Monitoring', path: ROUTES.OFFICER_GRIEVANCES_SLA },
        { label: 'Escalated Issues', path: ROUTES.OFFICER_GRIEVANCES_ESCALATED },
      ],
    },
    {
      label: 'Applications',
      icon: <FiCheckSquare />,
      children: [
        { label: 'Verification Queue', path: ROUTES.OFFICER_APPLICATIONS_VERIFICATION },
        { label: 'Issue Approvals', path: ROUTES.OFFICER_APPLICATIONS_APPROVALS },
      ],
    },
    {
      label: 'Welfare',
      icon: <FiHeart />,
      children: [
        { label: 'Scheme Applications', path: ROUTES.OFFICER_WELFARE_APPLICATIONS },
        { label: 'Beneficiaries', path: ROUTES.OFFICER_WELFARE_BENEFICIARIES },
      ],
    },
    { label: 'Fund Distribution', path: ROUTES.OFFICER_FUND_DISTRIBUTION, icon: <FiDollarSign /> },
  ];

  const getCommissionerNav = (): NavItem[] => [
    { label: 'Governance Dashboard', path: ROUTES.COMMISSIONER_DASHBOARD, icon: <FiHome /> },
    {
      label: 'Grievances',
      icon: <FiAlertCircle />,
      children: [
        { label: 'City Monitoring', path: ROUTES.COMMISSIONER_GRIEVANCES_MONITORING },
        { label: 'SLA Performance', path: ROUTES.COMMISSIONER_GRIEVANCES_SLA },
      ],
    },
    { label: 'Department Performance', path: ROUTES.COMMISSIONER_DEPARTMENT_PERFORMANCE, icon: <FiTrendingUp /> },
    { label: 'Budget Oversight', path: ROUTES.COMMISSIONER_BUDGET, icon: <FiDollarSign /> },
    { label: 'Welfare Oversight', path: ROUTES.COMMISSIONER_WELFARE, icon: <FiHeart /> },
    {
      label: 'Governance Reports',
      icon: <FiBarChart2 />,
      children: [
        { label: 'Executive Analytics', path: ROUTES.ANALYTICS_EXECUTIVE },
        { label: 'Citizen Report', path: ROUTES.ANALYTICS_CITIZENS },
        { label: 'Grievance Report', path: ROUTES.ANALYTICS_GRIEVANCES },
        { label: 'Revenue Report', path: ROUTES.ANALYTICS_REVENUE },
        { label: 'Budget Report', path: ROUTES.ANALYTICS_BUDGET },
        { label: 'Department Scorecards', path: ROUTES.ANALYTICS_DEPARTMENTS },
        { label: 'Citizen Satisfaction', path: ROUTES.ANALYTICS_SATISFACTION },
      ],
    },
  ];

  const getAdminNav = (): NavItem[] => [
    { label: 'Executive Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <FiHome /> },
    {
      label: 'User Management',
      icon: <FiUsers />,
      children: [
        { label: 'Staff & Roles', path: ROUTES.ADMIN_USERS },
        { label: 'Citizen Directory', path: ROUTES.ADMIN_CITIZENS },
      ],
    },
    { label: 'Grievance Control', path: ROUTES.ADMIN_GRIEVANCES, icon: <FiAlertCircle /> },
    {
      label: 'Municipal Services',
      icon: <FiFileText />,
      children: [
        { label: 'Certificates', path: ROUTES.ADMIN_CERTIFICATES },
        { label: 'Permits', path: ROUTES.ADMIN_PERMITS },
      ],
    },
    {
      label: 'Welfare Management',
      icon: <FiHeart />,
      children: [
        { label: 'Schemes & Beneficiaries', path: ROUTES.ADMIN_WELFARE },
      ],
    },
    {
      label: 'Finance & Budget',
      icon: <FiDollarSign />,
      children: [
        { label: 'Budgets', path: ROUTES.ADMIN_BUDGETS },
        { label: 'Allocations', path: ROUTES.ADMIN_ALLOCATIONS },
        { label: 'Expenses', path: ROUTES.ADMIN_EXPENSES },
        { label: 'Fund Distribution', path: ROUTES.ADMIN_FUND_DISTRIBUTION },
      ],
    },
    {
      label: 'Governance Analytics',
      icon: <FiBarChart2 />,
      children: [
        { label: 'Executive Overview', path: ROUTES.ANALYTICS_EXECUTIVE },
        { label: 'Citizen Report', path: ROUTES.ANALYTICS_CITIZENS },
        { label: 'Grievance Report', path: ROUTES.ANALYTICS_GRIEVANCES },
        { label: 'Revenue Report', path: ROUTES.ANALYTICS_REVENUE },
        { label: 'Budget Report', path: ROUTES.ANALYTICS_BUDGET },
        { label: 'Department Scorecards', path: ROUTES.ANALYTICS_DEPARTMENTS },
        { label: 'Citizen Satisfaction', path: ROUTES.ANALYTICS_SATISFACTION },
      ],
    },
    { label: 'Audit Logs', path: ROUTES.ADMIN_AUDIT, icon: <FiActivity /> },
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

  const handleNavClick = (path?: string) => {
    if (path) {
      navigate(path);
      onMobileClose();
    }
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
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isSelected = item.path ? location.pathname === item.path : false;
            const isOpen = openSections[item.label] ?? true;

            if (hasChildren) {
              const hasActiveChild = item.children?.some((c) => location.pathname === c.path);

              return (
                <Box key={item.label} sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleToggleSection(item.label)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 1.5,
                      color: hasActiveChild ? '#0f3d64' : '#475569',
                      fontWeight: hasActiveChild ? 700 : 500,
                      '&:hover': { backgroundColor: '#f8fafc', color: '#0f3d64' },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 32,
                        color: hasActiveChild ? '#0f3d64' : '#64748b',
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
                            fontWeight: hasActiveChild ? 700 : 600,
                          },
                        },
                      }}
                      primary={item.label}
                    />
                    {isOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                  </ListItemButton>

                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2, mt: 0.5 }}>
                      {item.children?.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <ListItemButton
                            key={child.path}
                            onClick={() => handleNavClick(child.path)}
                            sx={{
                              borderRadius: 1.5,
                              py: 0.75,
                              px: 1.5,
                              mb: 0.25,
                              backgroundColor: isChildActive ? '#f1f5f9' : 'transparent',
                              color: isChildActive ? '#0f3d64' : '#64748b',
                              fontWeight: isChildActive ? 700 : 500,
                              borderLeft: isChildActive ? '3px solid #0f3d64' : '3px solid transparent',
                              '&:hover': {
                                backgroundColor: '#f8fafc',
                                color: '#0f3d64',
                              },
                            }}
                          >
                            <ListItemText
                              slotProps={{
                                primary: {
                                  sx: {
                                    fontSize: '0.8125rem',
                                    fontWeight: isChildActive ? 700 : 500,
                                  },
                                },
                              }}
                              primary={child.label}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
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
          CivicPulse Nexus v2.4 (M4)
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
