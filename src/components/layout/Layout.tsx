import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { UserOnboardingTour } from '../onboarding/UserOnboardingTour';
import { ForceChangePasswordModal } from '../auth/ForceChangePasswordModal';

export const Layout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

  // Auto-dismiss mobile drawer on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll on mobile when sidebar drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors duration-200" dir="rtl">
      <div className="print:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-1 mr-0 lg:mr-64 print:mr-0 print:m-0 flex flex-col min-w-0 transition-all duration-300">
        <div className="print:hidden">
          <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} isSidebarOpen={isSidebarOpen} />
        </div>
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300 print:p-0 print:m-0 print:max-w-none">
          <Outlet />
        </main>
      </div>
      <div className="print:hidden">
        <UserOnboardingTour />
        <ForceChangePasswordModal isOpen={!!user?.mustChangePassword} />
      </div>
    </div>
  );
};
