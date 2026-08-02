import { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Box
} from "@mui/material";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import { getDashboardAnalytics } from "../services/analyticsService";
import { toast } from "react-toastify";

export default function AnalyticsDashboard() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {

        try {

            const res = await getDashboardAnalytics();

            setAnalytics(res.data);

        } catch {

            toast.error("Failed to load analytics");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        load();

    }, []);

    if (loading) {

        return (

            <DashboardLayout>

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={5}
                >

                    <CircularProgress />

                </Box>

            </DashboardLayout>

        );

    }

    if (!analytics) {

        return (

            <DashboardLayout>

                <Typography
                    variant="h6"
                    align="center"
                    mt={5}
                >

                    No analytics available.

                </Typography>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <Typography
                variant="h4"
                mb={3}
            >

                Budget Analytics Dashboard

            </Typography>

            <Grid
                container
                spacing={3}
            >

                <Grid size={{ xs: 12, md: 3 }}>

                    <DashboardCard
                        title="Total Budget"
                        value={analytics.totalBudget}
                    />

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <DashboardCard
                        title="Total Expenses"
                        value={analytics.totalExpenses}
                    />

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <DashboardCard
                        title="Remaining Budget"
                        value={analytics.remainingBudget}
                    />

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <DashboardCard
                        title="Utilization %"
                        value={`${analytics.utilizationPercentage}%`}
                    />

                </Grid>

                <Grid size={{ xs: 12 }}>

                    <Paper sx={{ p: 3 }}>

                        <Typography
                            variant="h6"
                            gutterBottom
                        >

                            Department Summary

                        </Typography>

                        <pre
                            style={{
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word"
                            }}
                        >
                            {JSON.stringify(
                                analytics.departmentSummary,
                                null,
                                2
                            )}
                        </pre>

                    </Paper>

                </Grid>

            </Grid>

        </DashboardLayout>

    );

}