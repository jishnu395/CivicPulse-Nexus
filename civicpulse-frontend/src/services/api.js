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
        api.get(`/api/citizens/status/${status}`),

    getByEmail: (email) =>
    api.get(`/api/citizens/email/${email}`)
};

export const certificateAPI = {

    dashboard: () =>
        api.get("/api/dashboard"),

    apply: (data) =>
        api.post("/api/certificates/apply", data),

    getMy: (citizenId) =>
        api.get(`/api/certificates/my/${citizenId}`),

    getById: (id) =>
        api.get(`/api/certificates/${id}`),

    pending: () =>
        api.get("/api/officer/pending"),

    getDocuments: (applicationId) =>
        api.get(`/api/officer/documents/${applicationId}`),

    verify: (id, data) =>
        api.put(`/api/officer/verify/${id}`, data),

    approve: (id, data) =>
        api.put(`/api/officer/approve/${id}`, data),

    reject: (id, data) =>
        api.put(`/api/officer/reject/${id}`, data),

    generate: (id) =>
        api.post(`/api/certificate/generate/${id}`),

    download: (applicationId) =>
    api.get(`/api/certificate/download/${applicationId}`),
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