import {
    Button,
    Container,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

export default function RegisterGrievance() {

    const navigate = useNavigate();

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

        try {

            await grievanceAPI.post("", grievance);

            alert("Grievance Registered Successfully");

            setGrievance({
                citizenId: "",
                title: "",
                description: "",
                category: "",
                location: "",
                priority: ""
            });

        } catch (error) {
            console.error(error);
            alert("Registration Failed");
        }
    };

    return (

        <Container maxWidth="md" sx={{ mt: 5 }}>

            <Paper sx={{ p: 4 }}>

                <Button
                    variant="contained"
                    onClick={() => navigate("/home")}
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
                        label="Citizen ID"
                        name="citizenId"
                        value={grievance.citizenId}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Title"
                        name="title"
                        value={grievance.title}
                        onChange={handleChange}
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
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Category"
                        name="category"
                        value={grievance.category}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        name="location"
                        value={grievance.location}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Priority"
                        name="priority"
                        value={grievance.priority}
                        onChange={handleChange}
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
                    >
                        Register Grievance
                    </Button>

                </form>

            </Paper>

        </Container>
    );
}