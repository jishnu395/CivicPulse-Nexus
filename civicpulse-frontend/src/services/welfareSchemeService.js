import api from "../api/axios";

const BASE = "/api/welfare/schemes";

export const getSchemes = () =>
    api.get(BASE);

export const getScheme = (id) =>
    api.get(`${BASE}/${id}`);

export const createScheme = (data) =>
    api.post(BASE, data);

export const updateScheme = (id, data) =>
    api.put(`${BASE}/${id}`, data);

export const deleteScheme = (id) =>
    api.delete(`${BASE}/${id}`);