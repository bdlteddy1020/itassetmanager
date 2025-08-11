import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Procurement
export const createProcurementRequest = (data) => API.post('/procurement', data);
export const approveProcurementRequest = (id) => API.patch(`/procurement/${id}/approve`);

// Assets
export const registerHardware = (data) => API.post('/assets', data);
export const assignHardware = (id, userId) => API.patch(`/assets/${id}/assign`, { userId });

// Tickets
export const createSupportTicket = (data) => API.post('/tickets', data);

// Bugs
export const createBugReport = (data) => API.post('/bugs', data);
export const resolveBug = (id) => API.patch(`/bugs/${id}/resolve`);

export default API;
