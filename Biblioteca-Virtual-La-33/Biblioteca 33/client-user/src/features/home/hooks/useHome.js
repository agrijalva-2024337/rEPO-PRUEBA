// client-user/src/features/home/hooks/useHome.js
import { useCallback, useState } from 'react';
import { getFiles, getSubjects } from '../../../shared/api/filesClient.js';
import { normalizeList } from '../../../utils/formatters.js';

const RECENT_LIMIT = 6;

export const useHome = () => {
  const [subjects, setSubjects] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [subjectsResponse, filesResponse] = await Promise.all([
        getSubjects(),
        getFiles({ status: 'approved' }),
      ]);

      const subjectsList = normalizeList(subjectsResponse);
      const filesList = normalizeList(filesResponse)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, RECENT_LIMIT);

      setSubjects(subjectsList);
      setRecentFiles(filesList);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el inicio');
      setSubjects([]);
      setRecentFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subjects,
    recentFiles,
    loading,
    error,
    fetchHomeData,
  };
};
