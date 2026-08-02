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
    createFundDistribution,
    getFundDistributions,
    completeDistribution,
    failDistribution
} from "../services/fundDistributionService";

export default function FundDistributionList() {

    const emptyForm = {
        citizenId: "",
        beneficiaryId: "",
        amount: "",
        purpose: ""
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const load = async () => {

        try {

            const res = await getFundDistributions();

            setRows(res.data);

        } catch {

            toast.error("Failed to load distributions");

        }

    };

    useEffect(() => {

        load();

    }, []);

    const save = async () => {

        try {

            await createFundDistribution(form);

            toast.success("Distribution Created");

            setOpen(false);

            setForm(emptyForm);

            load();

        } catch {

            toast.error("Operation Failed");

        }

    };

    const complete = async (id) => {

        try {

            await completeDistribution(id);

            toast.success("Distribution Completed");

            load();

        } catch {

            toast.error("Operation Failed");

        }

    };

    const fail = async (id) => {

        try {

            await failDistribution(id);

            toast.success("Distribution Marked Failed");

            load();

        } catch {

            toast.error("Operation Failed");

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
            field: "beneficiaryId",
            headerName: "Beneficiary ID",
            flex: 1
        },

        {
            field: "amount",
            headerName: "Amount",
            flex: 1
        },

        {
            field: "purpose",
            headerName: "Purpose",
            flex: 1.5
        },

        {
            field: "status",
            headerName: "Status",
            flex: 1
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 220,

            renderCell: (params) => (

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => complete(params.row.id)}
                        disabled={params.row.status === "COMPLETED"}
                    >
                        Complete
                    </Button>

                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => fail(params.row.id)}
                        disabled={params.row.status === "FAILED"}
                    >
                        Fail
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

                        Fund Distribution

                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setForm(emptyForm);

                            setOpen(true);

                        }}
                    >

                        New Distribution

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

                    New Distribution

                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} mt={1}>

                        <TextField
                            label="Citizen ID"
                            type="number"
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
                            label="Beneficiary ID"
                            type="number"
                            value={form.beneficiaryId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    beneficiaryId: e.target.value
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

                        <TextField
                            label="Purpose"
                            value={form.purpose}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    purpose: e.target.value
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
                        onClick={save}
                    >

                        Save

                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}