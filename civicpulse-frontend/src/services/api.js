import axios from "axios";

export const citizenAPI = axios.create({
    baseURL: "http://localhost:8082/api/citizens"
});

export const grievanceAPI = axios.create({
    baseURL: "http://localhost:8083/api/grievances"
});