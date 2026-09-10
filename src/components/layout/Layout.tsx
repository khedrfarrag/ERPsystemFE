import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors duration-200" dir="rtl">
      <div className="print:hidden"><Sidebar /></div>
      <div className="flex-1 mr-64 print:mr-0 print:m-0 flex flex-col min-w-0">
        <div className="print:hidden"><Navbar /></div>
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300 print:p-0 print:m-0 print:max-w-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
