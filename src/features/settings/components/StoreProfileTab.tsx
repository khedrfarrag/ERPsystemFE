import React, { useState, useEffect } from 'react';
import {
  Store,
  Phone,
  MapPin,
  Percent,
  Layers,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
} from 'lucide-react';
import { StoreProfile, UpdateStoreRequest } from '../types/settings.types';
import { useAuth } from '../../../context/AuthContext';

interface StoreProfileTabProps {
  store: StoreProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  onUpdateStore: (data: UpdateStoreRequest) => Promise<any>;
}

export const StoreProfileTab: React.FC<StoreProfileTabProps> = ({
  store,
  isLoading,
  isSaving,
  onUpdateStore,
}) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'Owner';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('EGP');
  const [timezone, setTimezone] = useState('Africa/Cairo');
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [enableInvoiceArchiving, setEnableInvoiceArchiving] = useState(true);
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');

  useEffect(() => {
    if (store) {
      setName(store.name || '');
      setPhone(store.phone || '');
      setAddress(store.address || '');
      setCurrency(store.currency || 'EGP');
      setTimezone(store.timezone || 'Africa/Cairo');
      setTaxEnabled(store.taxEnabled ?? false);
      setAllowNegativeStock(store.allowNegativeStock ?? false);
      setEnableInvoiceArchiving(store.enableInvoiceArchiving ?? true);
      setInvoicePrefix(store.invoicePrefix || 'INV-');
    }
  }, [store]);

  const handleToggleTax = () => {
    if (!isOwner || isSaving) return;
    setTaxEnabled((prev) => !prev);
  };

  const handleToggleNegativeStock = () => {
    if (!isOwner || isSaving) return;
    setAllowNegativeStock((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    await onUpdateStore({
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
      taxEnabled,
      allowNegativeStock,
      invoicePrefix: invoicePrefix.trim() || 'INV-',
      currency,
      timezone,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          جاري تحميل بيانات المتجر...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 max-w-4xl transition-colors select-none">
      {!isOwner && (
        <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            تعديل بيانات وإعدادات المتجر متاح لمالك النظام (Owner) فقط. الحساب الحالي بصفة مدير فرع (للاطلاع فقط).
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Store Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Store className="w-4 h-4 text-primary-500" />
            الهوية والبيانات التجارية:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم المتجر / المنشأة <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  disabled={!isOwner}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسم المحل أو السوبرماركت"
                  className="w-full pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رقم هاتف المتجر
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled={!isOwner}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              العنوان التجاري الفعلي (يظهر على الإيصالات)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <textarea
                rows={2}
                disabled={!isOwner}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الشارع، الحي، المدينة، المحافظة"
                className="w-full pr-9 pl-3 py-2.5 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Financial & Tax Policies */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Percent className="w-4 h-4 text-primary-500" />
            الضرائب والسياسات المالية:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tax Enablement Toggle */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  تفعيل ضريبة القيمة المضافة (14% VAT)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  احتساب الضريبة النظامية تلقائياً في فواتير الكاشير والإيصالات
                </span>
              </div>
              <button
                type="button"
                disabled={!isOwner}
                onClick={handleToggleTax}
                className={
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed " +
                  (taxEnabled ? 'bg-primary-600' : 'bg-slate-400 dark:bg-slate-600')
                }
              >
                <span
                  className={
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out " +
                    (taxEnabled ? '-translate-x-5' : 'translate-x-0')
                  }
                />
              </button>
            </div>

            {/* Negative Stock Policy Toggle */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  السماح بالبيع بالسالب (Negative Stock)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  إتمام البيع بالـ POS حتى وإن لم يتوفر رصيد كافٍ في المخزون
                </span>
              </div>
              <button
                type="button"
                disabled={!isOwner}
                onClick={handleToggleNegativeStock}
                className={
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed " +
                  (allowNegativeStock ? 'bg-amber-600' : 'bg-slate-400 dark:bg-slate-600')
                }
              >
                <span
                  className={
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out " +
                    (allowNegativeStock ? '-translate-x-5' : 'translate-x-0')
                  }
                />
              </button>
            </div>
          </div>
        </div>

        {/* Invoice & Regional Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <FileText className="w-4 h-4 text-primary-500" />
            تنسيق الفواتير والعملة:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                بادئة أرقام الفواتير (Invoice Prefix)
              </label>
              <input
                type="text"
                disabled={!isOwner}
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="مثال: INV-"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                العملة الأساسية
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value="جنيه مصري (EGP)"
                  className="w-full pr-9 pl-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                المنطقة الزمنية
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value="توقيت القاهرة (GMT+3)"
                  className="w-full pr-9 pl-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold cursor-not-allowed opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isOwner && (
          <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/30 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري حفظ التعديلات...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ إعدادات المتجر</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
