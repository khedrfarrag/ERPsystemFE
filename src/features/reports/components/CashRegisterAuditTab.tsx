import React from 'react';
import { Wallet, AlertTriangle, CheckCircle2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { CashRegisterAuditReport } from '../types/reports.types';

interface CashRegisterAuditTabProps {
  data: CashRegisterAuditReport | null;
  isLoading: boolean;
}

export const CashRegisterAuditTab: React.FC<CashRegisterAuditTabProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card text-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">جاري تدقيق حركات الدرج والورديات...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-16 text-slate-400 text-sm">
        لا توجد بيانات تدقيق للدرج في الفترة المحددة.
      </div>
    );
  }

  const summaries = data.dailySummaries || [];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-r-4 border-r-primary-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">المقبوضات النقدية الإجمالية</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {(data.totalCashSalesInflows + data.totalCustomerPaymentInflows).toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
              })}{' '}
              ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">مبيعات نقدية + تحصيل ديون</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-rose-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">المدفوعات النقدية الإجمالية</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {(data.totalExpenseOutflows + data.totalSupplierPaymentOutflows).toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
              })}{' '}
              ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">مصروفات + سداد موردين</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-emerald-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">صافي التدفق النقدي للدرج</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {data.netCashChange.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">المقبوضات ناقص المدفوعات</p>
          </div>
        </div>

        <div
          className={`card border-r-4 flex flex-col justify-between ${
            data.totalDiscrepancies === 0
              ? 'border-r-emerald-500'
              : data.totalDiscrepancies < 0
              ? 'border-r-rose-500'
              : 'border-r-amber-500'
          }`}
        >
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إجمالي الفروقات والعجز (Discrepancy)</span>
          <div className="mt-3">
            <h3
              className={`text-2xl font-black font-mono ${
                data.totalDiscrepancies === 0
                  ? 'text-emerald-600'
                  : data.totalDiscrepancies < 0
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}
            >
              {data.totalDiscrepancies.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">
              {data.totalDiscrepancies === 0
                ? 'النقدية مطابقة 100%'
                : data.totalDiscrepancies < 0
                ? 'عجز تراكمي بالدرج'
                : 'زيادة نقدية بالدرج'}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Shifts Ledger */}
      <div className="card p-0 overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-white">
          سجل تسويات الورديات اليومية
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-extrabold">
              <tr>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4">عهدة البداية</th>
                <th className="py-3 px-4">المقبوضات (+)</th>
                <th className="py-3 px-4">المدفوعات (-)</th>
                <th className="py-3 px-4">الرصيد الدفتري المتوقع</th>
                <th className="py-3 px-4">المبلغ الفعلي المعدود</th>
                <th className="py-3 px-4">الفارق (عجز / زيادة)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {summaries.map((s, idx) => {
                const disc = s.discrepancy ?? 0;
                return (
                  <tr key={idx} className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {new Date(s.date).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-200 font-semibold">
                      {s.openingFloat.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                      +{s.inflows.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      -{s.outflows.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {s.expectedClosing.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-300">
                      {s.actualCounted !== null && s.actualCounted !== undefined
                        ? `${s.actualCounted.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`
                        : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {s.discrepancy !== null && s.discrepancy !== undefined ? (
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            disc === 0
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50'
                              : disc < 0
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50'
                          }`}
                        >
                          {disc === 0 ? 'مطابق (0)' : disc < 0 ? `عجز ${disc} ج.م` : `زيادة +${disc} ج.م`}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
