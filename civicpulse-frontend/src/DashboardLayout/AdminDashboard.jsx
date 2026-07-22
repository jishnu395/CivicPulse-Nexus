import Dashboard from "../pages/Dashboard";
import { Button, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Container>

            <Box
                display="flex"
                justifyContent="flex-end"
                sx={{ mt: 3 }}
            >
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

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