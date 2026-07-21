import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography
} from "@mui/material";

import { certificateAPI } from "../services/api";

export default function TrackApplication() {

    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);

    useEffect(() => {
        loadApplication();
    }, []);

    const loadApplication = async () => {
        try {
            const response = await certificateAPI.getById(applicationId);
            setApplication(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!application) return <Typography sx={{ mt: 5 }}>Loading...</Typography>;

    return (

        <Container maxWidth="md" sx={{ mt: 5 }}>

            <Button
                variant="contained"
                sx={{ mb: 3 }}
                onClick={() => navigate(-1)}
            >
                Back
            </Button>

            <Card>

                <CardContent>

                    <Typography variant="h4" gutterBottom>
                        Track Application
                    </Typography>

                    <Grid container spacing={2}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography><b>Application No:</b> {application.applicationNo}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography><b>Certificate:</b> {application.certificateType}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography><b>Status:</b> {application.status}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography><b>Department:</b> {application.department}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography><b>Submitted:</b> {application.submissionDate}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography><b>Remarks:</b> {application.remarks || "No remarks"}</Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Container>

    );

}