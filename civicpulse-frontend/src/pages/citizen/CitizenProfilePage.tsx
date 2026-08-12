import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatusChip from '../../components/status/StatusChip';
import CitizenEditDialog from '../../components/citizen/CitizenEditDialog';
import { FiEdit2, FiUser, FiMapPin, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

export const CitizenProfilePage: React.FC = () => {
  const { citizenProfile, user, refreshCitizenProfile } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const handleEditSuccess = () => {
    if (refreshCitizenProfile) {
      refreshCitizenProfile();
    }
  };

  if (!citizenProfile) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No citizen profile loaded. Please complete onboarding.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Citizen Profile"
        subtitle="View and update your official municipal registration details and address."
        actions={
          <Button
            variant="contained"
            startIcon={<FiEdit2 />}
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 32,
              }}
            >
              <FiUser />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {citizenProfile.firstName} {citizenProfile.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Citizen ID: {citizenProfile.citizenId || `#${citizenProfile.id}`}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <StatusChip status={citizenProfile.status || 'ACTIVE'} size="medium" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiMail color="#64748b" />
                <Typography variant="body2">{citizenProfile.email || user?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiPhone color="#64748b" />
                <Typography variant="body2">{citizenProfile.phoneNumber}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiCalendar color="#64748b" />
                <Typography variant="body2">DOB: {citizenProfile.dateOfBirth}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiMapPin color="#64748b" />
                <Typography variant="body2">Ward {citizenProfile.wardNumber}, {citizenProfile.city}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Demographics */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              border: '1px solid #e2e8f0',
              borderRadius: 3,
            }}
          >
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2.5 }}>
              Official Civic Demographics
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">First Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.firstName}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Last Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.lastName}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Gender</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.gender}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.dateOfBirth}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.phoneNumber}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Ward Jurisdiction</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Ward {citizenProfile.wardNumber}</Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">Residential Street Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.address}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">City</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.city}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">State</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.state}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary">Postal Code</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{citizenProfile.postalCode}</Typography>
              </Grid>

              {citizenProfile.createdAt && (
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Profile Registered On: {new Date(citizenProfile.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      {citizenProfile && (
        <CitizenEditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          citizen={citizenProfile}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
};

export default CitizenProfilePage;
