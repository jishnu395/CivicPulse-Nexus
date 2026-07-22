import { Container, Typography, Button, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function CitizenDashboard() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Container sx={{ mt: 5 }}>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Citizen Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            <Stack spacing={2}>

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

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate("/apply-certificate")}
                >
                    Apply Certificate
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => navigate("/my-applications")}
                >
                    My Applications
                </Button>

            </Stack>

        </Container>
    );
}