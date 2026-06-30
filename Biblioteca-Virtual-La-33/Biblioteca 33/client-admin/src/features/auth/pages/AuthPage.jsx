import { useState } from 'react';
import { LoginForm } from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';
import { showInfo } from '../../../shared/utils/toast.js';
import { AppBackground } from '../../../shared/components/ui/AppBackground.jsx';
import { LogoBrand } from '../../../shared/components/ui/Logo.jsx';

export const AuthPage = () => {
  const [view, setView] = useState('login');

  const handleRegister = () => {
    showInfo(
      'El registro público crea cuentas de estudiante. Los administradores y docentes deben ser asignados por un administrador.'
    );
  };

  return (
    <AppBackground className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[540px] rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)]/95 px-10 py-7 shadow-[var(--shadow-lg)] backdrop-blur-sm">
        <LogoBrand horizontal className="mb-6 justify-center" />

        {view === 'login' && (
          <LoginForm
            onForgot={() => setView('forgot')}
            onRegister={handleRegister}
          />
        )}

        {view === 'forgot' && (
          <ForgotPassword onSwitch={() => setView('login')} />
        )}
      </div>
    </AppBackground>
  );
};
