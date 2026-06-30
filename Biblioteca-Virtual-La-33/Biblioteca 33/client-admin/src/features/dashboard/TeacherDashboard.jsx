import { Link } from 'react-router-dom';
import { PageHeader } from '../../shared/components/ui/PageHeader.jsx';
import { Card } from '../../shared/components/ui/Card.jsx';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export const TeacherDashboard = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={`Bienvenido, ${user?.username || user?.name || 'docente'}`}
        subtitle="Panel docente de la Biblioteca Virtual La 33"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Link to="/teacher/materiales">
          <Card className="transition hover:border-[var(--accent)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(232,132,43,0.15)] text-[var(--accent)]">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-h)]">Materiales</h3>
                <p className="text-sm text-[var(--text-muted)]">Consultar recursos aprobados</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/teacher/asignaturas">
          <Card className="transition hover:border-[var(--accent)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(232,132,43,0.15)] text-[var(--accent)]">
                <AcademicCapIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-h)]">Asignaturas</h3>
                <p className="text-sm text-[var(--text-muted)]">Crear y listar asignaturas</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};
