import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { certificateAPI } from "../services/api";

export default function Verification() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadApplication();
    loadDocuments();
  }, []);

  const loadApplication = async () => {
    try {
      const res = await certificateAPI.getById(id);
      setApplication(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await certificateAPI.getDocuments(id);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const handleVerify = async () => {
    try {

        for (const doc of documents) {

            await certificateAPI.verifyDocument(doc.id, {
                verified: true,
                remarks: "Verified"
            });

        }

        alert("Documents verified successfully");

        loadApplication();
        loadDocuments();

        navigate(-1);

    } catch (err) {
        console.error(err);
    }
};

const handleCorrection = async () => {

    try {

        for (const doc of documents) {

            await certificateAPI.verifyDocument(doc.id, {
                verified: false,
                remarks: "Need Correction"
            });

        }

        alert("Marked for correction");

        navigate(-1);

    } catch (err) {
        console.error(err);
    }

};

  if (!application) return null;

  return (
    <Box p={3}>

      <Typography variant="h4" mb={3}>
        Verification
      </Typography>

      <Card>
        <CardContent>

          <Typography>
            <b>Application No:</b> {application.applicationNo}
          </Typography>

          <Typography>
            <b>Citizen ID:</b> {application.citizenId}
          </Typography>

<Typography>
  <b>
    {application.certificateType ? "Certificate" : "Permit"}:
  </b>{" "}
  {application.certificateType || application.permitType}
</Typography>

          <Typography>
            <b>Department:</b> {application.department}
          </Typography>

          <Typography>
            <b>Status:</b> {application.status}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Uploaded Documents
          </Typography>

          <List>

            {documents.length === 0 ? (
              <Typography color="text.secondary">
                No documents uploaded.
              </Typography>
            ) : (
              documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  secondaryAction={
                    <Button
                      variant="outlined"
                      onClick={() =>
                        window.open(
                          `http://localhost:8084${doc.documentUrl}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </Button>
                  }
                >
                  <ListItemText
                    primary={doc.documentName}
                    secondary={`Status: ${doc.verificationStatus}`}
                  />
                </ListItem>
              ))
            )}

          </List>

          <Stack
            direction="row"
            spacing={2}
            mt={4}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleVerify}
            >
              Verify
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleCorrection}
            >
              Need Correction
            </Button>
          </Stack>

        </CardContent>
      </Card>

    </Box>
  );
}