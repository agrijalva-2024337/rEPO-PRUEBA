import { axiosFiles } from './api';

// Subir archivo (multipart). Campos reales: file, title, description, subject
export const uploadFile = async ({ file, title, description, subject }) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);
  if (subject) formData.append('subject', subject);

  const { data } = await axiosFiles.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Listado con filtros opcionales: status, subject, q
export const getFiles = async (params = {}) => {
  const { data } = await axiosFiles.get('/files', { params });
  return data;
};

export const searchFiles = async (q) => {
  const { data } = await axiosFiles.get('/files/search', { params: { q } });
  return data;
};

export const getMyFiles = async () => {
  const { data } = await axiosFiles.get('/files/mine');
  return data;
};

export const getFileById = async (id) => {
  const { data } = await axiosFiles.get(`/files/${id}`);
  return data;
};

export const addComment = async ({ fileId, text }) => {
  const { data } = await axiosFiles.post('/comments', { fileId, text });
  return data;
};

export const getComments = async (fileId) => {
  const { data } = await axiosFiles.get(`/comments/${fileId}`);
  return data;
};

export const getSubjects = async () => {
  const { data } = await axiosFiles.get('/subjects');
  return data;
};

export const createSubject = async ({ name }) => {
  const { data } = await axiosFiles.post('/subjects', { name });
  return data;
};
