import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    return (

        <Container sx={{ mt: 5 }}>

            <Typography variant="h4" gutterBottom>
                CivicPulse Nexus
            </Typography>

            <Grid container spacing={3}>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/citizens/register")}
                        >
                            Register Citizen
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/citizens")}
                        >
                            View Citizens
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/grievances/register")}
                        >
                            Register Grievance
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/grievances")}
                        >
                            View Grievances
                        </Button>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate("/dashboard")}
                        >
                            Dashboard
                        </Button>
                    </Paper>
                </Grid>

            </Grid>

        </Container>

    );
}