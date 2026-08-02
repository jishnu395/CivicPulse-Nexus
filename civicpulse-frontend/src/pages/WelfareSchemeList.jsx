import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import DashboardLayout from "../layouts/DashboardLayout";
import {
    getSchemes,
    createScheme,
    updateScheme,
    deleteScheme
} from "../services/welfareSchemeService";

export default function WelfareSchemeList() {

    const empty = {
        schemeName: "",
        description: "",
        department: "",
        eligibilityCriteria: "",
        benefitAmount: "",
        status: "ACTIVE",
        startDate: "",
        endDate: ""
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);

    const load = async () => {
        try {
            const res = await getSchemes();
            setRows(res.data);
        } catch {
            toast.error("Failed to load schemes");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const save = async () => {

        try {

            if (editing) {
                await updateScheme(editing.id, form);
                toast.success("Scheme Updated");
            } else {
                await createScheme(form);
                toast.success("Scheme Created");
            }

            setOpen(false);
            setEditing(null);
            setForm(empty);

            load();

        } catch {

            toast.error("Operation Failed");

        }

    };

    const edit = (row) => {

        setEditing(row);

        setForm({
            schemeName: row.schemeName,
            description: row.description,
            department: row.department,
            eligibilityCriteria: row.eligibilityCriteria,
            benefitAmount: row.benefitAmount,
            status: row.status,
            startDate: row.startDate,
            endDate: row.endDate
        });

        setOpen(true);

    };

    const remove = async (id) => {

        try {

            await deleteScheme(id);

            toast.success("Deleted");

            load();

        } catch {

            toast.error("Delete Failed");

        }

    };

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 70
        },

        {
            field: "schemeName",
            headerName: "Scheme",
            flex: 1
        },

        {
            field: "department",
            headerName: "Department",
            flex: 1
        },

        {
            field: "benefitAmount",
            headerName: "Benefit Amount",
            flex: 1
        },

        {
            field: "status",
            headerName: "Status",
            width: 120
        },

        {
            field: "startDate",
            headerName: "Start Date",
            width: 130
        },

        {
            field: "endDate",
            headerName: "End Date",
            width: 130
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 180,
            sortable: false,
            renderCell: (params) => (

                <Stack direction="row" spacing={1}>

                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => edit(params.row)}
                    >
                        Edit
                    </Button>

                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => remove(params.row.id)}
                    >
                        Delete
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
                        Welfare Schemes
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setEditing(null);
                            setForm(empty);
                            setOpen(true);

                        }}
                    >

                        Add Scheme

                    </Button>

                </Stack>

                <Box sx={{ height: 600 }}>

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

                    {editing ? "Edit Scheme" : "New Scheme"}

                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} mt={1}>

                        <TextField
                            label="Scheme Name"
                            value={form.schemeName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    schemeName: e.target.value
                                })
                            }
                        />

                        <TextField
                            label="Department"
                            value={form.department}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    department: e.target.value
                                })
                            }
                        />

                        <TextField
                            select
                            label="Status"
                            value={form.status}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    status: e.target.value
                                })
                            }
                        >
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                        </TextField>

                        <TextField
                            type="date"
                            label="Start Date"
                            InputLabelProps={{ shrink: true }}
                            value={form.startDate}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    startDate: e.target.value
                                })
                            }
                        />

                        <TextField
                            type="date"
                            label="End Date"
                            InputLabelProps={{ shrink: true }}
                            value={form.endDate}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    endDate: e.target.value
                                })
                            }
                        />

                        <TextField
                            label="Benefit Amount"
                            type="number"
                            value={form.benefitAmount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    benefitAmount: e.target.value
                                })
                            }
                        />

                        <TextField
                            multiline
                            rows={3}
                            label="Eligibility Criteria"
                            value={form.eligibilityCriteria}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    eligibilityCriteria: e.target.value
                                })
                            }
                        />

                        <TextField
                            multiline
                            rows={4}
                            label="Description"
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }
                        />

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={save}
                    >
                        Save
                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}