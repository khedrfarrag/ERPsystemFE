import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import type { ApiResponse, DashboardSummary } from '../../types';
import { Store, Wallet, AlertTriangle, Sun, Moon, LogOut } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: summary } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
      return res.data.data;
    },
    staleTime: 30000,
  });

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-colors">
      {/* Left: Store Branding & Live Shift Indicators */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-xs font-bold">
          <Store className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>{user?.storeName || 'المتجر الرئيسي'}</span>
        </div>

        {summary && summary.isCashRegisterOpen ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Wallet className="w-3.5 h-3.5" />
            <span>درج الكاشير:</span>
            <span className="font-mono text-xs font-black">
              {summary.liveCashDrawerBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>الوردية مغلقة</span>
          </div>
        )}

        {summary && (summary.lowStockCount > 0 || summary.outOfStockCount > 0) && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-bold">
            <span className="font-mono">{summary.lowStockCount + summary.outOfStockCount}</span>
            <span>نواقص مخزون</span>
          </div>
        )}
      </div>

      {/* Right: Theme Toggle & User Info & Logout */}
      <div className="flex items-center gap-3">
        {/* Notification Center */}
        <NotificationDropdown />

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'التبديل إلى النمط الفاتح' : 'التبديل إلى النمط الداكن'}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 border-r border-slate-200 dark:border-slate-700 pr-3">
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase">
              {user?.role === 'Owner'
                ? 'مالك النظام'
                : user?.role === 'Manager'
                ? 'مدير فرع'
                : user?.role === 'Cashier'
                ? 'كاشير مبيعات'
                : 'أمين مخزن'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 flex items-center justify-center font-black text-sm">
            {user?.firstName ? user.firstName[0] : 'U'}
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          title="تسجيل الخروج"
          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
