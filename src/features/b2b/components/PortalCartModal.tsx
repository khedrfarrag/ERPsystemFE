import React, { useState } from 'react';
import { B2BCatalogProduct, B2BPaymentPreference } from '../types/b2b.types';
import { useCreateB2BOrder } from '../hooks/useB2BOrders';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Send,
  FileText,
  AlertCircle
} from 'lucide-react';

export interface CartItem {
  product: B2BCatalogProduct;
  quantity: number;
}

interface PortalCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (orderNumber: string) => void;
}

export const PortalCartModal: React.FC<PortalCartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}) => {
  const [paymentPreference, setPaymentPreference] = useState<B2BPaymentPreference>('Credit');
  const [notes, setNotes] = useState('');
  const [expectedDownPayment, setExpectedDownPayment] = useState<string>('');

  const createOrderMutation = useCreateB2BOrder();

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.product.effectiveWholesalePrice,
    0
  );

  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;

    try {
      const payload = {
        paymentPreference,
        notes: notes.trim() || undefined,
        items: cart.map((c) => ({
          productId: c.product.id,
          quantity: c.quantity,
        })),
      };

      const res = await createOrderMutation.mutateAsync(payload);
      onClearCart();
      onClose();
      onOrderSuccess(res.orderNumber);
    } catch (err) {
      // Toast error handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">سلة طلب التوريد</h2>
              <p className="text-xs text-slate-400">
                مراجعة الكميات وتحديد شروط الدفع قبل إرسال الطلب
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">سلة الطلبات فارغة</p>
              <p className="text-xs text-slate-500 mt-1">تصفح الكتالوج وأضف المنتجات المطلوبة للبدء.</p>
            </div>
          ) : (
            cart.map(({ product, quantity }) => {
              const itemTotal = quantity * product.effectiveWholesalePrice;
              const isOverStock = product.availableStock > 0 && quantity > product.availableStock;

              return (
                <div
                  key={product.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">{product.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>سعر الجملة: <strong className="text-emerald-400 font-mono">{product.effectiveWholesalePrice} ج.م</strong></span>
                      {product.unitName && <span>({product.unitName})</span>}
                    </div>
                    {isOverStock && (
                      <div className="flex items-center gap-1 text-amber-400 text-[11px] mt-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>الكمية المطلوبة تتجاوز المخزون الحالي ({product.availableStock}). ستتم مراجعتها من قِبل الإدارة.</span>
                      </div>
                    )}
                  </div>

                  {/* Stepper & Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.availableStock}
                        value={quantity}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          onUpdateQuantity(product.id, Math.min(product.availableStock, val));
                        }}
                        className="w-12 text-center bg-transparent text-sm font-mono font-bold text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={quantity >= product.availableStock}
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-left w-24">
                      <div className="font-mono font-bold text-white text-sm">
                        {itemTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-500">ج.م</span>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex-shrink-0 space-y-4">
            {/* Preferences & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  طريقة الدفع المفضلة
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentPreference('Credit')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentPreference === 'Credit'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>على الحساب (آجل)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPreference('Cash')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentPreference === 'Cash'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>كاش عند الاستلام</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPreference('Partial')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentPreference === 'Partial'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>دفعة مقدمة + آجل</span>
                  </button>
                </div>

                {paymentPreference === 'Partial' && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                    <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                      قيمة الدفعة المقدمة المقترحة (ج.م) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalAmount - 1}
                      placeholder="أدخل مبلغ الدفعة النقدية..."
                      value={expectedDownPayment}
                      onChange={(e) => setExpectedDownPayment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    {parseFloat(expectedDownPayment) > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        المتبقي الآجل على الحساب:{' '}
                        <span className="font-mono font-bold text-white">
                          {Math.max(0, totalAmount - parseFloat(expectedDownPayment)).toLocaleString('ar-EG')}{' '}
                          ج.م
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ملاحظات وتعليمات التوصيل (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: يرجى التوصيل قبل الساعة 2 ظهراً..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>
            </div>

            {/* Total Bar & Submit Button */}
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="text-xs text-slate-400">
                  إجمالي الأصناف: <span className="font-bold text-white">{totalUnits} قطعة</span>
                </div>
                <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                  {totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} <span className="text-xs font-normal">ج.م</span>
                </div>
              </div>

              <button
                type="button"
                disabled={createOrderMutation.isPending}
                onClick={handleSubmitOrder}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{createOrderMutation.isPending ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
