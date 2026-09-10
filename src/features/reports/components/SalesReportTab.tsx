import React from 'react';
import { ShoppingBag, CreditCard, Award, ArrowUpRight, Tag } from 'lucide-react';
import type { SalesSummaryReport } from '../types/reports.types';

interface SalesReportTabProps {
  data: SalesSummaryReport | null;
  isLoading: boolean;
}

export const SalesReportTab: React.FC<SalesReportTabProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card text-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">جاري إعداد ملخص المبيعات...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-16 text-slate-400 text-sm">
        لا توجد بيانات مبيعات متاحة للفترة المحددة.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-r-4 border-r-primary-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إجمالي المبيعات الإجمالية</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {data.grossSales.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">الخصومات الممنوحة: {data.totalDiscounts.toLocaleString('ar-EG')} ج.م</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-emerald-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">صافي المبيعات المحققة</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {data.netSales.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">بعد استبعاد الخصم والمرتجعات</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-indigo-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">عدد الفواتير المنفذة</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {data.totalOrders} فاتورة
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">طلبات البيع عبر الـ POS</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-amber-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">متوسط قيمة الفاتورة (AOV)</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {data.averageOrderValue.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">معدل إنفاق العميل للعملية</p>
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="card space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary-600" />
            توزيع المبيعات حسب طريقة الدفع
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.paymentBreakdown.map((pm) => (
              <div key={pm.paymentMethod} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {pm.paymentMethod === 'Cash'
                      ? 'نقدي (كاش)'
                      : pm.paymentMethod === 'Card'
                      ? 'بطاقة دفع إلكتروني / فيزا'
                      : pm.paymentMethod === 'Credit'
                      ? 'آجل (حساب عميل)'
                      : pm.paymentMethod}
                  </h4>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
                    {pm.transactionCount} معاملة • {pm.percentage.toFixed(1)}% من الإجمالي
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {pm.totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="card space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            المنتجات الأكثر مبيعاً وتحقيقاً للأرباح
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.topProducts.map((p) => (
              <div key={p.productId} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{p.productName}</h4>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
                    {p.categoryName} • الكمية: {p.quantitySold} قطعة
                  </span>
                </div>
                <div className="text-left">
                  <span className="font-mono font-black text-xs text-slate-900 dark:text-white block">
                    {p.totalRevenue.toLocaleString('ar-EG')} ج.م
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-bold">
                    ربح: {p.totalProfit.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
