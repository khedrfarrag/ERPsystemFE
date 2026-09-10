import React from 'react';
import { Boxes, DollarSign, TrendingUp, Search, Eye } from 'lucide-react';
import type { InventoryValuationReport, ProductValuationItem } from '../types/reports.types';

interface InventoryValuationReportTabProps {
  data: InventoryValuationReport | null;
  isLoading: boolean;
  onSelectProduct: (productId: string, productName: string) => void;
}

export const InventoryValuationReportTab: React.FC<InventoryValuationReportTabProps> = ({
  data,
  isLoading,
  onSelectProduct,
}) => {
  const [search, setSearch] = React.useState('');

  if (isLoading) {
    return (
      <div className="card text-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">جاري تقييم المخزون...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card text-center py-16 text-slate-400 text-sm">
        لا توجد بيانات متاحة لتقييم المخزون.
      </div>
    );
  }

  const items = data.items || [];
  const filtered = items.filter(
    (p) =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search)) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const totalRetailPotential = items.reduce((acc, curr) => acc + curr.potentialRevenue, 0);
  const potentialGrossProfit = totalRetailPotential - data.totalValuation;

  return (
    <div className="space-y-6">
      {/* Top Valuation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-r-4 border-r-indigo-600 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إجمالي قيمة المخزون بالتكلفة (WAC)</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {data.totalValuation.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">رأس المال الفعلي المجمد في البضاعة</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-emerald-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">القيمة البيعية المتوقعة</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {totalRetailPotential.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">عند بيع المخزون بالأسعار الحالية</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-primary-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إجمالي الأصناف والقطع</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {data.totalUnitsCount.toLocaleString('ar-EG')} قطعة
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">{data.totalProductsCount} صنف معرف بالكتالوج</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-amber-500 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">الربح التجاري الكامن في المخزن</span>
          <div className="mt-3">
            <h3 className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {potentialGrossProfit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">الفرق بين سعر البيع والتكلفة</p>
          </div>
        </div>
      </div>

      {/* Product Valuation Table */}
      <div className="card p-0 overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-xs text-slate-800 dark:text-white">
            تفاصيل تقييم الأصناف ({filtered.length} صنف)
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute inset-y-0 right-3 my-auto pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم أو الباركود..."
              className="w-full pr-8 pl-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-extrabold">
              <tr>
                <th className="py-3 px-4">اسم الصنف والتصنيف</th>
                <th className="py-3 px-4">رصيد المخزن</th>
                <th className="py-3 px-4">متوسط التكلفة (WAC)</th>
                <th className="py-3 px-4">إجمالي قيمة التكلفة</th>
                <th className="py-3 px-4">سعر البيع</th>
                <th className="py-3 px-4">القيمة البيعية المتوقعة</th>
                <th className="py-3 px-4 text-center print:hidden">حركة الصنف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{item.productName}</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">{item.categoryName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.currentStock}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-200 font-semibold">
                    {item.unitCostWac.toFixed(2)} ج.م
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {item.totalValue.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-200 font-semibold">
                    {item.sellingPrice.toFixed(2)} ج.م
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.potentialRevenue.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </td>
                  <td className="py-3 px-4 text-center print:hidden">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(item.productId, item.productName)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>كشف حركة</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
