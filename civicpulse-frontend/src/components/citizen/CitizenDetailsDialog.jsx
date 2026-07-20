import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

const DetailItem = ({ label, value }) => (
  <>
    <Grid size={{ xs: 12, sm: 4 }}>
      <Typography fontWeight={600}>{label}</Typography>
    </Grid>

    <Grid size={{ xs: 12, sm: 8 }}>
      <Typography>{value || "-"}</Typography>
    </Grid>
  </>
);

const CitizenDetailsDialog = ({ open, onClose, citizen }) => {
  if (!citizen) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Citizen Details</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <DetailItem
            label="Citizen ID"
            value={citizen.citizenId}
          />

          <DetailItem
            label="Name"
            value={`${citizen.firstName} ${citizen.lastName}`}
          />

          <DetailItem
            label="Email"
            value={citizen.email}
          />

          <DetailItem
            label="Phone"
            value={citizen.phoneNumber}
          />

          <DetailItem
            label="Gender"
            value={citizen.gender}
          />

          <DetailItem
            label="Date of Birth"
            value={citizen.dateOfBirth}
          />

          <DetailItem
            label="Ward"
            value={citizen.wardNumber}
          />

          <DetailItem
            label="City"
            value={citizen.city}
          />

          <DetailItem
            label="State"
            value={citizen.state}
          />

          <DetailItem
            label="Postal Code"
            value={citizen.postalCode}
          />

          <Grid size={4}>
            <Typography fontWeight={600}>
              Status
            </Typography>
          </Grid>

          <Grid size={8}>
            <Chip
              label={citizen.status}
              color={
                citizen.status === "ACTIVE"
                  ? "success"
                  : "error"
              }
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid size={12}>
            <Typography fontWeight={600}>
              Address
            </Typography>

            <Typography mt={1}>
              {citizen.address}
            </Typography>
          </Grid>

          <DetailItem
            label="Created At"
            value={citizen.createdAt}
          />

          <DetailItem
            label="Updated At"
            value={citizen.updatedAt}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CitizenDetailsDialog;