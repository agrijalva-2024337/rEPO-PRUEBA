// client-user/src/shared/api/authClient.js
import axios from 'axios';
import { AUTH_URL } from '../constants/endpoints.js';
import { useAuthStore } from '../store/authStore.js';

export const authClient = axios.create({
  baseURL: AUTH_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

authClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const loginRequest = async ({ emailOrUsername, password }) => {
  const { data } = await authClient.post('/Auth/login', {
    emailOrUsername,
    password,
  });
  return data;
};

export const getProfileRequest = async () => {
  const { data } = await authClient.get('/Auth/profile');
  return data?.data ?? data;
};

export const registerRequest = async (formData) => {
  const { data } = await authClient.post('/Auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
