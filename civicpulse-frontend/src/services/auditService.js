import api from "../api/axios";

const BASE = "/api/audit";

export const getAuditLogs = () =>
    api.get(BASE);

export const getAuditById = (id) =>
    api.get(`${BASE}/${id}`);

export const getAuditByEntity = (entity) =>
    api.get(`${BASE}/entity/${entity}`);