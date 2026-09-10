import React, { useState } from 'react';
import { Search, User, UserCheck, X, Phone, AlertCircle, ShieldAlert, Plus } from 'lucide-react';
import { useCustomersQuery } from '../api/usePosQueries';
import type { CustomerCreditInfo } from '../types/pos.types';

interface CustomerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer: CustomerCreditInfo | null;
  onSelectCustomer: (customer: CustomerCreditInfo | null) => void;
}

export const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({
  isOpen,
  onClose,
  selectedCustomer,
  onSelectCustomer,
}) => {
  const [search, setSearch] = useState('');
  const { data: customers = [], isLoading } = useCustomersQuery(search);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                اختيار عميل الفاتورة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ابحث عن العميل بالاسم أو رقم الهاتف لعرض رصيده وسقف الائتمان
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Reset to Walk-in */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute inset-y-0 right-3 my-auto text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectCustomer(null);
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
              selectedCustomer === null
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>عميل نقدي عام (بدون تسجيل حساب)</span>
            </div>
            {selectedCustomer === null && <span className="text-[11px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">محدد</span>}
          </button>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              جاري جلب قائمة العملاء...
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              لم يتم العثور على عملاء مطابقين للبحث
            </div>
          ) : (
            customers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              const isNearLimit = (c.currentBalance || 0) >= (c.creditLimit || 0) * 0.85;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCustomer(c);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/60 dark:hover:bg-slate-750/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {c.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                          محدد
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span className="font-mono">{c.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial Status */}
                  <div className="text-left space-y-0.5">
                    <div className="text-xs">
                      <span className="text-slate-400 ml-1">الرصيد/المديونية:</span>
                      <span className={`font-mono font-bold ${(c.currentBalance || 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {(c.currentBalance || 0).toFixed(2)} ج.م
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <span>سقف الائتمان: </span>
                      <span className="font-mono font-semibold">{(c.creditLimit || 0).toFixed(2)} ج.م</span>
                    </div>

                    {isNearLimit && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        <ShieldAlert className="w-3 h-3" />
                        قريب من الحد الأقصى
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
