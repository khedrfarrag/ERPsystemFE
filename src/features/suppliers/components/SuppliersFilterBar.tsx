import React from 'react';
import { Search, X, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SuppliersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  payablesFilter: 'all' | 'hasPayables' | 'zeroBalance';
  onPayablesFilterChange: (filter: 'all' | 'hasPayables' | 'zeroBalance') => void;
}

export const SuppliersFilterBar: React.FC<SuppliersFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  payablesFilter,
  onPayablesFilterChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="w-full sm:max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 right-3 my-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم المورد، الشركة، أو رقم الهاتف..."
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

        {/* Payables Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onPayablesFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              payablesFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            جميع الموردين
          </button>

          <button
            type="button"
            onClick={() => onPayablesFilterChange('hasPayables')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              payablesFilter === 'hasPayables'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>عليهم مستحقات</span>
          </button>

          <button
            type="button"
            onClick={() => onPayablesFilterChange('zeroBalance')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              payablesFilter === 'zeroBalance'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>حساب مسدد (0)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
