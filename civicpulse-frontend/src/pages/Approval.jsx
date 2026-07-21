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

export default function Approval() {

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

  const handleApprove = async () => {
    try {
      await certificateAPI.approve(id, {
        remarks: "Application approved",
      });

      alert("Application Approved");

      loadApplication();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      await certificateAPI.reject(id, {
        remarks: "Application rejected",
      });

      alert("Application Rejected");

      navigate("/pending-applications");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    try {
      await certificateAPI.generate(id);

      alert("Certificate Generated");

      navigate("/pending-applications");
    } catch (err) {
      console.error(err);
    }
  };

  if (!application) return null;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Approval
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
            <b>Certificate:</b> {application.certificateType}
          </Typography>

          <Typography>
            <b>Department:</b> {application.department}
          </Typography>

          <Typography>
            <b>Status:</b> {application.status}
          </Typography>

          <Stack direction="row" spacing={2} mt={4}>

            <Button
              variant="contained"
              color="success"
              onClick={handleApprove}
            >
              Approve
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleReject}
            >
              Reject
            </Button>

            <Button
              variant="contained"
              onClick={handleGenerate}
            >
              Generate Certificate
            </Button>

          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
}