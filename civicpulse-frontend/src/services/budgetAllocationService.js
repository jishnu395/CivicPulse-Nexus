import api from "../api/axios";

const BASE = "/api/budget/allocation";

export const getAllocations = () =>
    api.get(BASE);

export const getAllocationsByBudget = (budgetId) =>
    api.get(`${BASE}/budget/${budgetId}`);

export const createAllocation = (data) =>
    api.post(BASE, data);