import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        // Temporary navigation
        navigate("/home");
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>

            <Paper elevation={4} sx={{ p: 4 }}>

                <Typography variant="h4" align="center" gutterBottom>
                    CivicPulse Nexus
                </Typography>

                <Typography align="center" sx={{ mb: 3 }}>
                    Login
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
                        sx={{ mt: 3 }}
                    >
                        Login
                    </Button>

                </form>

            </Paper>

        </Container>
    );
}