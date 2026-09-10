import React from 'react';
import {
  Wallet,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  Unlock,
  Lock,
  History,
  AlertCircle,
} from 'lucide-react';
import type { CashRegisterSummary } from '../types/expenses.types';

interface ExpensesHeaderProps {
  totalPeriodExpenses: number;
  registerSummary: CashRegisterSummary | null;
  onOpenRecordExpense: () => void;
  onOpenAddCategory: () => void;
  onOpenFloatModal: () => void;
  onOpenCloseRegisterModal: () => void;
  onOpenHistoryModal: () => void;
  canManage: boolean;
}

export const ExpensesHeader: React.FC<ExpensesHeaderProps> = ({
  totalPeriodExpenses,
  registerSummary,
  onOpenRecordExpense,
  onOpenAddCategory,
  onOpenFloatModal,
  onOpenCloseRegisterModal,
  onOpenHistoryModal,
  canManage,
}) => {
  const currentBalance = registerSummary?.currentBalance ?? 0;
  const todayInflows = registerSummary?.todayInflows ?? 0;
  const todayOutflows = registerSummary?.todayOutflows ?? 0;
  const hasFloat = !!registerSummary?.lastFloatDate;

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-7 h-7 text-rose-600" />
              المصروفات اليومية ودرج الكاشير
            </h1>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
                hasFloat
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${hasFloat ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {hasFloat ? 'الوردية نشطة ومفتوحة' : 'لم تُسجل عهدة اليوم'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
            تسجيل ومتابعة المصروفات التشغيلية، ومراقبة رصيد الدرج الفعلي، وتسوية العجز والزيادة عند تقفيل الوردية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {canManage && (
            <>
              <button
                type="button"
                onClick={onOpenFloatModal}
                className="btn bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>فتح وردية / عهدة</span>
              </button>

              <button
                type="button"
                onClick={onOpenCloseRegisterModal}
                className="btn bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-sm"
              >
                <Lock className="w-4 h-4" />
                <span>تقفيل الوردية وجرد الدرج</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="btn btn-secondary flex items-center gap-1.5 text-xs font-bold"
          >
            <History className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>سجل حركات الدرج</span>
          </button>

          <button
            type="button"
            onClick={onOpenRecordExpense}
            className="btn btn-primary flex items-center gap-1.5 text-xs font-bold shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل مصروف جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Live Drawer Balance */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-r-4 border-r-emerald-500 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">رصيد درج الكاشير الفعلي</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {currentBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">المبلغ المفترض تواجده حالياً بالدرج</p>
          </div>
        </div>

        {/* Today Inflows */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-r-4 border-r-primary-500 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">المقبوضات النقدية اليوم</span>
            <div className="p-2 bg-primary-50 dark:bg-primary-950/50 text-primary-600 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {todayInflows.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">مبيعات نقدية + تحصيل ديون عملاء</p>
          </div>
        </div>

        {/* Today Outflows */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-r-4 border-r-rose-500 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">المدفوعات النقدية اليوم</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {todayOutflows.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">مصروفات نقدية + سداد فواتير موردين</p>
          </div>
        </div>

        {/* Total Period Expenses */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-r-4 border-r-indigo-500 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إجمالي مصروفات الفترة المحددة</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {totalPeriodExpenses.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">جميع طرق الدفع (نقدي / تحويل / شيك)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
