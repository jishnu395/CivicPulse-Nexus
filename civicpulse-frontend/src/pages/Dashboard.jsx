import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

import {
    Alert,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Snackbar,
    Typography
} from "@mui/material";

export default function Dashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({
        total: 0,
        submitted: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        escalated: 0,
        overdue: 0
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "error",
        message: ""
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const response = await grievanceAPI.dashboard();

            setDashboard(response.data);

        } catch (error) {

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error?.response?.data?.message ||
                    "Failed to load dashboard"
            });

        } finally {

            setLoading(false);

        }
    };

    const cards = [
        {
            title: "Total Grievances",
            value: dashboard.total
        },
        {
            title: "Submitted",
            value: dashboard.submitted
        },
        {
            title: "Assigned",
            value: dashboard.assigned
        },
        {
            title: "In Progress",
            value: dashboard.inProgress
        },
        {
            title: "Resolved",
            value: dashboard.resolved
        },
        {
            title: "Closed",
            value: dashboard.closed
        },
        {
            title: "Escalated",
            value: dashboard.escalated
        },
        {
            title: "Overdue",
            value: dashboard.overdue
        }
    ];

    if (loading) {

        return (

            <Container sx={{ mt: 6, textAlign: "center" }}>
                <CircularProgress />
            </Container>

        );

    }

    return (

        <Container maxWidth="lg" sx={{ mt: 5 }}>

            <Button
                variant="contained"
                sx={{ mb: 3 }}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Grievance Dashboard
            </Typography>

            <Grid container spacing={3}>

                {cards.map((card) => (

                    <Grid
                        key={card.title}
                        size={{ xs: 12, sm: 6, md: 3 }}
                    >

                        <Card
                            elevation={4}
                            sx={{
                                textAlign: "center",
                                height: "100%"
                            }}
                        >

                            <CardContent>

                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                >
                                    {card.title}
                                </Typography>

                                <Typography
                                    variant="h3"
                                    fontWeight="bold"
                                    sx={{ mt: 2 }}
                                >
                                    {card.value}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

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