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
    createExpense,
    deleteExpense,
    getExpenses
} from "../services/expenseService";

export default function ExpenseList() {

    const emptyForm = {
        budgetId: "",
        department: "",
        category: "",
        description: "",
        amount: ""
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const loadExpenses = async () => {

        try {

            const res = await getExpenses();

            setRows(res.data);

        } catch {

            toast.error("Failed to load expenses");

        }

    };

    useEffect(() => {

        loadExpenses();

    }, []);

    const saveExpense = async () => {

        try {

            await createExpense(form);

            toast.success("Expense Added");

            setOpen(false);

            setForm(emptyForm);

            loadExpenses();

        } catch {

            toast.error("Operation Failed");

        }

    };

    const removeExpense = async (id) => {

        try {

            await deleteExpense(id);

            toast.success("Expense Deleted");

            loadExpenses();

        } catch {

            toast.error("Delete Failed");

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
            field: "department",
            headerName: "Department",
            flex: 1
        },

        {
            field: "category",
            headerName: "Category",
            flex: 1
        },

        {
            field: "description",
            headerName: "Description",
            flex: 2
        },

        {
            field: "amount",
            headerName: "Amount",
            flex: 1
        },

        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1.5
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 120,

            renderCell: (params) => (

                <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => removeExpense(params.row.id)}
                >
                    Delete
                </Button>

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

                        Expense Management

                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setForm(emptyForm);
                            setOpen(true);

                        }}
                    >

                        Add Expense

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

                    New Expense

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
                            select
                            label="Category"
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value
                                })
                            }
                            fullWidth
                        >

                            <MenuItem value="SALARY">SALARY</MenuItem>
                            <MenuItem value="INFRASTRUCTURE">INFRASTRUCTURE</MenuItem>
                            <MenuItem value="WELFARE">WELFARE</MenuItem>
                            <MenuItem value="OPERATIONS">OPERATIONS</MenuItem>
                            <MenuItem value="MAINTENANCE">MAINTENANCE</MenuItem>
                            <MenuItem value="OTHER">OTHER</MenuItem>

                        </TextField>

                        <TextField
                            label="Description"
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }
                            fullWidth
                        />

                        <TextField
                            label="Amount"
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    amount: e.target.value
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
                        onClick={saveExpense}
                    >

                        Save

                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}