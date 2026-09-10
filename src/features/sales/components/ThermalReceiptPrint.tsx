import React from 'react';
import { Sale } from '../types/sales.types';
import { useAuth } from '../../../context/AuthContext';

interface ThermalReceiptPrintProps {
  sale: Sale | null;
}

export const ThermalReceiptPrint: React.FC<ThermalReceiptPrintProps> = ({ sale }) => {
  const { user } = useAuth();
  if (!sale) return null;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="thermal-receipt-print-container" className="hidden print:block text-black bg-white p-2 text-xs font-mono select-none" dir="rtl">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #thermal-receipt-print-container,
          #thermal-receipt-print-container * {
            visibility: visible !important;
          }
          #thermal-receipt-print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 80mm !important;
            padding: 2mm !important;
            margin: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-family: monospace !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>

      <div className="text-center pb-2 border-b border-dashed border-black">
        <h2 className="font-extrabold text-base tracking-wide">{user?.storeName || 'متجر RetailOS'}</h2>
        <p className="text-[10px] text-gray-700">فاتورة ضريبية مبسطة</p>
        <p className="text-[10px] text-gray-700">الرقم الضريبي: 300987654300003</p>
      </div>

      <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>رقم الفاتورة:</span>
          <span className="font-bold">{sale.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ:</span>
          <span>{formatDate(sale.saleDate)}</span>
        </div>
        <div className="flex justify-between">
          <span>العميل:</span>
          <span>{sale.customerName || 'عميل نقدي'}</span>
        </div>
        <div className="flex justify-between">
          <span>طريقة الدفع:</span>
          <span>{sale.paymentMethod === 'Cash' ? 'نقدي' : sale.paymentMethod === 'Credit' ? 'آجل' : 'مجزء'}</span>
        </div>
      </div>

      <div className="py-2 border-b border-dashed border-black">
        <table className="w-full text-right text-[11px]">
          <thead>
            <tr className="border-b border-black">
              <th className="pb-1 text-right">الصنف</th>
              <th className="pb-1 text-center">الكمية</th>
              <th className="pb-1 text-left">السعر</th>
              <th className="pb-1 text-left">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dotted divide-gray-400">
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td className="py-1 max-w-[32mm] truncate">{item.productName}</td>
                <td className="py-1 text-center">{item.quantity}</td>
                <td className="py-1 text-left">{item.unitPrice.toFixed(2)}</td>
                <td className="py-1 text-left font-bold">{item.subTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>المجموع الفرعي:</span>
          <span>{sale.subTotal.toFixed(2)} ج.م</span>
        </div>
        {sale.discountAmount > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>الخصم:</span>
            <span>-{sale.discountAmount.toFixed(2)} ج.م</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>ضريبة القيمة المضافة (14%):</span>
          <span>{sale.taxAmount.toFixed(2)} ج.م</span>
        </div>
        <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
          <span>الإجمالي النهائي:</span>
          <span>{sale.totalAmount.toFixed(2)} ج.م</span>
        </div>
        <div className="flex justify-between pt-1">
          <span>المدفوع نقداً:</span>
          <span>{sale.cashAmount.toFixed(2)} ج.م</span>
        </div>
        {sale.creditAmount > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>المتبقي آجل:</span>
            <span>{sale.creditAmount.toFixed(2)} ج.م</span>
          </div>
        )}
      </div>

      <div className="text-center pt-3 space-y-1 text-[10px]">
        <p className="font-bold">شكراً لزيارتكم ونتمنى رؤيتكم مجدداً</p>
        <p className="text-gray-600">البضاعة المباعة ترد وتستبدل خلال 14 يوماً بالفاتورة</p>
        <p className="tracking-widest text-[9px]">RetailOS POS System</p>
      </div>
    </div>
  );
};
