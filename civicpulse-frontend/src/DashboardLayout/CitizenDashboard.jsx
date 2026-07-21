import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CitizenDashboard() {

    const navigate = useNavigate();

    return (
        <Container sx={{ mt: 5 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Citizen Dashboard
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>

                <Button
                    variant="contained"
                    onClick={() => navigate("/grievances/register")}
                >
                    Register Grievance
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => navigate("/my-grievances")}
                >
                    My Grievances
                </Button>

            </Stack>

        </Container>
    );
}