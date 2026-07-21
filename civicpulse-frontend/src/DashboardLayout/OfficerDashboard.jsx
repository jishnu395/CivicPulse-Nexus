import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OfficerDashboard() {

    const navigate = useNavigate();

    return (
        <Container sx={{ mt: 5 }}>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Officer Dashboard
            </Typography>

            <Stack spacing={2} sx={{ mt:3 }}>

                <Button
                    variant="contained"
                    onClick={() => navigate("/grievances")}
                >
                    View Assigned Grievances
                </Button>

            </Stack>

        </Container>
    );
}