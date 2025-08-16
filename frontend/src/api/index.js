
import axios from './axiosConfig';

// procurement API
export const procurementAPI = {
  list: () => axios.get('/procurements'),
  create: (data) => axios.post('/procurements', data),
  approve: (id, payload) => axios.put(`/procurements/${id}/approve`, payload),
  order: (id) => axios.post(`/procurements/${id}/order`),   
  deliver: (id) => axios.put(`/procurements/${id}/deliver`),  
  delete: (id) => axios.delete(`/procurements/${id}`),
  getById: (id) => axios.get(`/procurements/${id}`)
};



// hardware API
export const hardwareAPI = {
  list: () => axios.get('/hardware'),
  create: (data) => axios.post('/hardware', data),
  assign: (id, payload) => axios.put(`/hardware/${id}/assign`, payload),
  decommission: (id) => axios.put(`/hardware/${id}/decommission`),
  deleteHardware: (id) => axios.delete(`/hardware/${id}`),
  update: (id, data) => axios.put(`/hardware/${id}`, data),
  updateHardware: (id, data) => axios.put(`/hardware/${id}`, data),
  getById: (id) => axios.get(`/hardware/${id}`),
};


// support API
export const supportAPI = {
  list: () => axios.get('/support'),
  create: (data) => axios.post('/support', data),
  update: (id, payload) => axios.put(`/support/${id}`, payload)
};

// bug/task API
export const bugAPI = {
  list: () => axios.get('/bugs'),
  create: (data) => axios.post('/bugs', data),
  update: (id, payload) => axios.put(`/bugs/${id}`, payload),
  delete: (id) => axios.delete(`/bugs/${id}`)
};

export default axios;
