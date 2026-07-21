import {
    Alert,
    Button,
    Container,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

export default function RegisterGrievance() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const [grievance, setGrievance] = useState({
        citizenId: "",
        title: "",
        description: "",
        category: "",
        location: "",
        priority: ""
    });

    const handleChange = (e) => {
        setGrievance({
            ...grievance,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !grievance.citizenId ||
            !grievance.title ||
            !grievance.description ||
            !grievance.category ||
            !grievance.location ||
            !grievance.priority
        ) {

            setSnackbar({
                open: true,
                severity: "warning",
                message: "Please fill all fields."
            });

            return;
        }

        try {

            setLoading(true);

            await grievanceAPI.create(grievance);

            setSnackbar({
                open: true,
                severity: "success",
                message: "Grievance Registered Successfully"
            });

            setGrievance({
                citizenId: "",
                title: "",
                description: "",
                category: "",
                location: "",
                priority: ""
            });

        } catch (error) {

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error?.response?.data?.message ||
                    "Registration Failed"
            });

        } finally {
            setLoading(false);
        }
    };

    return (

        <Container maxWidth="md" sx={{ mt: 5 }}>

            <Paper sx={{ p: 4 }}>

                <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>

                <Typography variant="h4" gutterBottom>
                    Register Grievance
                </Typography>

                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        margin="normal"
                        type="number"
                        label="Citizen ID"
                        name="citizenId"
                        value={grievance.citizenId}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Title"
                        name="title"
                        value={grievance.title}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        label="Description"
                        name="description"
                        value={grievance.description}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Category"
                        name="category"
                        value={grievance.category}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        name="location"
                        value={grievance.location}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Priority"
                        name="priority"
                        value={grievance.priority}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="HIGH">HIGH</MenuItem>
                        <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                        <MenuItem value="LOW">LOW</MenuItem>
                    </TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading
                            ? "Registering..."
                            : "Register Grievance"}
                    </Button>

                </form>

            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false
                    }))
                }
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Container>
    );
}