import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { grievanceApi } from '../../services/grievanceApi';
import { Feedback } from '../../types/grievance.types';

interface GrievanceFeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  grievanceId: number;
  citizenId: number;
  onSuccess: (feedback: Feedback) => void;
}

export const GrievanceFeedbackDialog: React.FC<GrievanceFeedbackDialogProps> = ({
  open,
  onClose,
  grievanceId,
  citizenId,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number | null>(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please provide a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      const feedback = await grievanceApi.submitFeedback(grievanceId, {
        citizenId,
        rating,
        comments: comments.trim() || undefined,
      });
      toast.success('Thank you! Your feedback has been submitted.');
      onSuccess(feedback);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          Grievance Resolution Feedback
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your feedback helps municipal administration improve public services and officer response times.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <Typography component="legend" variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Rate your resolution satisfaction
              </Typography>
              <Rating
                name="resolution-rating"
                value={rating}
                precision={1}
                size="large"
                onChange={(_, newValue) => setRating(newValue)}
              />
            </Box>

            <TextField
              label="Additional Comments (Optional)"
              placeholder="Tell us about the quality and speed of resolution..."
              multiline
              rows={3}
              fullWidth
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !rating}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GrievanceFeedbackDialog;
