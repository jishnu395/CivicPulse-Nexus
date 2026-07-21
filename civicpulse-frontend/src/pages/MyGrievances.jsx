import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from "@mui/material";

export default function MyGrievances() {

    const [grievances, setGrievances] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadMyGrievances();
    }, []);

    const loadMyGrievances = async () => {
        try {
            const response = await grievanceAPI.getMy();
            setGrievances(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Button
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                My Grievances
            </Typography>

            <TableContainer component={Paper}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Citizen ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>SLA</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {grievances.map((grievance) => (
                            <TableRow key={grievance.id}>
                                <TableCell>{grievance.id}</TableCell>
                                <TableCell>{grievance.citizenId}</TableCell>
                                <TableCell>{grievance.title}</TableCell>
                                <TableCell>{grievance.category}</TableCell>
                                <TableCell>{grievance.priority}</TableCell>
                                <TableCell>{grievance.status}</TableCell>
                                <TableCell>{grievance.slaStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Container>
    );
}