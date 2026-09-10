import React, { useState, useMemo } from 'react';
import { ShoppingBag, Plus, Trash2, X, Loader2, CheckCircle2, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreatePurchaseMutation } from '../api/useSuppliersMutations';
import { useProductsCatalogQuery } from '../../pos/api/usePosQueries';
import type { Supplier, PurchaseLineItemRequest } from '../types/suppliers.types';

interface CreatePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

interface PurchaseItemRow extends PurchaseLineItemRequest {
  productName: string;
}

export const CreatePurchaseModal: React.FC<CreatePurchaseModalProps> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseItemRow[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const { data: products = [] } = useProductsCatalogQuery();
  const createPurchaseMutation = useCreatePurchaseMutation();

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    if (items.some((item) => item.productId === prod.id)) {
      toast.error('الصنف مضاف بالفعل في الفاتورة');
      return;
    }

    setItems([
      ...items,
      {
        productId: prod.id,
        productName: prod.name,
        quantity: 1,
        unitCost: prod.sellingPrice * 0.75, // Reasonable default cost estimation
        discount: 0,
      },
    ]);
    setSelectedProductId('');
  };

  const handleUpdateItem = (index: number, field: keyof PurchaseItemRow, value: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let discounts = 0;
    for (let i = 0; i < items.length; i++) {
      subtotal += items[i].quantity * items[i].unitCost;
      discounts += items[i].discount || 0;
    }
    return {
      subtotal,
      discounts,
      total: Math.max(0, subtotal - discounts),
    };
  }, [items]);

  if (!isOpen || !supplier) return null;

  const handleSubmit = async (autoConfirm: boolean) => {
    if (items.length === 0) {
      toast.error('يرجى إضافة صنف واحد على الأقل لفاتورة الشراء');
      return;
    }

    await createPurchaseMutation.mutateAsync({
      payload: {
        supplierId: supplier.id,
        invoiceNumber: invoiceNumber.trim() || null,
        purchaseDate: new Date(purchaseDate).toISOString(),
        notes: notes.trim() || null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
          unitCost: Number(i.unitCost),
          discount: Number(i.discount || 0),
        })),
      },
      autoConfirm,
    });
    setItems([]);
    setInvoiceNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                فاتورة توريد وشراء جديدة
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                المورد: <b className="text-slate-800 dark:text-white">{supplier.name}</b>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Invoice Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رقم فاتورة المورد (اختياري)
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="مثال: INV-SUP-9021"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تاريخ الفاتورة
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Product Picker */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">اختر صنفاً لإضافته للفاتورة...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (سعر البيع: {p.sellingPrice} ج.م)
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddItem}
              disabled={!selectedProductId}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-40 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <tr>
                  <th className="py-2.5 px-3">الصنف</th>
                  <th className="py-2.5 px-2 text-center">الكمية</th>
                  <th className="py-2.5 px-2 text-center">سعر التكلفة (ج.م)</th>
                  <th className="py-2.5 px-2 text-center">الخصم</th>
                  <th className="py-2.5 px-3 text-left">الإجمالي</th>
                  <th className="py-2.5 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-600 dark:text-slate-300 text-xs font-bold">
                      لم يتم إضافة أصناف بعد
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const rowTotal = Math.max(0, item.quantity * item.unitCost - (item.discount || 0));

                    return (
                      <tr key={item.productId} className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors">
                        <td className="py-2 px-3 font-semibold">{item.productName}</td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={item.unitCost}
                            onChange={(e) => handleUpdateItem(idx, 'unitCost', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-20 text-center py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={item.discount}
                            onChange={(e) => handleUpdateItem(idx, 'discount', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-16 text-center py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                          />
                        </td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-emerald-600">
                          {rowTotal.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-inner">
            <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">إجمالي الفاتورة المطلوب:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {totals.total.toFixed(2)} <span className="text-xs font-bold text-slate-600 dark:text-slate-300">ج.م</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={createPurchaseMutation.isPending || items.length === 0}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-xl disabled:opacity-40"
          >
            حفظ كمسودة
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={createPurchaseMutation.isPending || items.length === 0}
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
          >
            {createPurchaseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>تأكيد واستلام البضاعة للمخزن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
