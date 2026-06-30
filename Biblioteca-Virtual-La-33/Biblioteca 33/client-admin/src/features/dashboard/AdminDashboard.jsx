import { Link } from 'react-router-dom';
import { PageHeader } from '../../shared/components/ui/PageHeader.jsx';
import { Card } from '../../shared/components/ui/Card.jsx';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { ShieldCheckIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/outline';

export const AdminDashboard = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title={`Bienvenido, ${user?.username || user?.name || 'administrador'}`}
        subtitle="Panel de administración de la Biblioteca Virtual La 33"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/moderacion">
          <Card className="transition hover:border-[var(--accent)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(232,132,43,0.15)] text-[var(--accent)]">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-h)]">Moderación</h3>
                <p className="text-sm text-[var(--text-muted)]">Revisar documentos pendientes</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/materiales">
          <Card className="transition hover:border-[var(--accent)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(232,132,43,0.15)] text-[var(--accent)]">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-h)]">Materiales</h3>
                <p className="text-sm text-[var(--text-muted)]">Explorar la biblioteca</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/admin/estudiantes">
          <Card className="transition hover:border-[var(--accent)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(232,132,43,0.15)] text-[var(--accent)]">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-h)]">Usuarios</h3>
                <p className="text-sm text-[var(--text-muted)]">Gestionar cuentas y roles</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};
