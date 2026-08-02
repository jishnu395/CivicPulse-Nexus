import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    createApplication,
    getPendingApplications,
    approveApplication,
    rejectApplication
} from "../services/welfareApplicationService";

export default function WelfareApplicationList() {

    const empty = {
        citizenId: "",
        schemeId: ""
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);

    const load = async () => {

        try {

            const res = await getPendingApplications();

            setRows(res.data);

        } catch {

            toast.error("Failed to load applications");

        }

    };

    useEffect(() => {

        load();

    }, []);

    const save = async () => {

        try {

            await createApplication(form);

            toast.success("Application Submitted");

            setOpen(false);

            setForm(empty);

            load();

        } catch {

            toast.error("Operation Failed");

        }

    };

    const approve = async (id) => {

        try {

            await approveApplication(id);

            toast.success("Application Approved");

            load();

        } catch {

            toast.error("Approval Failed");

        }

    };

    const reject = async (id, remarks) => {

        try {

            await rejectApplication(id, remarks);

            toast.success("Application Rejected");

            load();

        } catch {

            toast.error("Reject Failed");

        }

    };

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 70
        },

        {
            field: "citizenId",
            headerName: "Citizen ID",
            flex: 1
        },

        {
            field: "schemeId",
            headerName: "Scheme ID",
            flex: 1
        },

        {
            field: "schemeName",
            headerName: "Scheme Name",
            flex: 1
        },

        {
            field: "applicationDate",
            headerName: "Application Date",
            width: 170
        },

        {
            field: "remarks",
            headerName: "Remarks",
            flex: 1
        },

        {
            field: "status",
            headerName: "Status",
            width: 140,
            renderCell: (params) => {

                let color = "warning";

                if (params.value === "APPROVED")
                    color = "success";

                if (params.value === "REJECTED")
                    color = "error";

                return (
                    <Chip
                        label={params.value}
                        color={color}
                    />
                );

            }
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 240,
            sortable: false,

            renderCell: (params) => (

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={params.row.status !== "PENDING"}
                        onClick={() => approve(params.row.id)}
                    >
                        Approve
                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        disabled={params.row.status !== "PENDING"}
                        onClick={() => {

                            const remarks = prompt("Enter rejection remarks");

                            if (remarks !== null && remarks.trim() !== "") {

                                reject(params.row.id, remarks);

                            }

                        }}
                    >
                        Reject
                    </Button>

                </Stack>

            )

        }

    ];

        return (

        <DashboardLayout>

            <Paper sx={{ p: 3 }}>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={2}
                >

                    <Typography variant="h5">
                        Welfare Applications
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setForm(empty);

                            setOpen(true);

                        }}
                    >
                        New Application
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

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>

                    Apply for Welfare Scheme

                </DialogTitle>

                <DialogContent>

                    <Stack
                        spacing={2}
                        mt={1}
                    >

                        <TextField
                            label="Citizen ID"
                            value={form.citizenId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    citizenId: e.target.value
                                })
                            }
                            fullWidth
                        />

                        <TextField
                            label="Scheme ID"
                            value={form.schemeId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    schemeId: e.target.value
                                })
                            }
                            fullWidth
                        />

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => {

                            setOpen(false);

                            setForm(empty);

                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={save}
                    >
                        Submit
                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}