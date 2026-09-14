import React from 'react';
import { Truck, Wallet, Users, Plus, ShoppingBag, Sparkles } from 'lucide-react';

interface SuppliersHeaderProps {
  totalCount: number;
  totalPayables: number;
  creditorsCount: number;
  onOpenAddModal: () => void;
  onOpenAiScannerModal?: () => void;
  canManage: boolean;
}

export const SuppliersHeader: React.FC<SuppliersHeaderProps> = ({
  totalCount,
  totalPayables,
  creditorsCount,
  onOpenAddModal,
  onOpenAiScannerModal,
  canManage,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            إدارة الموردين وفواتير الشراء
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            متابعة الشركات الموردة، فواتير التوريد، سداد المستحقات، وكشوفات الحساب
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            {onOpenAiScannerModal && (
              <button
                type="button"
                onClick={onOpenAiScannerModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>مسح فاتورة ذكي</span>
              </button>
            )}

            <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all transform active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مورد جديد</span>
          </button>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Suppliers */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Truck className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">إجمالي الشركات الموردة</span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Total Payables */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <Wallet className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">إجمالي المستحقات للموردين</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {totalPayables.toFixed(2)} <span className="text-xs font-bold">ج.م</span>
            </span>
          </div>
        </div>

        {/* Creditors Count */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Users className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">موردون لهم مستحقات</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {creditorsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
