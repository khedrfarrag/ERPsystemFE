import React from 'react';
import { Printer, CheckCircle2, X, Share2, Store, Calendar, Clock, User } from 'lucide-react';
import type { SaleResponseData } from '../types/pos.types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleResponseData | null;
  storeName?: string;
  cashierName?: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  sale,
  storeName = 'مؤسسة ريتيل أو إس التجارية',
  cashierName = 'الكاشير الرئيسي',
}) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const saleDateObj = new Date(sale.saleDate || sale.createdAt);
  const formattedDate = saleDateObj.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = saleDateObj.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Header Actions */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
              معاينة الفاتورة الحرارية (80 مم)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-100 dark:bg-slate-900/80 flex justify-center">
          <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #thermal-receipt,
          #thermal-receipt * {
            visibility: visible !important;
          }
          #thermal-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            padding: 2mm !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: monospace !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
          <div
            id="thermal-receipt"
            className="w-[300px] bg-white text-black p-4 font-mono text-xs leading-relaxed shadow-md border border-slate-200 print:shadow-none print:border-none print:w-full print:p-0"
          >
            {/* Store Branding */}
            <div className="text-center pb-3 border-b border-dashed border-black">
              <div className="font-sans text-base font-black tracking-tight mb-0.5">
                {storeName}
              </div>
              <div className="text-[10px] text-black font-medium">نظام إدارة التجزئة والمبيعات RetailOS</div>
              <div className="text-[10px] text-black font-medium mt-1">الرقم الضريبي: 300987654300003</div>
            </div>

            {/* Invoice Meta */}
            <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-black">
              <div className="flex justify-between">
                <span>رقم الفاتورة:</span>
                <span className="font-bold">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>التاريخ والوقت:</span>
                <span>{formattedDate} {formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>الكاشير:</span>
                <span>{cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>العميل:</span>
                <span className="font-bold">{sale.customerName || 'عميل نقدي'}</span>
              </div>
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="font-bold">
                  {sale.paymentMethod === 'Cash'
                    ? 'نقدي (Cash)'
                    : sale.paymentMethod === 'Credit'
                    ? 'آجل (Credit)'
                    : 'مختلط (Mixed)'}
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-2.5 border-b border-dashed border-black">
              <table className="w-full text-right text-[11px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="py-1 font-bold">الصنف</th>
                    <th className="py-1 text-center font-bold">الكمية</th>
                    <th className="py-1 text-center font-bold">السعر</th>
                    <th className="py-1 text-left font-bold">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted divide-gray-300">
                  {sale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 font-sans font-medium">{item.productName}</td>
                      <td className="py-1.5 text-center font-bold">{item.quantity}</td>
                      <td className="py-1.5 text-center">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-1.5 text-left font-bold">{item.subTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-black font-semibold">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{sale.subTotal.toFixed(2)} ج.م</span>
              </div>

              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-black">
                  <span>الخصم:</span>
                  <span>-{sale.discountAmount.toFixed(2)} ج.م</span>
                </div>
              )}

              {sale.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (14%):</span>
                  <span>{sale.taxAmount.toFixed(2)} ج.م</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
                <span>المبلغ الصافي:</span>
                <span>{sale.totalAmount.toFixed(2)} ج.م</span>
              </div>

              {sale.paymentMethod !== 'Credit' && (
                <div className="flex justify-between text-[11px] pt-1">
                  <span>المبلغ المدفوع نقداً:</span>
                  <span>{sale.cashAmount.toFixed(2)} ج.م</span>
                </div>
              )}

              {sale.cashAmount > sale.totalAmount && (
                <div className="flex justify-between text-[11px] font-bold">
                  <span>المتبقي للعميل (الباقي):</span>
                  <span>{(sale.cashAmount - sale.totalAmount).toFixed(2)} ج.م</span>
                </div>
              )}

              {sale.creditAmount > 0 && (
                <div className="flex justify-between text-[11px] font-bold">
                  <span>المبلغ الآجل على الحساب:</span>
                  <span>{sale.creditAmount.toFixed(2)} ج.م</span>
                </div>
              )}
            </div>

            {/* Notes if present */}
            {sale.notes && (
              <div className="py-2 text-[10px] text-black font-medium border-b border-dashed border-black">
                <span className="font-bold">ملاحظات: </span>
                <span>{sale.notes}</span>
              </div>
            )}

            {/* Barcode & Footer Policy */}
            <div className="text-center pt-3 space-y-1">
              <div className="font-mono text-xs tracking-widest font-bold">
                * {sale.invoiceNumber} *
              </div>
              <div className="text-[10px] text-black font-medium leading-tight">
                شكراً لزيارتكم! البضاعة المباعة ترد وتستبدل خلال 14 يوماً بموجب الفاتورة
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2 pb-safe">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors min-h-[44px] cursor-pointer"
          >
            إغلاق
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-xl shadow-md transition-all min-h-[44px] cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الإيصال (Ctrl+P)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
