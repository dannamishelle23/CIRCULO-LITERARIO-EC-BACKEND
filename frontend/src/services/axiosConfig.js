import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosConfig;