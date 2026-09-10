import React from 'react';
import {
  Eye,
  Printer,
  Calendar,
  CreditCard,
  Banknote,
  Layers,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
} from 'lucide-react';
import { Sale } from '../types/sales.types';

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectSale: (sale: Sale) => void;
  onReprintSale: (sale: Sale) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  isLoading,
  totalCount,
  pageNumber,
  pageSize,
  onPageChange,
  onSelectSale,
  onReprintSale,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const renderPaymentBadge = (method: string) => {
    switch (method) {
      case 'Cash':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <Banknote className="w-3.5 h-3.5" />
            نقدي
          </span>
        );
      case 'Credit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
            <CreditCard className="w-3.5 h-3.5" />
            آجل
          </span>
        );
      case 'Mixed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300">
            <Layers className="w-3.5 h-3.5" />
            مجزء
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {method}
          </span>
        );
    }
  };

  const getInvoiceReturnStatus = (sale: Sale) => {
    if (!sale.returns || sale.returns.length === 0) {
      return {
        label: 'مكتملة',
        badgeClass:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
      };
    }

    const totalPurchasedQty = sale.items.reduce((acc, i) => acc + i.quantity, 0);
    const totalReturnedQty = sale.returns.reduce(
      (acc, r) => acc + r.items.reduce((sum, ri) => sum + ri.quantity, 0),
      0
    );

    if (totalReturnedQty >= totalPurchasedQty && totalPurchasedQty > 0) {
      return {
        label: 'مرتجع كلي',
        badgeClass:
          'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700',
      };
    }

    return {
      label: 'مرتجع جزئي',
      badgeClass:
        'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
    };
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 p-8 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          جاري تحميل سجل الفواتير...
        </p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          لا توجد فواتير مطابقة
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          لم يتم العثور على أي فواتير بيع وفق معايير البحث المحددة. جرب تعديل الفلاتر أو إجراء عملية بيع جديدة.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="table-header border-b border-slate-200 dark:border-slate-700 font-bold">
              <th className="py-3.5 px-4">رقم الفاتورة والتاريخ</th>
              <th className="py-3.5 px-4">العميل</th>
              <th className="py-3.5 px-4 text-center">طريقة الدفع</th>
              <th className="py-3.5 px-4 text-center">عدد الأصناف</th>
              <th className="py-3.5 px-4 text-left">إجمالي الفاتورة</th>
              <th className="py-3.5 px-4 text-center">الحالة</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
            {sales.map((sale) => {
              const statusInfo = getInvoiceReturnStatus(sale);
              return (
                <tr
                  key={sale.id}
                  className="table-row-hover transition-colors cursor-pointer group"
                  onClick={() => onSelectSale(sale)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {sale.invoiceNumber}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                      <Calendar className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      {formatDate(sale.saleDate)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {sale.customerName ? (
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {sale.customerName}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        عميل نقدي عام
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {renderPaymentBadge(sale.paymentMethod)}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                      {sale.items.length} أصناف
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-left">
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {sale.totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ج.م
                    </div>
                    {sale.creditAmount > 0 && (
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                        آجل:{' '}
                        {sale.creditAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        ج.م
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div
                      className="flex items-center justify-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onSelectSale(sale)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition"
                        title="عرض تفاصيل الفاتورة"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onReprintSale(sale)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition"
                        title="إعادة طباعة الإيصال الحراري"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div>
          عرض <span className="font-bold text-slate-800 dark:text-white">{sales.length}</span> من أصل{' '}
          <span className="font-bold text-slate-800 dark:text-white">{totalCount}</span> فاتورة
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-700 dark:text-slate-200">
            صفحة {pageNumber} من {totalPages}
          </span>
          <button
            onClick={() => onPageChange(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
