import { useState } from 'react';
import { forgotPassword } from '../../../shared/api/auth';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const ForgotPassword = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      showSuccess(res?.message || 'Si el correo existe, enviamos un enlace de recuperación.');
    } catch (err) {
      showError(err.response?.data?.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-2">
          Correo institucional
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Correo electrónico"
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] py-3 px-4 text-sm text-[var(--text-h)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 placeholder:text-[var(--text-muted)]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[var(--accent)] text-[#2a1c0f] font-semibold py-3 shadow-[0_12px_24px_rgba(232,132,43,0.28)] transition hover:bg-[var(--accent-dark)] disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Recuperar Contraseña'}
      </button>

      <p className="text-center text-sm text-[var(--text-muted)]">
        ¿Recordaste tu contraseña?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[var(--accent)] font-medium hover:underline"
        >
          Iniciar Sesión
        </button>
      </p>
    </form>
  );
};
