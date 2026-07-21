import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { certificateAPI } from "../services/api";

export default function PendingApplications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await certificateAPI.pending();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Pending Applications
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application No</TableCell>
              <TableCell>Citizen ID</TableCell>
              <TableCell>Certificate</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.applicationNo}</TableCell>
                <TableCell>{app.citizenId}</TableCell>
                <TableCell>{app.certificateType}</TableCell>
                <TableCell>{app.department}</TableCell>
                <TableCell>{app.status}</TableCell>

                <TableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/verification/${app.id}`)
                    }
                  >
                    Verify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
}