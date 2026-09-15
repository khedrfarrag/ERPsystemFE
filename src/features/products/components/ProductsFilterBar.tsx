import React from 'react';
import { Search, X, Filter, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import type { Category } from '../types/products.types';

interface ProductsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  stockFilter: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  onStockFilterChange: (filter: 'all' | 'inStock' | 'lowStock' | 'outOfStock') => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (filter: 'all' | 'active' | 'inactive') => void;
  categories: Category[];
}

export const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  stockFilter,
  onStockFilterChange,
  statusFilter,
  onStatusFilterChange,
  categories,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 right-3.5 my-auto pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم، الباركود، أو التصنيف..."
            className="w-full pr-10 pl-9 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-600 touch-target"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          >
            <option value="all">جميع الأقسام والتصنيفات</option>
            {(Array.isArray(categories) ? categories : []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Status Select */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base sm:text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          >
            <option value="all">جميع الحالات (نشط ومعطل)</option>
            <option value="active">الأصناف النشطة فقط</option>
            <option value="inactive">الأصناف المعطلة فقط</option>
          </select>
        </div>
      </div>

      {/* Stock Quick Filters */}
      <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-700/60 pb-1">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-1">تصفية المخزون:</span>
        <button
          type="button"
          onClick={() => onStockFilterChange('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] cursor-pointer ${
            stockFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          الكل
        </button>

        <button
          type="button"
          onClick={() => onStockFilterChange('inStock')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] cursor-pointer ${
            stockFilter === 'inStock'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>متوفر بالمخزن</span>
        </button>

        <button
          type="button"
          onClick={() => onStockFilterChange('lowStock')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] cursor-pointer ${
            stockFilter === 'lowStock'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>نواقص (قارب على النفاد)</span>
        </button>

        <button
          type="button"
          onClick={() => onStockFilterChange('outOfStock')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] cursor-pointer ${
            stockFilter === 'outOfStock'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>رصيد صفر (نافد)</span>
        </button>
      </div>
    </div>
  );
};
