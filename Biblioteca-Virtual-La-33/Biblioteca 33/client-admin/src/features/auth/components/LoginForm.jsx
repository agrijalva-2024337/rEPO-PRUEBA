import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore.js';
import { showSuccess } from '../../../shared/utils/toast.js';
import { getDefaultRouteForRole } from '../../../shared/utils/roles.js';

export const LoginForm = ({ onForgot, onRegister }) => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const [form, setForm] = useState({ emailOrUsername: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.success) {
      const destination = getDefaultRouteForRole(res.role);
      const welcome =
        res.role === 'TEACHER_ROLE'
          ? 'Bienvenido — Panel docente'
          : 'Bienvenido — Panel de moderación';
      showSuccess(welcome);
      navigate(destination, { replace: true });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <div>
        <div className="relative">
          <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            id="emailOrUsername"
            name="emailOrUsername"
            value={form.emailOrUsername}
            onChange={handleChange}
            required
            placeholder="Correo Institucional"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] py-2.5 pl-12 pr-4 text-sm text-[var(--text-h)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      <div>
        <div className="relative">
          <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Contraseña"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] py-2.5 pl-12 pr-4 text-sm text-[var(--text-h)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {error && <p className="text-[var(--danger)] text-sm text-center">{error}</p>}

      {onForgot && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgot}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Olvidé mi contraseña
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[var(--accent)] text-[#2a1c0f] font-semibold py-3 shadow-[0_12px_24px_rgba(232,132,43,0.28)] transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
      >
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </button>

      {onRegister && (
        <p className="text-center text-sm text-[var(--text-muted)]">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={onRegister}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            Regístrate
          </button>
        </p>
      )}
    </form>
  );
};
