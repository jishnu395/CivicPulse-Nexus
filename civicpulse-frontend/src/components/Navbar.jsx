import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Navbar() {

    return (

        <AppBar
            position="fixed"
            color="inherit"
            elevation={1}
            sx={{
                zIndex: 1300,
                ml: "240px",
                width: "calc(100% - 240px)"
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: "#1E3A5F"
                    }}
                >
                    CivicPulse Nexus
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton>
                    <NotificationsIcon />
                </IconButton>

                <Avatar sx={{ ml: 2 }}>
                    <AccountCircleIcon />
                </Avatar>

            </Toolbar>

        </AppBar>

    );

}