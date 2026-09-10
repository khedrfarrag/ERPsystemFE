import React from 'react';
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, PieChart as PieIcon } from 'lucide-react';
import type { ProfitLossReport } from '../types/reports.types';

interface ProfitLossReportTabProps {
  data: ProfitLossReport | null;
  isLoading: boolean;
}

export const ProfitLossReportTab: React.FC<ProfitLossReportTabProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card text-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">جاري إعداد قائمة الأرباح والخسائر...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-16 text-slate-400 text-sm">
        لا توجد بيانات مالية متاحة للفترة المحددة.
      </div>
    );
  }

  const isProfitable = data.netProfit >= 0;

  return (
    <div className="space-y-6">
      {/* KPI Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Sales Revenue */}
        <div className="card border-r-4 border-r-primary-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">صافي إيرادات المبيعات</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {data.netSalesRevenue.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">
              إجمالي المبيعات: {data.grossSales.toLocaleString('ar-EG')} ج.م
            </p>
          </div>
        </div>

        {/* Cost of Goods Sold (COGS) */}
        <div className="card border-r-4 border-r-amber-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">تكلفة البضاعة المباعة (COGS)</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {data.costOfGoodsSold.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">محسوبة بالتكلفة الفعلية للمخزون</p>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="card border-r-4 border-r-emerald-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">مجمل الربح التجاري</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {data.grossProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              هامش مجمل الربح: {data.grossProfitMarginPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Net Operating Profit */}
        <div
          className={`card border-r-4 flex flex-col justify-between ${
            isProfitable ? 'border-r-indigo-600 bg-indigo-50/20' : 'border-r-rose-600 bg-rose-50/20'
          }`}
        >
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">صافي الربح التشغيلي الفعلي</span>
          <div className="mt-3">
            <h3
              className={`text-2xl font-black font-mono ${
                isProfitable ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {data.netProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              صافي الهامش: {data.netProfitMarginPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Structured Income Statement Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-0 overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-black text-sm text-slate-800 dark:text-white flex items-center justify-between">
            <span>قائمة الدخل التفصيلية (Income Statement)</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">أساس الاستحقاق ({data.accountingBasis})</span>
          </div>

          <table className="w-full text-right text-xs">
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Revenue */}
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 font-bold">
                <td className="py-3 px-4 text-slate-800 dark:text-white">إجمالي الإيرادات والمبيعات (Gross Sales)</td>
                <td className="py-3 px-4 text-left font-mono text-slate-900 dark:text-white">
                  +{data.grossSales.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>
              {data.salesReturns > 0 && (
                <tr className="text-rose-600">
                  <td className="py-2.5 px-4 pr-8">(-) مرتجعات المبيعات</td>
                  <td className="py-2.5 px-4 text-left font-mono">
                    -{data.salesReturns.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </td>
                </tr>
              )}
              <tr className="font-bold border-b border-slate-200 dark:border-slate-700">
                <td className="py-3 px-4 text-primary-700 dark:text-primary-400">(=) صافي إيراد المبيعات</td>
                <td className="py-3 px-4 text-left font-mono font-black text-primary-700 dark:text-primary-400">
                  {data.netSalesRevenue.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>

              {/* COGS */}
              <tr className="text-amber-700 dark:text-amber-400 font-semibold">
                <td className="py-3 px-4 pr-8">(-) تكلفة البضاعة المباعة (Cost of Goods Sold)</td>
                <td className="py-3 px-4 text-left font-mono">
                  -{data.costOfGoodsSold.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>

              {/* Gross Profit */}
              <tr className="bg-emerald-50/40 dark:bg-emerald-950/30 font-bold border-y border-emerald-200 dark:border-emerald-800">
                <td className="py-3.5 px-4 text-emerald-800 dark:text-emerald-300">
                  (=) مجمل الربح (Gross Profit) — هامش: {data.grossProfitMarginPercentage.toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-left font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm">
                  {data.grossProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>

              {/* Operating Expenses */}
              <tr className="text-rose-700 dark:text-rose-400 font-semibold">
                <td className="py-3 px-4 pr-8">(-) إجمالي المصروفات التشغيلية (Operating Expenses)</td>
                <td className="py-3 px-4 text-left font-mono">
                  -{data.operatingExpenses.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>

              {/* Net Profit */}
              <tr
                className={`font-black text-sm ${
                  isProfitable
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                }`}
              >
                <td className="py-4 px-4">
                  (=) صافي الربح التشغيلي (Net Operating Profit) — صافي الهامش: {data.netProfitMarginPercentage.toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-left font-mono text-base">
                  {data.netProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Category Breakdown */}
        <div className="card space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-600" />
            توزيع المصروفات التشغيلية
          </h3>

          {data.expenseBreakdown.length === 0 ? (
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium py-8 text-center">لا توجد مصروفات مسجلة في هذه الفترة</p>
          ) : (
            <div className="space-y-3">
              {data.expenseBreakdown.map((exp) => (
                <div key={exp.categoryId} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{exp.categoryName}</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {exp.totalAmount.toLocaleString('ar-EG')} ج.م ({exp.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, exp.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
