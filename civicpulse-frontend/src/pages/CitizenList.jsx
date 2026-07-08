import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { citizenAPI } from "../services/api";

import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
} from "@mui/material";

export default function CitizenList() {

    const [citizens, setCitizens] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadCitizens();
    }, []);

    const loadCitizens = async () => {
        try {
            const response = await citizenAPI.get("");
            setCitizens(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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
                Citizens
            </Typography>

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Citizen ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Ward</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {citizens.map((citizen) => (

                            <TableRow key={citizen.id}>

                                <TableCell>{citizen.id}</TableCell>

                                <TableCell>{citizen.citizenId}</TableCell>

                                <TableCell>
                                    {citizen.firstName} {citizen.lastName}
                                </TableCell>

                                <TableCell>{citizen.phoneNumber}</TableCell>

                                <TableCell>{citizen.wardNumber}</TableCell>

                                <TableCell>{citizen.status}</TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Container>
    );
}