import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import {
  HomeIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Logo } from '../ui/Logo.jsx';

const navItems = [
  { label: 'Inicio', to: '/teacher/inicio', icon: HomeIcon, end: true },
  { label: 'Materiales', to: '/teacher/materiales', icon: DocumentTextIcon },
  { label: 'Perfil', to: '/teacher/perfil', icon: UserCircleIcon },
];

export const TeacherSidebar = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <aside className="flex w-[var(--sidebar-w)] shrink-0 flex-col justify-between self-stretch overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-card)]/92 px-5 py-6 backdrop-blur-md">
      <div>
        <div className="mb-8">
          <Logo size="sm" showText badge="Docente" title="Biblioteca La 33" />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[var(--accent)] text-[#2a1c0f] shadow-[0_8px_20px_rgba(232,132,43,0.25)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-h)]'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/', { replace: true });
        }}
        className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-h)] hover:bg-[var(--bg-hover)]"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Cerrar sesión
      </button>
    </aside>
  );
};
