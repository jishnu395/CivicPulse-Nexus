import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ApprovalDashboard() {

    const navigate = useNavigate();

    return (
        <Box p={4}>

            <Typography variant="h4" gutterBottom>
                Department Officer Dashboard
            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: "center" }}>

                        <Typography variant="h6">
                            Approval Workflow
                        </Typography>

                        <Button
                            sx={{ mt: 2 }}
                            variant="contained"
                            onClick={() => navigate("/pending-applications")}
                        >
                            View Applications
                        </Button>

                    </Paper>
                </Grid>

            </Grid>

        </Box>
    );
}