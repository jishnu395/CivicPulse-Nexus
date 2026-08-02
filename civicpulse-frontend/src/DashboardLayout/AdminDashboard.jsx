import Dashboard from "../pages/Dashboard";
import { Button, Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function AdminDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (

        <Container maxWidth="md">

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                    mb: 4
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Admin Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 2,
                    mb: 4
                }}
            >

                {/* Existing Module */}

                <Button
                    variant="contained"
                    onClick={() => navigate("/grievances")}
                >
                    Manage Grievances
                </Button>

                {/* Welfare */}

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/welfare-schemes")}
                >
                    Welfare Schemes
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/welfare-applications")}
                >
                    Welfare Applications
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/beneficiaries")}
                >
                    Beneficiaries
                </Button>

                {/* Budget */}

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/budgets")}
                >
                    Budgets
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/budget-allocation")}
                >
                    Budget Allocation
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/expenses")}
                >
                    Expenses
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/fund-distributions")}
                >
                    Fund Distribution
                </Button>

                {/* Monitoring */}

                <Button
                    variant="contained"
                    color="info"
                    onClick={() => navigate("/analytics")}
                >
                    Analytics Dashboard
                </Button>

                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => navigate("/audit")}
                >
                    Audit Logs
                </Button>

            </Box>

            <Dashboard />

        </Container>

    );

}