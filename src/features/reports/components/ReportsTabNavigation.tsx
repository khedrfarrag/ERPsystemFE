import React from 'react';
import { ShoppingBag, TrendingUp, Boxes, Users, Wallet } from 'lucide-react';
import type { ReportTabType } from '../types/reports.types';

interface ReportsTabNavigationProps {
  activeTab: ReportTabType;
  onTabChange: (tab: ReportTabType) => void;
}

export const ReportsTabNavigation: React.FC<ReportsTabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profit-loss', label: 'قائمة الأرباح والخسائر (P&L)', icon: TrendingUp },
    { id: 'sales', label: 'تقرير ملخص المبيعات', icon: ShoppingBag },
    { id: 'inventory-valuation', label: 'تقييم المخزون وحركة الأصناف', icon: Boxes },
    { id: 'balances', label: 'أرصدة العملاء والموردين', icon: Users },
    { id: 'cash-audit', label: 'تدقيق درج الكاشير والورديات', icon: Wallet },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-700 print:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id as ReportTabType)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition-all shrink-0 border ${
              isActive
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
