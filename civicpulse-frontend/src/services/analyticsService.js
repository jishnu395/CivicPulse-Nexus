import api from "../api/axios";

const BASE = "/api/analytics";

export const getDashboardAnalytics = () =>
    api.get(`${BASE}/dashboard`);