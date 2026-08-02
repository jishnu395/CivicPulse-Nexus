import api from "../api/axios";

const BASE = "/api/welfare/beneficiaries";

export const getBeneficiaries = () =>
    api.get(BASE);

export const registerBeneficiary = (applicationId) =>
    api.post(`${BASE}/register/${applicationId}`);

export const getBeneficiariesByCitizen = (citizenId) =>
    api.get(`${BASE}/citizen/${citizenId}`);

export const getBeneficiariesByScheme = (schemeId) =>
    api.get(`${BASE}/scheme/${schemeId}`);