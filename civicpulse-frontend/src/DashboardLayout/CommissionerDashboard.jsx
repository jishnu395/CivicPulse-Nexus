import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function CommissionerDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Box p={4}>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >
                <Typography variant="h4">
                    Commissioner Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="h6">
                            Grievance Management
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/grievances")}
                        >
                            View
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="h6">
                            Certificate Approval
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/approval/dashboard")}
                        >
                            View
                        </Button>
                    </Paper>
                </Grid>

            </Grid>

        </Box>
    );
}