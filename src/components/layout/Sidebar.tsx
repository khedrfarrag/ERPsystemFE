import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Users,
  Truck,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Building2,
  ShoppingBag,
  X,
} from 'lucide-react';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, logout, isOwnerOrManager } = useAuth();
  const [storeName, setStoreName] = useState<string>(user?.storeName || 'إدارة المحل');

  useEffect(() => {
    if (user?.storeName) {
      setStoreName(user.storeName);
    }
  }, [user?.storeName]);

  useEffect(() => {
    const handleStoreUpdate = (e: any) => {
      if (e.detail?.name) {
        setStoreName(e.detail.name);
      }
    };
    window.addEventListener('retailos:store-updated', handleStoreUpdate);
    return () => window.removeEventListener('retailos:store-updated', handleStoreUpdate);
  }, []);

  const navItems = [
    { to: '/', label: 'لوحة التحكم', icon: LayoutDashboard, exact: true },
    { to: '/pos', label: 'نقطة البيع الكاشير', icon: ShoppingCart },
    { to: '/sales', label: 'سجل الفواتير والمرتجعات', icon: FileText },
    { to: '/products', label: 'المنتجات والمخزون', icon: Package },
    { to: '/customers', label: 'العملاء والآجل', icon: Users },
    { to: '/suppliers', label: 'الموردين والشركات', icon: Truck },
    { to: '/expenses', label: 'المصروفات اليومية', icon: Receipt },
    ...(isOwnerOrManager
      ? [
          { to: '/b2b-orders', label: 'طلبات الجملة B2B', icon: ShoppingBag },
          { to: '/merchants', label: 'عملاء الجملة والمتاجر', icon: Building2 },
          { to: '/reports', label: 'التقارير المالية', icon: BarChart3 },
          { to: '/settings', label: 'إعدادات المتجر والمستخدمين', icon: Settings },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Dimmed Backdrop Overlay */}
      <div
        onClick={onClose}
        className={
          'fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ' +
          (isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
        }
        aria-hidden="true"
      />

      {/* Sidebar / Mobile Off-Canvas Drawer */}
      <aside
        className={
          'w-72 sm:w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 right-0 h-dvh max-h-dvh lg:h-screen z-50 shadow-2xl lg:shadow-xl border-l border-slate-800 select-none transition-transform duration-300 ease-in-out ' +
          (isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0')
        }
      >
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-lg text-white tracking-wide">RetailOS</h1>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[130px] sm:max-w-[140px]">
                {storeName}
              </p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors touch-target flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 min-h-0 p-3 sm:p-4 space-y-1 overflow-y-auto overscroll-contain">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-sm min-h-[42px] " +
                  (isActive
                    ? 'bg-primary-600 text-white font-semibold shadow-md shadow-primary-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60')
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/60 pb-safe shrink-0">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">
                {user ? user.firstName + ' ' + user.lastName : 'المستخدم'}
              </span>
              <span className="text-xs text-primary-400 font-semibold truncate">
                {user?.role === 'Owner'
                  ? 'مالك النظام'
                  : user?.role === 'Manager'
                  ? 'مدير فرع'
                  : user?.role === 'Merchant'
                  ? 'تاجر جملة'
                  : 'كاشير'}
              </span>
            </div>

            {/* Quick logout icon button right next to user details for instant access */}
            <button
              type="button"
              onClick={() => {
                onClose?.();
                logout();
              }}
              title="تسجيل الخروج"
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors touch-target flex items-center justify-center cursor-pointer"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                onClose?.();
                window.dispatchEvent(new CustomEvent('retailos:open-tour', { detail: { step: -1 } }));
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-primary-300 bg-primary-950/60 border border-primary-800/80 hover:bg-primary-900/60 transition min-h-[38px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>الجولة الإرشادية للنظام</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose?.();
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/20 hover:bg-rose-500/15 border border-rose-900/30 hover:text-rose-300 transition min-h-[38px] cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
