import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

export default function GrievanceList() {

    const navigate = useNavigate();

    const [grievances, setGrievances] = useState([]);

    const [assignOpen, setAssignOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const [departmentId, setDepartmentId] = useState("");
    const [officerId, setOfficerId] = useState("");

    const [status, setStatus] = useState("");

    useEffect(() => {
        loadGrievances();
    }, []);

    const loadGrievances = async () => {
        const response = await grievanceAPI.getAll();
        setGrievances(response.data);
    };

    const openAssign = (id) => {
        setSelectedId(id);
        setAssignOpen(true);
    };

    const openStatus = (id) => {
        setSelectedId(id);
        setStatusOpen(true);
    };

    const assign = async () => {

        await grievanceAPI.assign(selectedId, {
            departmentId: Number(departmentId),
            assignedOfficerId: Number(officerId)
        });

        setAssignOpen(false);
        loadGrievances();
    };

    const updateStatus = async () => {

        await grievanceAPI.updateStatus(selectedId, {
            status
        });

        setStatusOpen(false);
        loadGrievances();
    };

    return (
        <Container sx={{ mt: 5 }}>

            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Typography variant="h4" gutterBottom>
                Grievances
            </Typography>

            <TableContainer component={Paper}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Citizen</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>SLA</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {grievances.map((g) => (

                            <TableRow key={g.id}>

                                <TableCell>{g.id}</TableCell>
                                <TableCell>{g.citizenId}</TableCell>
                                <TableCell>{g.title}</TableCell>
                                <TableCell>{g.category}</TableCell>
                                <TableCell>{g.priority}</TableCell>
                                <TableCell>{g.status}</TableCell>
                                <TableCell>{g.slaStatus}</TableCell>

                                <TableCell>

                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ mr: 1 }}
                                        onClick={() => openAssign(g.id)}
                                    >
                                        Assign
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => openStatus(g.id)}
                                    >
                                        Status
                                    </Button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>
            </TableContainer>

            <Dialog
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
            >

                <DialogTitle>Assign Grievance</DialogTitle>

                <DialogContent>

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Department ID"
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Officer ID"
                        value={officerId}
                        onChange={(e) => setOfficerId(e.target.value)}
                    />

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setAssignOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={assign}
                    >
                        Assign
                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog
                open={statusOpen}
                onClose={() => setStatusOpen(false)}
            >

                <DialogTitle>Update Status</DialogTitle>

                <DialogContent>

                    <Select
                        fullWidth
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <MenuItem value="ASSIGNED">ASSIGNED</MenuItem>
                        <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                        <MenuItem value="PENDING">PENDING</MenuItem>
                        <MenuItem value="ESCALATED">ESCALATED</MenuItem>
                        <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                        <MenuItem value="CLOSED">CLOSED</MenuItem>
                    </Select>

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setStatusOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={updateStatus}
                    >
                        Update
                    </Button>

                </DialogActions>

            </Dialog>

        </Container>
    );
}