import { Navbar } from './Navbar.jsx';
import { AdminSidebar } from './AdminSidebar.jsx';
import { TeacherSidebar } from './TeacherSidebar.jsx';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AppBackground } from '../ui/AppBackground.jsx';

export const DashboardContainer = ({ children }) => {
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const isTeacher = useAuthStore((s) => s.isTeacher());

  return (
    <AppBackground className="h-full text-[var(--text)]" fillHeight>
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0">
          <Navbar />
        </div>
        <div className="flex min-h-0 flex-1">
          {isAdmin && <AdminSidebar />}
          {isTeacher && <TeacherSidebar />}
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-6 xl:px-10">
            {children}
          </main>
        </div>
      </div>
    </AppBackground>
  );
};
