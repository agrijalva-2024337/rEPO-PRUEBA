import { useEffect, useState } from 'react';
import { EyeIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useMaterialsStore } from '../store/useMaterialsStore.js';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { formatDate, getFileTypeFromUrl } from '../../../shared/utils/formatter.js';
import { showError } from '../../../shared/utils/toast.js';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
];

const STATUS_LABELS = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

const getSubjectName = (file) => {
  if (!file?.subject) return '—';
  if (typeof file.subject === 'string') return '—';
  return file.subject.name || '—';
};

export const MaterialsList = ({ readOnly = false }) => {
  const files = useMaterialsStore((s) => s.files);
  const subjects = useMaterialsStore((s) => s.subjects);
  const loading = useMaterialsStore((s) => s.loading);
  const subjectsLoading = useMaterialsStore((s) => s.subjectsLoading);
  const error = useMaterialsStore((s) => s.error);
  const filters = useMaterialsStore((s) => s.filters);

  const setFilters = useMaterialsStore((s) => s.setFilters);
  const fetchSubjects = useMaterialsStore((s) => s.fetchSubjects);
  const fetchFiles = useMaterialsStore((s) => s.fetchFiles);
  const refreshFiles = useMaterialsStore((s) => s.refreshFiles);

  const [searchInput, setSearchInput] = useState(filters.q);

  useEffect(() => {
    if (readOnly) {
      setFilters({ status: 'approved' });
    }
  }, [readOnly, setFilters]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.q) {
        setFilters({ q: searchInput });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, filters.q, setFilters]);

  useEffect(() => {
    fetchFiles();
  }, [filters.q, filters.subject, filters.status, fetchFiles]);

  const handleSubjectChange = (e) => {
    setFilters({ subject: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleView = async (file) => {
    if (!file?.fileUrl) {
      showError('Este material no tiene URL disponible');
      return;
    }

    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) {
        showError('No se pudo descargar el archivo para visualizarlo');
        return;
      }

      const data = await response.arrayBuffer();
      const mimeType = file.mimeType || 'application/octet-stream';
      const fileName = file.originalName || file.title || 'archivo';
      const blob = new File([data], fileName, { type: mimeType });
      const objectUrl = URL.createObjectURL(blob);

      const opened = window.open(objectUrl, '_blank', 'noopener,noreferrer');
      if (!opened) {
        URL.revokeObjectURL(objectUrl);
        showError('No se pudo abrir el archivo. Permite ventanas emergentes e intenta de nuevo.');
        return;
      }

      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch {
      showError('No se pudo obtener el archivo. Comprueba tu conexión o intenta más tarde.');
    }
  };

  if (loading && files.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={readOnly ? 'Materiales aprobados' : 'Listado de Materiales Estudiantiles'}
        subtitle={
          readOnly
            ? 'Consulta los recursos aprobados de la biblioteca'
            : 'Consulta y filtra los recursos subidos por estudiantes'
        }
        action={
          <Button
            type="button"
            variant="secondary"
            onClick={() => refreshFiles()}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_200px_200px]">
        <div className="relative md:col-span-2 xl:col-span-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre del recurso..."
            className="pl-11"
          />
        </div>

        <Select
          label="Asignatura"
          value={filters.subject}
          onChange={handleSubjectChange}
          disabled={subjectsLoading}
        >
          <option value="">Todas las asignaturas</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </Select>

        {!readOnly && (
          <Select
            label="Estado"
            value={filters.status}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
              <tr>
                <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">Nombre del Recurso</th>
                <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">Tipo</th>
                <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">Asignatura</th>
                <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">Fecha de adición</th>
                <th className="px-5 py-4 font-semibold text-[var(--text-muted)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file._id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-[var(--text-h)]">
                        {file.title || file.originalName || 'Sin título'}
                      </span>
                      {!readOnly && file.status && (
                        <Badge status={file.status}>
                          {STATUS_LABELS[file.status] || file.status}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">
                    {getFileTypeFromUrl(file.fileUrl, file.originalName)}
                  </td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">{getSubjectName(file)}</td>
                  <td className="px-5 py-4 text-[var(--text-muted)]">{formatDate(file.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleView(file)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--accent)] transition hover:bg-[var(--bg-hover)]"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && files.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-[var(--text-muted)]">No hay materiales para mostrar</p>
            <button
              type="button"
              onClick={() => refreshFiles()}
              className="mt-4 text-sm text-[var(--accent)] underline"
            >
              Reintentar carga
            </button>
          </div>
        )}

        {loading && files.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--text-muted)]">
            Actualizando listado...
          </div>
        )}
      </div>
    </div>
  );
};
