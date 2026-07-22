import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { login } from "../services/authService";
import { saveAuth, getRole, getUser } from "../utils/auth";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await login(email, password);

            saveAuth(response);

            console.log("User:", getUser());
            console.log("Role:", getRole());
            console.log("Token:", localStorage.getItem("accessToken"));

            toast.success("Login Successful");

            const role = getRole();

            switch (role) {

                case "ADMIN":
                    navigate("/admin/dashboard");
                    break;

                case "OFFICER":
                    navigate("/officer/dashboard");
                    break;

                case "COMMISSIONER":
                    navigate("/approval/dashboard");
                    break;

                case "CITIZEN":
                    navigate("/citizen/dashboard");
                    break;

                default:
                    toast.error("Role not assigned.");
            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <Container maxWidth="sm">

            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Paper
                    elevation={4}
                    sx={{
                        width: "100%",
                        p: 5
                    }}
                >

                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                    >
                        CivicPulse Nexus
                    </Typography>

                    <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Sign in to continue
                    </Typography>

                    <form onSubmit={handleLogin}>

                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3 }}
                            disabled={loading}
                        >
                            {loading
                                ? <CircularProgress size={24} color="inherit" />
                                : "Login"}
                        </Button>

                    </form>

                </Paper>

            </Box>

        </Container>
    );
}