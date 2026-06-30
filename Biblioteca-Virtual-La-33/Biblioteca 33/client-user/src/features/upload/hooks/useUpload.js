// client-user/src/features/upload/hooks/useUpload.js
import { useCallback, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import {
  getMyFiles,
  getSubjects,
  uploadFile as uploadFileRequest,
} from '../../../shared/api/filesClient.js';
import { normalizeList } from '../../../utils/formatters.js';

export const useUpload = () => {
  const [subjects, setSubjects] = useState([]);
  const [myFiles, setMyFiles] = useState([]);
  const [pickedFile, setPickedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await getSubjects();
      setSubjects(normalizeList(response));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar asignaturas');
      setSubjects([]);
    }
  }, []);

  const fetchMyFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyFiles();
      setMyFiles(normalizeList(response));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar tus cargas');
      setMyFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const pickDocument = useCallback(async () => {
    setError(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) {
        return { success: false };
      }

      const asset = result.assets[0];
      setPickedFile(asset);
      return { success: true, file: asset };
    } catch (err) {
      const message = err.message || 'No se pudo seleccionar el archivo';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const uploadMaterial = useCallback(
    async ({ title, description, subject }) => {
      if (!pickedFile) {
        const message = 'Selecciona un archivo primero';
        setError(message);
        return { success: false, error: message };
      }

      setUploading(true);
      setError(null);

      try {
        const filePayload = {
          uri: pickedFile.uri,
          name: pickedFile.name,
          type: pickedFile.mimeType || 'application/octet-stream',
        };

        await uploadFileRequest({
          file: filePayload,
          title: title?.trim(),
          description: description?.trim(),
          subject,
        });

        setPickedFile(null);
        await fetchMyFiles();
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'Error al subir el archivo';
        setError(message);
        return { success: false, error: message };
      } finally {
        setUploading(false);
      }
    },
    [pickedFile, fetchMyFiles]
  );

  const clearPickedFile = useCallback(() => {
    setPickedFile(null);
  }, []);

  return {
    subjects,
    myFiles,
    pickedFile,
    loading,
    uploading,
    error,
    fetchSubjects,
    fetchMyFiles,
    pickDocument,
    uploadMaterial,
    clearPickedFile,
  };
};
