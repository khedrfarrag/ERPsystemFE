import React, { useState, useEffect } from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import api from '../../../api/client';

interface CustomerOption {
  id: string;
  name: string;
}

interface SalesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  customerId: string;
  onCustomerChange: (customerId: string) => void;
  onReset: () => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  search,
  onSearchChange,
  paymentMethod,
  onPaymentMethodChange,
  customerId,
  onCustomerChange,
  onReset,
}) => {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await api.get('/customers');
        setCustomers(res.data.data?.items || res.data.data || []);
      } catch {
        // fail silently for customer dropdown
      }
    };
    loadCustomers();
  }, []);

  const paymentOptions = [
    { value: '', label: 'جميع طرق الدفع' },
    { value: 'Cash', label: 'نقدي (Cash)' },
    { value: 'Credit', label: 'آجل (Credit)' },
    { value: 'Mixed', label: 'مجزء (Mixed)' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 mb-6 space-y-4 transition-colors">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث برقم الفاتورة، اسم العميل، أو المنتجات المباعة..."
            className="w-full pr-11 pl-10 py-2.5 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-sm font-medium"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Customer Select */}
        <div className="w-full md:w-56">
          <select
            value={customerId}
            onChange={(e) => onCustomerChange(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm font-medium transition cursor-pointer"
          >
            <option value="">جميع العملاء</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {(search || paymentMethod || customerId) && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition flex-shrink-0"
            title="إعادة ضبط الفلاتر"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>

      {/* Payment Method Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 ml-2">
          <Filter className="w-3.5 h-3.5" />
          طريقة الدفع:
        </span>
        {paymentOptions.map((opt) => {
          const isSelected = paymentMethod === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onPaymentMethodChange(opt.value)}
              className={
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap " +
                (isSelected
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700/70 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700')
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
