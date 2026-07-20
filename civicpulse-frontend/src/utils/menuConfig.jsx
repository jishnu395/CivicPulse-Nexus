import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const menuConfig = {

    ADMIN: [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/admin/dashboard"
        },
        {
            text: "Citizens",
            icon: <PeopleIcon />,
            path: "/citizens"
        },
        {
            text: "Grievances",
            icon: <ReportIcon />,
            path: "/grievances"
        },
        {
            text: "Reports",
            icon: <AssessmentIcon />,
            path: "/reports"
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            path: "logout"
        }
    ],

    OFFICER: [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/officer/dashboard"
        },
        {
            text: "Assigned Grievances",
            icon: <ReportIcon />,
            path: "/grievances"
        },
        {
            text: "Citizens",
            icon: <PeopleIcon />,
            path: "/citizens"
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            path: "logout"
        }
    ],

    COMMISSIONER: [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/commissioner/dashboard"
        },
        {
            text: "Departments",
            icon: <ApartmentIcon />,
            path: "/departments"
        },
        {
            text: "Reports",
            icon: <AssessmentIcon />,
            path: "/reports"
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            path: "logout"
        }
    ],

    CITIZEN: [
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/citizen/dashboard"
        },
        {
            text: "My Grievances",
            icon: <ReportIcon />,
            path: "/grievances"
        },
        {
            text: "Profile",
            icon: <PersonIcon />,
            path: "/profile"
        },
        {
            text: "Logout",
            icon: <LogoutIcon />,
            path: "logout"
        }
    ]

};

export default menuConfig;