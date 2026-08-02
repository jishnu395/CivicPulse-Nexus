import api from "../api/axios";

const BASE = "/api/budget";

export const getBudgets = () =>
    api.get(BASE);

export const getBudget = (id) =>
    api.get(`${BASE}/${id}`);

export const createBudget = (data) =>
    api.post(BASE, data);

export const updateBudget = (id, data) =>
    api.put(`${BASE}/${id}`, data);

export const deleteBudget = (id) =>
    api.delete(`${BASE}/${id}`);

export const getDashboard = () =>
    api.get(`${BASE}/dashboard`);

export const getRemaining = (id) =>
    api.get(`${BASE}/${id}/remaining`);

export const getUtilization = (id) =>
    api.get(`${BASE}/${id}/utilization`);