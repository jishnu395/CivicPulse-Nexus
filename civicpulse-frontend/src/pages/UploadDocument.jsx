import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Button,
    Container,
    Paper,
    Typography
} from "@mui/material";

import api from "../api/axios";
import { toast } from "react-toastify";

export default function UploadDocument() {

    const { applicationId } = useParams();

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const upload = async () => {

        if (!file) {
            toast.error("Select a document");
            return;
        }

        try {

            const formData = new FormData();

            formData.append("file", file);

            await api.post(
                `/api/documents/upload/${applicationId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success("Document Uploaded");

            navigate("/my-applications");

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Upload failed."
            );

        }

    };

    return (

        <Container maxWidth="sm" sx={{ mt: 5 }}>

            <Paper sx={{ p: 4 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Upload Document
                </Typography>

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={upload}
                >
                    Upload
                </Button>

            </Paper>

        </Container>

    );

}