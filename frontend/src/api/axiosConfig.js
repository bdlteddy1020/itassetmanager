import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

console.log('🔗 Axios baseURL:', baseURL);


const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

export default axiosInstance;
