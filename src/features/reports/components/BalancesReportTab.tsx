import React from 'react';
import { Users, Phone, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  useCustomerBalancesReportQuery,
  useSupplierBalancesReportQuery,
} from '../api/useReportsQueries';

export const BalancesReportTab: React.FC = () => {
  const { data: customerData, isLoading: isCustLoading } = useCustomerBalancesReportQuery();
  const { data: supplierData, isLoading: isSuppLoading } = useSupplierBalancesReportQuery();

  const totalReceivables = customerData?.totalReceivables || 0;
  const debtors = customerData?.debtors || [];

  const totalPayables = supplierData?.totalPayables || 0;
  const creditors = supplierData?.creditors || [];

  return (
    <div className="space-y-6">
      {/* Top Balances Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card border-r-4 border-r-rose-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            إجمالي مديونيات العملاء لنا (Receivables)
          </span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {totalReceivables.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">{debtors.length} عميل عليهم مبالغ مستحقة</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-amber-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            إجمالي مستحقات الموردين والشركات (Payables)
          </span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {totalPayables.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">{creditors.length} مورد بانتظار سداد فواتيرهم</p>
          </div>
        </div>
      </div>

      {/* Two Columns: Debtors & Creditors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Debtors */}
        <div className="card p-0 overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-white flex items-center justify-between">
            <span>ديون العملاء (مطلوب تحصيلها)</span>
            <span className="text-[10px] text-rose-600 font-bold">{debtors.length} مدين</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {debtors.length === 0 ? (
              <p className="p-8 text-center text-slate-600 dark:text-slate-300 font-semibold text-xs">ممتاز! لا توجد ديون مستحقة على العملاء</p>
            ) : (
              debtors.map((c) => (
                <div key={c.customerId} className="p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{c.customerName}</h4>
                    {c.phone && (
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-semibold block">{c.phone}</span>
                    )}
                  </div>
                  <span className="font-mono font-black text-xs text-rose-600 dark:text-rose-400">
                    {c.currentBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Supplier Creditors */}
        <div className="card p-0 overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-white flex items-center justify-between">
            <span>مستحقات الموردين (واجبة السداد)</span>
            <span className="text-[10px] text-amber-600 font-bold">{creditors.length} مورد</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {creditors.length === 0 ? (
              <p className="p-8 text-center text-slate-600 dark:text-slate-300 font-semibold text-xs">ممتاز! تم سداد جميع التزامات الموردين بالكامل</p>
            ) : (
              creditors.map((s) => (
                <div key={s.supplierId} className="p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{s.supplierName}</h4>
                    {s.phone && (
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-semibold block">{s.phone}</span>
                    )}
                  </div>
                  <span className="font-mono font-black text-xs text-amber-600 dark:text-amber-400">
                    {s.currentBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
