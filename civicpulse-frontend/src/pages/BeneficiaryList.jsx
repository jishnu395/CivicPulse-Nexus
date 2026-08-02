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
    getBeneficiaries,
    registerBeneficiary
} from "../services/beneficiaryService";

export default function BeneficiaryList() {

    const empty = {
        applicationId: ""
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);

    const load = async () => {

        try {

            const res = await getBeneficiaries();

            setRows(res.data);

        } catch {

            toast.error("Failed to load beneficiaries");

        }

    };

    useEffect(() => {

        load();

    }, []);

    const save = async () => {

        try {

            await registerBeneficiary(form.applicationId);

            toast.success("Beneficiary Registered");

            setOpen(false);

            setForm(empty);

            load();

        } catch {

            toast.error("Registration Failed");

        }

    };

    const columns = [

        {
            field: "id",
            headerName: "ID",
            width: 80
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
            flex: 1.5
        },

        {
            field: "benefitAmount",
            headerName: "Benefit Amount",
            flex: 1
        },

        {
            field: "enrollmentDate",
            headerName: "Enrollment Date",
            width: 170
        },

        {
            field: "status",
            headerName: "Status",
            width: 140,

            renderCell: (params) => {

                let color = "warning";

                if (params.value === "ACTIVE")
                    color = "success";

                if (params.value === "INACTIVE")
                    color = "error";

                return (

                    <Chip
                        label={params.value}
                        color={color}
                    />

                );

            }

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

                        Beneficiaries

                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => {

                            setForm(empty);

                            setOpen(true);

                        }}
                    >

                        Register Beneficiary

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

                    Register Beneficiary

                </DialogTitle>

                <DialogContent>

                    <Stack
                        spacing={2}
                        mt={1}
                    >

                        <TextField
                            label="Application ID"
                            value={form.applicationId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    applicationId: e.target.value
                                })
                            }
                            fullWidth
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter the approved Welfare Application ID. The
                            backend will register the beneficiary based on the
                            application details.
                        </Typography>

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
                        Register
                    </Button>

                </DialogActions>

            </Dialog>

        </DashboardLayout>

    );

}