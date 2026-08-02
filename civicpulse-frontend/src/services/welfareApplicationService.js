import api from "../api/axios";

const BASE = "/api/welfare/applications";

export const getPendingApplications = () =>
    api.get(`${BASE}/pending`);

export const getApplicationsByCitizen = (citizenId) =>
    api.get(`${BASE}/my/${citizenId}`);

export const createApplication = (data) =>
    api.post(`${BASE}/apply`, data);

export const approveApplication = (id) =>
    api.put(`${BASE}/${id}/approve`);

export const rejectApplication = (id, remarks) =>
    api.put(
        `${BASE}/${id}/reject`,
        null,
        {
            params: { remarks }
        }
    );