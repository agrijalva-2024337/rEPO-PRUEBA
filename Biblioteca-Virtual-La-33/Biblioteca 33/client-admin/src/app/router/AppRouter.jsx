import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { AdminDashboard } from '../../features/dashboard/AdminDashboard.jsx';
import { TeacherDashboard } from '../../features/dashboard/TeacherDashboard.jsx';
import { ModerationPanel } from '../../features/moderation/components/ModerationPanel.jsx';
import { MaterialsList } from '../../features/materials/components/MaterialsList.jsx';
import { StudentsList } from '../../features/students/components/StudentsList.jsx';
import { SubjectsPanel } from '../../features/subjects/components/SubjectsPanel.jsx';
import { NotificationsPanel } from '../../features/notifications/components/NotificationsPanel.jsx';
import { ProfilePage } from '../../features/profile/ProfilePage.jsx';
import { useAuthStore } from '../../features/auth/store/authStore.js';
import { Spinner } from '../../features/auth/components/Spinner.jsx';
import { ADMIN_ROLE, TEACHER_ROLE, getDefaultRouteForRole } from '../../shared/utils/roles.js';

const HomeRedirect = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.getRole());
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }

    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) return <Spinner />;

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <AuthPage />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={[ADMIN_ROLE]}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route path="/admin/inicio" element={<AdminDashboard />} />
        <Route path="/admin/moderacion" element={<ModerationPanel />} />
        <Route path="/admin/materiales" element={<MaterialsList />} />
        <Route path="/admin/estudiantes" element={<StudentsList />} />
        <Route path="/admin/asignaturas" element={<SubjectsPanel canCreate />} />
        <Route path="/admin/notificaciones" element={<NotificationsPanel />} />
        <Route path="/admin/perfil" element={<ProfilePage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={[TEACHER_ROLE]}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoute>
        }
      >
        <Route path="/teacher/inicio" element={<TeacherDashboard />} />
        <Route path="/teacher/materiales" element={<MaterialsList readOnly />} />
        <Route path="/teacher/asignaturas" element={<SubjectsPanel canCreate />} />
        <Route path="/teacher/perfil" element={<ProfilePage />} />
      </Route>

      {/* Legacy paths → /admin/* */}
      <Route path="/inicio" element={<Navigate to="/admin/inicio" replace />} />
      <Route path="/moderacion" element={<Navigate to="/admin/moderacion" replace />} />
      <Route path="/materiales" element={<Navigate to="/admin/materiales" replace />} />
      <Route path="/estudiantes" element={<Navigate to="/admin/estudiantes" replace />} />
      <Route path="/asignaturas" element={<Navigate to="/admin/asignaturas" replace />} />
      <Route path="/notificaciones" element={<Navigate to="/admin/notificaciones" replace />} />
      <Route path="/perfil" element={<Navigate to="/admin/perfil" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
