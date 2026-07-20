import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import citizenService from "../services/citizenService";
import CitizenTable from "../components/citizen/CitizenTable";
import CitizenForm from "../components/citizen/CitizenForm";
import CitizenDetailsDialog from "../components/citizen/CitizenDetailsDialog";
import DeleteCitizenDialog from "../components/citizen/DeleteCitizenDialog";
import { getRole } from "../utils/auth";

const CitizenList = () => {
  const role = getRole();

  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [ward, setWard] = useState("");

  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editing, setEditing] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const loadCitizens = async () => {
    try {
      setLoading(true);
      const res = await citizenService.getAllCitizens();
      setCitizens(res.data);
    } catch (e) {
      showSnackbar("Failed to load citizens", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitizens();
  }, []);

  const filteredCitizens = useMemo(() => {
    return citizens.filter((citizen) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        citizen.firstName.toLowerCase().includes(keyword) ||
        citizen.lastName.toLowerCase().includes(keyword) ||
        citizen.email.toLowerCase().includes(keyword) ||
        citizen.phoneNumber.toLowerCase().includes(keyword);

      const matchesStatus =
        status === "" || citizen.status === status;

      const matchesWard =
        ward === "" || citizen.wardNumber === ward;

      return matchesSearch && matchesStatus && matchesWard;
    });
  }, [citizens, search, status, ward]);

  const wards = [...new Set(citizens.map((c) => c.wardNumber))];

  const handleAdd = () => {
    setEditing(false);
    setSelectedCitizen(null);
    setFormOpen(true);
  };

  const handleEdit = (citizen) => {
    setEditing(true);
    setSelectedCitizen(citizen);
    setFormOpen(true);
  };

  const handleView = (citizen) => {
    setSelectedCitizen(citizen);
    setDetailsOpen(true);
  };

  const handleDelete = (citizen) => {
    setSelectedCitizen(citizen);
    setDeleteOpen(true);
  };

  const saveCitizen = async (data) => {
    try {
      if (editing) {
        await citizenService.updateCitizen(
          selectedCitizen.id,
          data
        );
        showSnackbar("Citizen updated successfully");
      } else {
        await citizenService.registerCitizen(data);
        showSnackbar("Citizen registered successfully");
      }

      setFormOpen(false);
      loadCitizens();
    } catch (e) {
      showSnackbar("Operation failed", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await citizenService.deleteCitizen(selectedCitizen.id);

      showSnackbar("Citizen deleted successfully");

      setDeleteOpen(false);

      loadCitizens();
    } catch (e) {
      showSnackbar("Delete failed", "error");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5">
          Citizen Management
        </Typography>

        {role === "CITIZEN" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Citizen
          </Button>
        )}
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={3}
      >
        <TextField
          label="Search"
          fullWidth
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <TextField
          select
          label="Status"
          sx={{ minWidth: 180 }}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="ACTIVE">ACTIVE</MenuItem>
          <MenuItem value="INACTIVE">INACTIVE</MenuItem>
        </TextField>

        <TextField
          select
          label="Ward"
          sx={{ minWidth: 180 }}
          value={ward}
          onChange={(e) =>
            setWard(e.target.value)
          }
        >
          <MenuItem value="">All</MenuItem>

          {wards.map((w) => (
            <MenuItem key={w} value={w}>
              {w}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Box sx={{ height: 650 }}>
        <CitizenTable
          citizens={filteredCitizens}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          role={role}
        />
      </Box>

      <CitizenForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={saveCitizen}
        citizen={selectedCitizen}
        title={
          editing
            ? "Edit Citizen"
            : "Register Citizen"
        }
      />

      <CitizenDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        citizen={selectedCitizen}
      />

      <DeleteCitizenDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        citizen={selectedCitizen}
      />

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
    </Paper>
  );
};

export default CitizenList;