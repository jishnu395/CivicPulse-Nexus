import api from "../api/axios";

const BASE = "/api/expenses";

export const getExpenses = () =>
    api.get(BASE);

export const getExpense = (id) =>
    api.get(`${BASE}/${id}`);

export const createExpense = (data) =>
    api.post(BASE, data);

export const deleteExpense = (id) =>
    api.delete(`${BASE}/${id}`);

export const getExpensesByBudget = (budgetId) =>
    api.get(`${BASE}/budget/${budgetId}`);

export const getExpensesByDepartment = (department) =>
    api.get(`${BASE}/department/${department}`);

export const getExpensesByCategory = (category) =>
    api.get(`${BASE}/category/${category}`);