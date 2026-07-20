import { jwtDecode } from "jwt-decode";

export const saveAuth = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
};

export const getToken = () => {
    return localStorage.getItem("accessToken");
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const getUser = () => {

    const token = getToken();

    if (!token) return null;

    return jwtDecode(token);

};

export const getRole = () => {

    const user = getUser();

    if (!user) return null;

    const roles = user.realm_access?.roles || [];

    if (roles.includes("ADMIN")) return "ADMIN";
    if (roles.includes("COMMISSIONER")) return "COMMISSIONER";
    if (roles.includes("OFFICER")) return "OFFICER";
    if (roles.includes("CITIZEN")) return "CITIZEN";

    return null;
};