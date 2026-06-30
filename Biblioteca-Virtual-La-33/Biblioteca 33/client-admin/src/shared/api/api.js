import axios from '../utils/axios.js';
import { useAuthStore } from '../../features/auth/store/authStore.js';

const attachAuth = (instance, clientName) => {
  instance.interceptors.request.use((config) => {
    config._axiosClient = clientName;
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );
};

export const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosFiles = axios.create({
  baseURL: import.meta.env.VITE_FILES_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosModeration = axios.create({
  baseURL: import.meta.env.VITE_MODERATION_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export const axiosNotifications = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATIONS_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

attachAuth(axiosAuth, 'auth');
attachAuth(axiosFiles, 'files');
attachAuth(axiosModeration, 'moderation');
attachAuth(axiosNotifications, 'notifications');

export { axiosAuth as default };
