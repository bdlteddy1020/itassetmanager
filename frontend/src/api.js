import axios from 'axios';
const API_ROOT = 'http://localhost:5000/api';

export const procurementAPI = {
  list: () => axios.get(`${API_ROOT}/procurements`),
  create: (data) => axios.post(`${API_ROOT}/procurements`, data),
  approve: (id, payload) => axios.put(`${API_ROOT}/procurements/${id}/approve`, payload),
  markDelivered: (id, payload) => axios.put(`${API_ROOT}/procurements/${id}/deliver`, payload)
};

export const hardwareAPI = {
  create: (data) => axios.post(`${API_ROOT}/hardware`, data),
  list: () => axios.get(`${API_ROOT}/hardware`),
  assign: (id, payload) => axios.put(`${API_ROOT}/hardware/${id}/assign`, payload),
  decommission: (id) => axios.put(`${API_ROOT}/hardware/${id}/decommission`)
};

export const supportAPI = {
  create: (data) => axios.post(`${API_ROOT}/support`, data),
  list: () => axios.get(`${API_ROOT}/support`),
  update: (id, payload) => axios.put(`${API_ROOT}/support/${id}`, payload)
};

export const bugAPI = {
  create: (data) => axios.post(`${API_ROOT}/bugs`, data),
  list: () => axios.get(`${API_ROOT}/bugs`),
  update: (id, payload) => axios.put(`${API_ROOT}/bugs/${id}`, payload),
  delete: (id) => axios.delete(`${API_ROOT}/bugs/${id}`)
};
