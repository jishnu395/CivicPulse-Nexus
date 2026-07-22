import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { grievanceAPI } from "../services/api";

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

export default function GrievanceHistory() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await grievanceAPI.history(id);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
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

      <Typography variant="h4" gutterBottom>
        Grievance History
      </Typography>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {history.map((item) => (

              <TableRow key={item.id}>

                <TableCell>{item.status}</TableCell>

                <TableCell>{item.remarks}</TableCell>

                <TableCell>
                  {new Date(item.updatedAt).toLocaleString()}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>
      </TableContainer>

    </Container>
  );
}