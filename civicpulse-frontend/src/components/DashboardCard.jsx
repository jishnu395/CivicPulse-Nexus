import {
    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

import { logout, getRole } from "../utils/auth";
import menuConfig from "../utils/menuConfig";

const drawerWidth = 240;

export default function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const role = getRole();

    const menus = menuConfig[role] || [];

    const handleClick = (item) => {

        if (item.path === "logout") {

            logout();

            navigate("/");

            return;
        }

        navigate(item.path);
    };

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    CivicPulse
                </Typography>

            </Toolbar>

            <Divider />

            <List>

                {
                    menus.map((item) => (

                        <ListItemButton
                            key={item.text}
                            selected={location.pathname === item.path}
                            onClick={() => handleClick(item)}
                        >

                            <ListItemIcon>

                                {item.icon}

                            </ListItemIcon>

                            <ListItemText primary={item.text} />

                        </ListItemButton>

                    ))
                }

            </List>

        </Drawer>

    );

}