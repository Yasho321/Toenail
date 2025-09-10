import axios from 'axios';



export const axiosInstance = axios.create({
  baseURL: 'https://toenail.onrender.com/api/v1',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
 
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});