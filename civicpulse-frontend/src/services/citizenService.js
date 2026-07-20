import api from "../api/axios";

const BASE_URL = "/api/citizens";

const citizenService = {

    getAllCitizens: () => api.get(BASE_URL),

    getCitizenById: (id) => api.get(`${BASE_URL}/${id}`),

    registerCitizen: (data) => api.post(BASE_URL, data),

    updateCitizen: (id, data) => api.put(`${BASE_URL}/${id}`, data),

    deleteCitizen: (id) => api.delete(`${BASE_URL}/${id}`),

    getCitizensByWard: (ward) =>
        api.get(`${BASE_URL}/ward/${ward}`),

    getCitizensByStatus: (status) =>
        api.get(`${BASE_URL}/status/${status}`)
};

export default citizenService;