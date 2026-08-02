import { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Stack,
    TextField,
    Typography,
    Button
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    getAuditLogs,
    getAuditByEntity
} from "../services/auditService";

export default function AuditList() {

    const [rows, setRows] = useState([]);
    const [entity, setEntity] = useState("");

    const loadAuditLogs = async () => {

        try {

            const res = await getAuditLogs();

            setRows(res.data);

        } catch {

            toast.error("Failed to load audit logs");

        }

    };

    useEffect(() => {

        loadAuditLogs();

    }, []);

    const searchByEntity = async () => {

        try {

            if (!entity.trim()) {

                loadAuditLogs();

                return;

            }

            const res = await getAuditByEntity(entity);

            setRows(res.data);

        } catch {

            toast.error("Search Failed");

        }

    };

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 80
        },

        {
            field: "entityType",
            headerName: "Entity Type",
            flex: 1
        },

        {
            field: "entityId",
            headerName: "Entity ID",
            flex: 1
        },

        {
            field: "action",
            headerName: "Action",
            flex: 1
        },

        {
            field: "performedBy",
            headerName: "Performed By",
            flex: 1
        },

        {
            field: "timestamp",
            headerName: "Timestamp",
            flex: 1.5
        }

    ];

    return (

        <DashboardLayout>

            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h5"
                    mb={3}
                >

                    Audit Logs

                </Typography>

                <Stack
                    direction="row"
                    spacing={2}
                    mb={3}
                >

                    <TextField
                        label="Entity Type"
                        value={entity}
                        onChange={(e) =>
                            setEntity(e.target.value)
                        }
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        onClick={searchByEntity}
                    >

                        Search

                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => {

                            setEntity("");

                            loadAuditLogs();

                        }}
                    >

                        Reset

                    </Button>

                </Stack>

                <Box sx={{ height: 620 }}>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[10]}
                    />

                </Box>

            </Paper>

        </DashboardLayout>

    );

}