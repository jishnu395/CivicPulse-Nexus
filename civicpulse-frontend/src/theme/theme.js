import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#1E3A5F",
        },

        secondary: {
            main: "#2563EB",
        },

        background: {
            default: "#F5F7FA",
            paper: "#FFFFFF",
        },

        success: {
            main: "#2E7D32",
        },

        warning: {
            main: "#ED6C02",
        },

        error: {
            main: "#D32F2F",
        },
    },

    typography: {
        fontFamily: "Roboto, sans-serif",

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 700,
        },

        h6: {
            fontWeight: 600,
        },

        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },

    shape: {
        borderRadius: 10,
    },

    components: {

        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: "10px 18px",
                },
            },
        },
    },
});

export default theme;