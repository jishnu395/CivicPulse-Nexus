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
    createBudget,
    deleteBudget,
    getBudgets,
    updateBudget
} from "../services/budgetService";

export default function BudgetList() {

    const emptyForm = {
        department: "",
        financialYear: "",
        allocatedAmount: ""
    };

    const [budgets, setBudgets] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const loadBudgets = async () => {

        try {

            const res = await getBudgets();

            setBudgets(res.data);

        } catch {

            toast.error("Failed to load budgets");

        }

    };

    useEffect(() => {

        loadBudgets();

    }, []);

    const saveBudget = async () => {

        try {

            if (editing) {

                await updateBudget(editing.id, form);

                toast.success("Budget Updated");

            } else {

                await createBudget(form);

                toast.success("Budget Created");

            }

            setOpen(false);
            setEditing(null);
            setForm(emptyForm);

            loadBudgets();

        } catch {

            toast.error("Operation Failed");

        }

    };

    const editBudget = (row) => {

        setEditing(row);

        setForm({
            department: row.department,
            financialYear: row.financialYear,
            allocatedAmount: row.allocatedAmount
        });

        setOpen(true);

    };

    const removeBudget = async (id) => {

        try {

            await deleteBudget(id);

            toast.success("Budget Deleted");

            loadBudgets();

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
            field: "department",
            headerName: "Department",
            flex: 1
        },

        {
            field: "financialYear",
            headerName: "Financial Year",
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
            field: "actions",
            headerName: "Actions",
            width: 180,

            renderCell: (params) => (

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => editBudget(params.row)}
                    >
                        Edit
                    </Button>

                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => removeBudget(params.row.id)}
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
                    alignItems="center"
                    mb={2}
                >

                    <Typography variant="h5">

                        Budget Management

                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setEditing(null);
                            setForm(emptyForm);
                            setOpen(true);

                        }}
                    >

                        Add Budget

                    </Button>

                </Stack>

                <Box sx={{ height: 600 }}>

                    <DataGrid
                        rows={budgets}
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

                    {editing ? "Edit Budget" : "New Budget"}

                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} mt={1}>

                        <TextField
                            label="Department"
                            value={form.department}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    department: e.target.value
                                })
                            }
                            fullWidth
                        />

                        <TextField
                            label="Financial Year"
                            value={form.financialYear}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    financialYear: e.target.value
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
                            setEditing(null);
                            setForm(emptyForm);

                        }}
                    >

                        Cancel

                    </Button>

                    <Button
                        variant="contained"
                        onClick={saveBudget}
                    >

                        Save

                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}