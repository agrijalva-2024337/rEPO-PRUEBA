import { useCallback, useEffect, useState } from 'react';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { createSubject, getSubjects } from '../../../shared/api/files';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

const normalizeSubjects = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const SubjectsPanel = ({ canCreate = false }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubjects();
      setSubjects(normalizeSubjects(response));
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar asignaturas';
      setError(message);
      showError(message);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);
    try {
      await createSubject({ name: trimmed });
      setName('');
      showSuccess('Asignatura creada');
      await fetchSubjects();
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear la asignatura';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Asignaturas"
        subtitle={canCreate ? 'Crea y consulta las asignaturas de la biblioteca' : 'Listado de asignaturas'}
        action={
          <Button
            type="button"
            variant="secondary"
            onClick={fetchSubjects}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        }
      />

      {error && (
        <p className="mb-4 text-sm text-[var(--danger)]">{error}</p>
      )}

      {canCreate && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Nueva asignatura"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Matemáticas"
                required
              />
            </div>
            <Button type="submit" disabled={saving} className="flex items-center gap-2 sm:mb-0">
              <PlusIcon className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Crear'}
            </Button>
          </form>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
            <tr>
              <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">Nombre</th>
              <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">ID</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr
                key={subject._id}
                className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)]"
              >
                <td className="px-5 py-4 font-medium text-[var(--text-h)]">{subject.name}</td>
                <td className="px-5 py-4 text-[var(--text-muted)]">{subject._id}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && subjects.length === 0 && (
          <div className="p-10 text-center text-[var(--text-muted)]">
            No hay asignaturas registradas
          </div>
        )}
      </div>
    </div>
  );
};
