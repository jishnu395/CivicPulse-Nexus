import { useEffect, useState } from "react";
import {
    Box,
    Button,
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
    createAllocation,
    getAllocations
} from "../services/budgetAllocationService";

export default function BudgetAllocationList() {

    const emptyForm = {
        budgetId: "",
        schemeId: "",
        allocatedAmount: ""
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const loadAllocations = async () => {

        try {

            const res = await getAllocations();

            setRows(res.data);

        } catch {

            toast.error("Failed to load allocations");

        }

    };

    useEffect(() => {

        loadAllocations();

    }, []);

    const saveAllocation = async () => {

        try {

            await createAllocation(form);

            toast.success("Budget Allocated");

            setOpen(false);

            setForm(emptyForm);

            loadAllocations();

        } catch {

            toast.error("Allocation Failed");

        }

    };

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 80
        },

        {
            field: "budgetId",
            headerName: "Budget ID",
            flex: 1
        },

        {
            field: "schemeId",
            headerName: "Scheme ID",
            flex: 1
        },

        {
            field: "allocatedAmount",
            headerName: "Allocated Amount",
            flex: 1
        },

        {
            field: "utilizedAmount",
            headerName: "Utilized Amount",
            flex: 1
        },

        {
            field: "remainingAmount",
            headerName: "Remaining Amount",
            flex: 1
        },

        {
            field: "allocatedDate",
            headerName: "Allocated Date",
            flex: 1
        }

    ];

        return (

        <DashboardLayout>

            <Paper sx={{ p: 3 }}>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Typography variant="h5">

                        Budget Allocation

                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setForm(emptyForm);
                            setOpen(true);

                        }}
                    >

                        Allocate Budget

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
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>

                    New Budget Allocation

                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} mt={1}>

                        <TextField
                            label="Budget ID"
                            type="number"
                            value={form.budgetId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    budgetId: e.target.value
                                })
                            }
                            fullWidth
                        />

                        <TextField
                            label="Scheme ID"
                            type="number"
                            value={form.schemeId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    schemeId: e.target.value
                                })
                            }
                            fullWidth
                        />

                        <TextField
                            label="Allocated Amount"
                            type="number"
                            value={form.allocatedAmount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    allocatedAmount: e.target.value
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
                            setForm(emptyForm);

                        }}
                    >

                        Cancel

                    </Button>

                    <Button
                        variant="contained"
                        onClick={saveAllocation}
                    >

                        Save

                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}