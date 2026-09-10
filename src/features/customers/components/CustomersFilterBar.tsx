import React from 'react';
import { Search, X, Users, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CustomersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  debtFilter: 'all' | 'debtors' | 'overLimit' | 'zeroDebt';
  onDebtFilterChange: (filter: 'all' | 'debtors' | 'overLimit' | 'zeroDebt') => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
}

export const CustomersFilterBar: React.FC<CustomersFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  debtFilter,
  onDebtFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 right-3 my-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم العميل أو رقم الهاتف..."
            className="w-full pr-9 pl-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Select */}
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">جميع الحالات (نشط ومعطل)</option>
            <option value="active">العملاء النشطون فقط</option>
            <option value="inactive">العملاء المعطلون فقط</option>
          </select>
        </div>
      </div>

      {/* Debt Risk Filter Buttons */}
      <div className="flex items-center gap-2 pt-1 overflow-x-auto border-t border-slate-100 dark:border-slate-700/60">
        <span className="text-[11px] font-bold text-slate-400 ml-1">تصفية المديونيات:</span>
        <button
          type="button"
          onClick={() => onDebtFilterChange('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            debtFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          جميع العملاء
        </button>

        <button
          type="button"
          onClick={() => onDebtFilterChange('debtors')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            debtFilter === 'debtors'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>العملاء المدينون فقط</span>
        </button>

        <button
          type="button"
          onClick={() => onDebtFilterChange('overLimit')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            debtFilter === 'overLimit'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>تجاوز الائتمان (خطر)</span>
        </button>

        <button
          type="button"
          onClick={() => onDebtFilterChange('zeroDebt')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            debtFilter === 'zeroDebt'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>الرصيد الصفري (مسدد)</span>
        </button>
      </div>
    </div>
  );
};
