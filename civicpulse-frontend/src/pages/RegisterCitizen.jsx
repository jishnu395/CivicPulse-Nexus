import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";

import CitizenForm from "../components/citizen/CitizenForm";
import citizenService from "../services/citizenService";

const RegisterCitizen = () => {
  const [open, setOpen] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleSubmit = async (data) => {
    try {
      await citizenService.registerCitizen(data);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Citizen Registered Successfully",
      });

      setOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message ||
          "Registration Failed",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" mb={3}>
          Citizen Registration
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Register Citizen
        </Button>

        <CitizenForm
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          citizen={null}
          title="Register Citizen"
        />
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterCitizen;