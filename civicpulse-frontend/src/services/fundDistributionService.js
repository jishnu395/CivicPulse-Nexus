import api from "../api/axios";

const BASE = "/api/fund-distributions";

export const getFundDistributions = () =>
    api.get(BASE);

export const getFundDistribution = (id) =>
    api.get(`${BASE}/${id}`);

export const createFundDistribution = (data) =>
    api.post(BASE, data);

export const completeDistribution = (id) =>
    api.put(`${BASE}/${id}/complete`);

export const failDistribution = (id) =>
    api.put(`${BASE}/${id}/fail`);

export const getByCitizen = (citizenId) =>
    api.get(`${BASE}/citizen/${citizenId}`);

export const getByBeneficiary = (beneficiaryId) =>
    api.get(`${BASE}/beneficiary/${beneficiaryId}`);

export const getByStatus = (status) =>
    api.get(`${BASE}/status/${status}`);