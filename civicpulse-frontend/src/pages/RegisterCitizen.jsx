import {
    Button,
    Container,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { citizenAPI } from "../services/api";

export default function RegisterCitizen() {

    const navigate = useNavigate();

    const [citizen, setCitizen] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        wardNumber: "",
        city: "",
        state: "",
        postalCode: ""
    });

    const handleChange = (e) => {
        setCitizen({
            ...citizen,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await citizenAPI.post("", citizen);

            alert("Citizen Registered Successfully");

            setCitizen({
                userId: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                gender: "",
                dateOfBirth: "",
                address: "",
                wardNumber: "",
                city: "",
                state: "",
                postalCode: ""
            });

        } catch (error) {
            console.error(error);
            alert("Registration Failed");
        }
    };

    return (

        <Container maxWidth="md" sx={{ mt: 5 }}>

            <Paper sx={{ p: 4 }}>

                <Button
                    variant="contained"
                    onClick={() => navigate("/home")}
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>

                <Typography variant="h4" gutterBottom>
                    Register Citizen
                </Typography>

                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="User ID"
                        name="userId"
                        value={citizen.userId}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        name="firstName"
                        value={citizen.firstName}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        name="lastName"
                        value={citizen.lastName}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        name="phoneNumber"
                        value={citizen.phoneNumber}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Gender"
                        name="gender"
                        value={citizen.gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="MALE">MALE</MenuItem>
                        <MenuItem value="FEMALE">FEMALE</MenuItem>
                        <MenuItem value="OTHER">OTHER</MenuItem>
                    </TextField>

                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Date of Birth
                    </Typography>

                    <TextField
                        fullWidth
                        type="date"
                        name="dateOfBirth"
                        value={citizen.dateOfBirth}
                        onChange={handleChange}
                        // inputProps={{
                        //     max: new Date().toISOString().split("T")[0]
                        // }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        name="address"
                        value={citizen.address}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Ward Number"
                        name="wardNumber"
                        value={citizen.wardNumber}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="City"
                        name="city"
                        value={citizen.city}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="State"
                        name="state"
                        value={citizen.state}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Postal Code"
                        name="postalCode"
                        value={citizen.postalCode}
                        onChange={handleChange}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Register Citizen
                    </Button>

                </form>

            </Paper>

        </Container>
    );
}