import { Box, Toolbar } from "@mui/material";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {

    return (

        <Box sx={{ display: "flex" }}>

            <Navbar />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "#F5F7FA",
                    minHeight: "100vh",
                    p: 3
                }}
            >

                <Toolbar />

                {children}

            </Box>

        </Box>

    );

}