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

export default function ApprovalDashboard() {

  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await certificateAPI.pending();
      setApplications(
        res.data.filter(app => app.status === "VERIFIED")
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>

      <Typography variant="h4" mb={3}>
        Approval Dashboard
      </Typography>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Application No</TableCell>
              <TableCell>Citizen</TableCell>
              <TableCell>Certificate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {applications.map(app => (

              <TableRow key={app.id}>

                <TableCell>{app.applicationNo}</TableCell>
                <TableCell>{app.citizenId}</TableCell>
                <TableCell>{app.certificateType}</TableCell>
                <TableCell>{app.status}</TableCell>

                <TableCell align="center">

                  <Button
                    variant="contained"
                    onClick={() => navigate(`/approval/${app.id}`)}
                  >
                    Approve
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