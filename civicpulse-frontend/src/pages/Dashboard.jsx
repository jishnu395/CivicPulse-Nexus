import { useEffect, useState } from "react";
import { grievanceAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button
} from "@mui/material";

export default function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await grievanceAPI.get("/dashboard");
            setDashboard(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const cards = [
        { title: "Total", value: dashboard.total },
        { title: "Submitted", value: dashboard.submitted },
        { title: "Assigned", value: dashboard.assigned },
        { title: "In Progress", value: dashboard.inProgress },
        { title: "Resolved", value: dashboard.resolved },
        { title: "Closed", value: dashboard.closed },
        { title: "Escalated", value: dashboard.escalated },
        { title: "Overdue", value: dashboard.overdue }
    ];

    return (
        <Container sx={{ mt: 5 }}>

            <Button
                variant="contained"
                onClick={() => navigate("/home")}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>

                {cards.map((card) => (

                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>

                        <Card>

                            <CardContent>

                                <Typography variant="h6">
                                    {card.title}
                                </Typography>

                                <Typography variant="h4">
                                    {card.value ?? 0}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </Container>
    );
}