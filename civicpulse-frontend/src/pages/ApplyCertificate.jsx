import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";

import { certificateAPI, citizenAPI } from "../services/api";
import { getUser } from "../utils/auth";

export default function ApplyCertificate() {

    const navigate = useNavigate();

    const [certificateType, setCertificateType] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const user = getUser();

            const email = user.email;

            const citizen = await citizenAPI.getByEmail(email);

            const citizenId = citizen.data.id;

            await certificateAPI.apply({
                citizenId,
                certificateType
            });

            toast.success("Application Submitted");

            navigate("/my-applications");

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Failed to submit application."
            );

        }

    };

    return (

        <Container maxWidth="sm" sx={{ mt: 5 }}>

            <Paper sx={{ p: 4 }}>

                <Typography variant="h4" gutterBottom>
                    Apply Certificate
                </Typography>

                <form onSubmit={handleSubmit}>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Certificate Type"
                        value={certificateType}
                        onChange={(e) => setCertificateType(e.target.value)}
                    >
                        <MenuItem value="BIRTH_CERTIFICATE">
                            Birth Certificate
                        </MenuItem>

                        <MenuItem value="DEATH_CERTIFICATE">
                            Death Certificate
                        </MenuItem>

                        <MenuItem value="INCOME_CERTIFICATE">
                            Income Certificate
                        </MenuItem>

                        <MenuItem value="RESIDENCE_CERTIFICATE">
                            Residence Certificate
                        </MenuItem>

                        <MenuItem value="MARRIAGE_CERTIFICATE">
                            Marriage Certificate
                        </MenuItem>

                    </TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Apply
                    </Button>

                </form>

            </Paper>

        </Container>

    );
}