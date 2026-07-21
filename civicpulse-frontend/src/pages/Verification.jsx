import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { certificateAPI } from "../services/api";

export default function Verification() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const res = await certificateAPI.getById(id);
      setApplication(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async () => {
    try {
      await certificateAPI.verify(id, {
        remarks: "Documents verified successfully",
      });

      alert("Application Verified");

      navigate(`/approval/${id}`);
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

          <Typography><b>Application No:</b> {application.applicationNo}</Typography>

          <Typography><b>Citizen ID:</b> {application.citizenId}</Typography>

          <Typography><b>Certificate:</b> {application.certificateType}</Typography>

          <Typography><b>Department:</b> {application.department}</Typography>

          <Typography><b>Status:</b> {application.status}</Typography>

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
            >
              Need Correction
            </Button>
          </Stack>

        </CardContent>
      </Card>

    </Box>
  );
}