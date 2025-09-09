import axios from 'axios';

const API_BASE_URL = 'https://toenail.onrender.com/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Add auth token from Clerk if available
  const token = localStorage.getItem('clerk-db-jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});