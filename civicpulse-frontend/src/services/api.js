import api from "../api/axios";

export const citizenAPI = {

    getByUserId: (userId) =>
        api.get(`/api/citizens/user/${userId}`),

    getById: (id) =>
        api.get(`/api/citizens/${id}`),

    create: (data) =>
        api.post("/api/citizens", data),

    update: (id, data) =>
        api.put(`/api/citizens/${id}`, data),

    delete: (id) =>
        api.delete(`/api/citizens/${id}`),

    getByWard: (ward) =>
        api.get(`/api/citizens/ward/${ward}`),

    getByStatus: (status) =>
        api.get(`/api/citizens/status/${status}`)
};

export const grievanceAPI = {

    getAll: () =>
        api.get("/api/grievances"),

    getMy: () =>
        api.get("/api/grievances/my"),

    getById: (id) =>
        api.get(`/api/grievances/${id}`),

    create: (data) =>
        api.post("/api/grievances", data),

    update: (id, data) =>
        api.put(`/api/grievances/${id}`, data),

    delete: (id) =>
        api.delete(`/api/grievances/${id}`),

    getByCitizen: (citizenId) =>
        api.get(`/api/grievances/citizen/${citizenId}`),

    assign: (id, data) =>
        api.put(`/api/grievances/${id}/assign`, data),

    updateStatus: (id, data) =>
        api.put(`/api/grievances/${id}/status`, data),

    history: (id) =>
        api.get(`/api/grievances/${id}/history`),

    dashboard: () =>
        api.get("/api/grievances/dashboard")
};