import {
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();

    const modules = [
        {
            title: "Register Citizen",
            description: "Create a new citizen profile.",
            path: "/citizens/register"
        },
        {
            title: "View Citizens",
            description: "Manage all registered citizens.",
            path: "/citizens"
        },
        {
            title: "Register Grievance",
            description: "Submit a new grievance.",
            path: "/grievances/register"
        },
        {
            title: "View Grievances",
            description: "View and manage grievances.",
            path: "/grievances"
        },
        {
            title: "Dashboard",
            description: "View grievance analytics.",
            path: "/dashboard"
        }
    ];

    return (

        <Container maxWidth="lg" sx={{ mt: 5 }}>

            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
            >
                CivicPulse Nexus
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                Smart Civic Grievance Management System
            </Typography>

            <Grid container spacing={3}>

                {modules.map((module) => (

                    <Grid
                        key={module.title}
                        size={{ xs: 12, sm: 6, md: 4 }}
                    >

                        <Card
                            elevation={4}
                            sx={{
                                height: "100%"
                            }}
                        >

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    gutterBottom
                                >
                                    {module.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 3 }}
                                >
                                    {module.description}
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() =>
                                        navigate(module.path)
                                    }
                                >
                                    Open
                                </Button>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </Container>

    );
}