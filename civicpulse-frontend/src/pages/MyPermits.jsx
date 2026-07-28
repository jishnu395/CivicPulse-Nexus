import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import api from "../api/axios";
import { permitAPI, citizenAPI } from "../services/api";
import { getUser } from "../utils/auth";

export default function MyPermits() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {

        try {

            const user = getUser();

            const citizen = await citizenAPI.getByEmail(user.email);

            const response = await permitAPI.getMy(citizen.data.id);

            // Show only permit applications
            setApplications(
                response.data.filter(app => app.permitType !== null)
            );

        } catch (error) {

            console.error(error);

        }

    };

    const handleDownload = async (applicationId) => {

    try {

        const response = await api.get(
            `/api/permit/download/${applicationId}`,
            {
                responseType: "blob",
            }
        );

        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
        );

        const link = document.createElement("a");

        link.href = url;
        link.download = "Permit.pdf";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(error);

        alert("Download failed.");

    }

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

            <Typography
                variant="h4"
                gutterBottom
            >
                My Permits
            </Typography>

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Application No</TableCell>
                            <TableCell>Permit</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Submitted</TableCell>
                            <TableCell>Actions</TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {applications.map((app) => (

                            <TableRow key={app.id}>

                                <TableCell>{app.applicationNo}</TableCell>

                                <TableCell>{app.permitType}</TableCell>

                                <TableCell>{app.status}</TableCell>

                                <TableCell>{app.department}</TableCell>

                                <TableCell>{app.submissionDate}</TableCell>

                                <TableCell>

                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{ mr: 1 }}
                                        onClick={() =>
                                            navigate(`/upload-document/${app.id}`)
                                        }
                                    >
                                        Upload
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 1 }}
                                        onClick={() =>
                                            navigate(`/track-application/${app.id}`)
                                        }
                                    >
                                        Track
                                    </Button>

                                    {app.status === "CERTIFICATE_GENERATED" && (

                                        <Button
                                            size="small"
                                            color="success"
                                            variant="contained"
                                            onClick={() => handleDownload(app.id)}
                                        >
                                            Download
                                        </Button>

                                    )}

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </TableContainer>

        </Container>

    );

}