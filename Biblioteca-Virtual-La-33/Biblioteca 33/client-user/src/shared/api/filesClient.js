// client-user/src/shared/api/filesClient.js
import axios from 'axios';
import { FILES_URL } from '../constants/endpoints.js';
import { useAuthStore } from '../store/authStore.js';

export const filesClient = axios.create({
  baseURL: FILES_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

filesClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

filesClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const getFiles = async (params = {}) => {
  const { data } = await filesClient.get('/files', { params });
  return data;
};

export const searchFiles = async (q) => {
  const { data } = await filesClient.get('/files/search', { params: { q } });
  return data;
};

export const getMyFiles = async () => {
  const { data } = await filesClient.get('/files/mine');
  return data;
};

export const getFileById = async (id) => {
  const { data } = await filesClient.get(`/files/${id}`);
  return data;
};

export const getSubjects = async () => {
  const { data } = await filesClient.get('/subjects');
  return data;
};

export const uploadFile = async ({ file, title, description, subject }) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);
  if (subject) formData.append('subject', subject);

  const { data } = await filesClient.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getComments = async (fileId) => {
  const { data } = await filesClient.get(`/comments/${fileId}`);
  return data;
};

export const addComment = async ({ fileId, text }) => {
  const { data } = await filesClient.post('/comments', { fileId, text });
  return data;
};
