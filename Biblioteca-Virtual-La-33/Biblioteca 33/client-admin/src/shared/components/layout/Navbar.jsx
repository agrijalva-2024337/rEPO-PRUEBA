import { BellIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead } from '../../api/notifications';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { showError } from '../../utils/toast';
import { getRoleLabel } from '../../utils/roles.js';
import { Logo } from '../ui/Logo.jsx';

// Normaliza las distintas formas posibles de respuesta del notification-service
const extractList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.notifications)) return payload.data.notifications;
  return [];
};

export const Navbar = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const role = useAuthStore((s) => s.getRole());
  const navigate = useNavigate();
  const profilePath = isAdmin ? '/admin/perfil' : '/teacher/perfil';
  const notificationsPath = isAdmin ? '/admin/notificaciones' : null;

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);

  // El backend no expone conteo de no leídas: lo derivamos de la lista.
  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications({ limit: 10 });
      setNotifications(extractList(res));
    } catch {
      // Silencioso: el navbar no debe romper si notifications está caído.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, read: true } : item))
      );
    } catch {
      showError('No se pudo marcar la notificación');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const initials = user?.username?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U';
  const roleLabel = getRoleLabel(role);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)]/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-[1600px] items-center px-10">

        <div className="flex flex-1 items-center gap-4">
          <Logo size="md" showText badge="Biblioteca" />
        </div>

        <div className="flex flex-1 items-center justify-end gap-5">

          {/* Notificaciones */}
          <div className="relative">
            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text-h)] transition hover:bg-[var(--bg-hover)]"
              onClick={() => setOpen((v) => !v)}
              type="button"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-14 z-50 max-h-[28rem] w-[23rem] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-lg)]">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-h)]">Notificaciones</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)]">No leídas: {unreadCount}</span>
                    {notificationsPath && (
                      <Link to={notificationsPath} className="text-xs font-medium text-[var(--accent)] hover:underline">
                        Ver todas
                      </Link>
                    )}
                  </div>
                </div>
                {loading ? (
                  <p className="text-sm text-[var(--text-muted)]">Cargando...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">Sin notificaciones</p>
                ) : (
                  <ul className="space-y-2">
                    {notifications.map((n) => (
                      <li
                        key={n._id}
                        className={`rounded-xl border p-3 text-sm ${
                          n.read
                            ? 'border-[var(--border)] bg-[var(--bg-alt)]'
                            : 'border-[var(--accent)] bg-[rgba(232,132,43,0.1)]'
                        }`}
                      >
                        <p className="font-semibold text-[var(--text-h)]">{n.title}</p>
                        <p className="mt-1 text-[var(--text-muted)]">{n.message}</p>
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => handleRead(n._id)}
                            className="mt-2 text-xs font-medium text-[var(--accent)] underline"
                          >
                            Marcar leída
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-[var(--border)]" />

          {/* Avatar + menú */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-[#2a1c0f] font-semibold"
            >
              {initials}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] z-50">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="font-semibold text-[var(--text-h)]">{user?.username || user?.name || 'Usuario'}</p>
                  <p className="text-xs text-[var(--text-muted)]">{roleLabel}</p>
                </div>
                <ul className="p-2 text-sm">
                  <li>
                    <Link
                      to={profilePath}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 text-[var(--text-h)] hover:bg-[var(--bg-hover)]"
                    >
                      Mi perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left rounded-xl px-3 py-2 text-[var(--danger)] hover:bg-[var(--bg-hover)]"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
