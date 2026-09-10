import React from 'react';
import { Search, X, Filter, Calendar, FolderPlus } from 'lucide-react';
import type { ExpenseCategory, PaymentMethod } from '../types/expenses.types';

interface ExpensesFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedPaymentMethod: 'all' | PaymentMethod;
  onPaymentMethodChange: (method: 'all' | PaymentMethod) => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  categories: ExpenseCategory[];
  onOpenAddCategory: () => void;
  onResetFilters: () => void;
}

export const ExpensesFilterBar: React.FC<ExpensesFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPaymentMethod,
  onPaymentMethodChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  categories,
  onOpenAddCategory,
  onResetFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute inset-y-0 right-3 my-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث في بيان أو تفاصيل المصروف..."
            className="w-full pr-9 pl-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
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

        {/* Category Select & Add button */}
        <div className="md:col-span-3 flex items-center gap-1.5">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">جميع أقسام المصروفات</option>
            {(Array.isArray(categories) ? categories : []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onOpenAddCategory}
            title="إضافة قسم مصروفات جديد"
            className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </button>
        </div>

        {/* Payment Method Select */}
        <div className="md:col-span-2">
          <select
            value={selectedPaymentMethod}
            onChange={(e) => onPaymentMethodChange(e.target.value as 'all' | PaymentMethod)}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">جميع طرق الدفع</option>
            <option value="Cash">نقدي (درج الكاشير)</option>
            <option value="BankTransfer">تحويل بنكي / محفظة</option>
            <option value="Cheque">شيك بنكي</option>
          </select>
        </div>

        {/* Date Filter: From & To */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">إلى</span>
          <div className="relative flex-1">
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full py-2 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {(fromDate || toDate || selectedCategory !== 'all' || selectedPaymentMethod !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={onResetFilters}
              title="إعادة ضبط الفلاتر"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
