import Dashboard from "../pages/Dashboard";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

    const navigate = useNavigate();

    return (
        <Container>

            <Button
                variant="contained"
                sx={{ mt: 3, mr: 2 }}
                onClick={() => navigate("/grievances")}
            >
                Manage Grievances
            </Button>

            <Dashboard />

        </Container>
    );
}