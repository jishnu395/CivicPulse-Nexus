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

import { certificateAPI, citizenAPI } from "../services/api";
import { getUser } from "../utils/auth";

export default function MyApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {

        try {

            const user = getUser();

            const citizen = await citizenAPI.getByEmail(user.email);

            const response = await certificateAPI.getMy(citizen.data.id);

            setApplications(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const handleDownload = async (applicationId) => {

        try {

            const response = await certificateAPI.download(applicationId);

            const pdfUrl = response.data.pdfUrl;

            if (!pdfUrl) {
                alert("Certificate not generated.");
                return;
            }

            window.open(
                `http://localhost:8084/${pdfUrl}`,
                "_blank"
            );

        } catch (error) {

            console.error(error);
            alert("Unable to download certificate.");

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
                My Applications
            </Typography>

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Application No</TableCell>
                            <TableCell>Certificate</TableCell>
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
                                <TableCell>{app.certificateType}</TableCell>
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