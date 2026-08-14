import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import StatusChip from '../../components/status/StatusChip';
import PriorityChip from '../../components/status/PriorityChip';
import SLAIndicator from '../../components/status/SLAIndicator';
import GrievanceTimeline from '../../components/grievance/GrievanceTimeline';
import GrievanceFeedbackDialog from '../../components/grievance/GrievanceFeedbackDialog';
import GrievanceStatusDialog from '../../components/grievance/GrievanceStatusDialog';
import GrievanceAssignDialog from '../../components/grievance/GrievanceAssignDialog';
import { grievanceApi } from '../../services/grievanceApi';
import { Grievance, GrievanceHistory, Feedback } from '../../types/grievance.types';
import { FiArrowLeft, FiEdit3, FiUserPlus, FiStar } from 'react-icons/fi';

export const GrievanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, citizenProfile } = useAuth();

  const isCitizen = user?.role === 'CITIZEN';
  const isCommissionerOrAdmin = user?.role === 'COMMISSIONER' || user?.role === 'ADMIN';
  const isStaff = !isCitizen;

  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [history, setHistory] = useState<GrievanceHistory[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialogs
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const loadGrievanceData = async () => {
    if (!id) return;
    const grievanceId = Number(id);
    if (isNaN(grievanceId)) {
      setError('Invalid grievance ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const g = await grievanceApi.getGrievanceById(grievanceId);
      setGrievance(g);

      // Load history
      try {
        const h = await grievanceApi.getGrievanceHistory(grievanceId);
        setHistory(h || []);
      } catch {
        setHistory([]);
      }

      // Load feedback if resolved/closed
      if (g.status === 'RESOLVED' || g.status === 'CLOSED') {
        try {
          const f = await grievanceApi.getFeedback(grievanceId);
          setFeedback(f || null);
        } catch {
          setFeedback(null);
        }
      }
    } catch {
      setError('Grievance not found or failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievanceData();
  }, [id]);

  const handleStatusUpdateSuccess = (updated: Grievance) => {
    setGrievance(updated);
    grievanceApi.getGrievanceHistory(updated.id).then(setHistory).catch(() => {});
  };

  const handleAssignSuccess = (updated: Grievance) => {
    setGrievance(updated);
    grievanceApi.getGrievanceHistory(updated.id).then(setHistory).catch(() => {});
  };

  const handleFeedbackSuccess = (newFeedback: Feedback) => {
    setFeedback(newFeedback);
  };

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <CircularProgress size={36} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading grievance details...
        </Typography>
      </Box>
    );
  }

  if (error || !grievance) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Grievance not found'}
        </Alert>
        <Button variant="outlined" startIcon={<FiArrowLeft />} onClick={() => navigate('/grievances')}>
          Back to Grievances
        </Button>
      </Box>
    );
  }

  const canSubmitFeedback =
    isCitizen &&
    (grievance.status === 'RESOLVED' || grievance.status === 'CLOSED') &&
    !feedback &&
    Boolean(citizenProfile?.id);

  return (
    <Box>
      <PageHeader
        title={`Grievance #${grievance.id}: ${grievance.title}`}
        subtitle={`Reported on ${new Date(grievance.createdAt).toLocaleDateString()} | Category: ${grievance.category}`}
        actions={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<FiArrowLeft />}
              onClick={() => navigate('/grievances')}
            >
              Back
            </Button>

            {/* Commissioner/Admin Assignment / Reassignment */}
            {isCommissionerOrAdmin && grievance.status !== 'RESOLVED' && grievance.status !== 'CLOSED' && grievance.status !== 'REJECTED' && (
              <Button
                variant="contained"
                startIcon={<FiUserPlus />}
                onClick={() => setAssignDialogOpen(true)}
              >
                {grievance.assignedOfficerId ? 'Reassign Officer' : 'Assign Officer'}
              </Button>
            )}

            {/* Staff Status Workflow */}
            {isStaff && grievance.status !== 'CLOSED' && grievance.status !== 'REJECTED' && (
              <Button
                variant="contained"
                startIcon={<FiEdit3 />}
                onClick={() => setStatusDialogOpen(true)}
              >
                Update Status
              </Button>
            )}

            {/* Citizen Feedback Trigger */}
            {canSubmitFeedback && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FiStar />}
                onClick={() => setFeedbackDialogOpen(true)}
              >
                Submit Feedback
              </Button>
            )}
          </Box>
        }
      />

      <Grid container spacing={3}>
        {/* Left Column: Metadata & Description */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Main Info Paper */}
          <Paper elevation={0} sx={{ p: 3.5, mb: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusChip status={grievance.status} size="medium" />
                <PriorityChip priority={grievance.priority} size="medium" />
              </Box>
              <SLAIndicator slaStatus={grievance.slaStatus} status={grievance.status} dueDate={grievance.dueDate} showCountdown size="medium" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Issue Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {grievance.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Metadata Grid */}
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
              Grievance Metadata & Assignment
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Location / Landmark</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{grievance.location}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{grievance.category}</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Citizen ID</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Citizen #{grievance.citizenId}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Department Assignment</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {grievance.departmentId ? `Department #${grievance.departmentId}` : 'Unassigned'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Assigned Officer</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {grievance.assignedOfficerId ? `Officer #${grievance.assignedOfficerId}` : 'Pending Assignment'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">SLA Target Due Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {grievance.dueDate ? new Date(grievance.dueDate).toLocaleString() : 'Calculated on assignment'}
                </Typography>
              </Grid>

              {grievance.resolvedAt && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Resolved Timestamp</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {new Date(grievance.resolvedAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Citizen Feedback Display */}
          {feedback && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3, backgroundColor: '#fdfbf7' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Citizen Feedback & Rating
                </Typography>
                <Rating value={feedback.rating} readOnly size="medium" />
              </Box>
              {feedback.comments ? (
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.primary', mt: 1 }}>
                  &ldquo;{feedback.comments}&rdquo;
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No additional comments provided.
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Submitted on {new Date(feedback.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Right Column: History Timeline */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Lifecycle History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Verifiable audit trail of status transitions and officer actions
            </Typography>

            <GrievanceTimeline history={history} />
          </Paper>
        </Grid>
      </Grid>

      {/* Staff Status Dialog */}
      {grievance && (
        <GrievanceStatusDialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          grievance={grievance}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}

      {/* Commissioner/Admin Assign Dialog */}
      {grievance && (
        <GrievanceAssignDialog
          open={assignDialogOpen}
          onClose={() => setAssignDialogOpen(false)}
          grievance={grievance}
          onSuccess={handleAssignSuccess}
        />
      )}

      {/* Citizen Feedback Dialog */}
      {grievance && citizenProfile?.id && (
        <GrievanceFeedbackDialog
          open={feedbackDialogOpen}
          onClose={() => setFeedbackDialogOpen(false)}
          grievanceId={grievance.id}
          citizenId={citizenProfile.id}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </Box>
  );
};

export default GrievanceDetailPage;
