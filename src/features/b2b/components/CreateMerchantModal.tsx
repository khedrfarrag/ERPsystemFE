import React, { useState, useEffect } from 'react';
import { Merchant, CreateMerchantRequest, UpdateMerchantRequest } from '../types/b2b.types';
import { X, Building2, User, Phone, Mail, MapPin, CreditCard, Lock, Clock } from 'lucide-react';

interface CreateMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (data: CreateMerchantRequest) => Promise<any>;
  onSubmitUpdate: (id: string, data: UpdateMerchantRequest) => Promise<any>;
  merchantToEdit: Merchant | null;
}

export const CreateMerchantModal: React.FC<CreateMerchantModalProps> = ({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  merchantToEdit,
}) => {
  const [formData, setFormData] = useState({
    tradeName: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    creditLimit: '0',
    paymentTerms: 'Net 15',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (merchantToEdit) {
      setFormData({
        tradeName: merchantToEdit.tradeName,
        contactPerson: merchantToEdit.contactPerson,
        phone: merchantToEdit.phone,
        email: merchantToEdit.email || '',
        password: '',
        address: merchantToEdit.address || '',
        creditLimit: merchantToEdit.creditLimit.toString(),
        paymentTerms: merchantToEdit.paymentTerms || 'Net 15',
        isActive: merchantToEdit.isActive,
      });
    } else {
      setFormData({
        tradeName: '',
        contactPerson: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        creditLimit: '0',
        paymentTerms: 'Net 15',
        isActive: true,
      });
    }
  }, [merchantToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (merchantToEdit) {
        await onSubmitUpdate(merchantToEdit.id, {
          tradeName: formData.tradeName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email || undefined,
          address: formData.address || undefined,
          creditLimit: parseFloat(formData.creditLimit) || 0,
          paymentTerms: formData.paymentTerms || undefined,
          isActive: formData.isActive,
        });
      } else {
        await onSubmitCreate({
          tradeName: formData.tradeName,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
          address: formData.address || undefined,
          creditLimit: parseFloat(formData.creditLimit) || 0,
          paymentTerms: formData.paymentTerms || undefined,
        });
      }
      onClose();
    } catch (err) {
      // Error handled by mutation toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {merchantToEdit ? 'تعديل بيانات تاجر جملة' : 'تسجيل تاجر جملة جديد'}
              </h2>
              <p className="text-xs text-slate-400">
                {merchantToEdit ? 'تحديث حدود الائتمان وبيانات الاتصال' : 'إنشاء حساب تاجر وحساب بوابة التوريد'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trade Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم المتجر / الاسم التجاري <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  placeholder="مثال: سوبرماركت الأمل"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم المسئول / التاجر <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="مثال: محمود أحمد"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                رقم الهاتف والواتساب <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="مثال: +201012345678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white font-mono focus:outline-none focus:border-primary-500 transition"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                البريد الإلكتروني (اختياري)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="merchant@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>

          {!merchantToEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                كلمة مرور بوابة التاجر <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="لا تقل عن 6 أحرف"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">سيستخدم التاجر بريده الإلكتروني أو رقم هاتفه وهذه الكلمة لتسجيل الدخول للبوابة.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Credit Limit */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                سقف الائتمان المسموح به (ج.م)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white font-mono focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                شروط الدفع المتفق عليها
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  placeholder="مثال: Net 15, Net 30, نقداً عند الاستلام"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان التوصيل / المتجر
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="مثال: القاهرة، شارع التحرير، عمارة 14"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-10 pl-3 text-sm text-white focus:outline-none focus:border-primary-500 transition"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الحفظ...' : merchantToEdit ? 'تحديث البيانات' : 'تسجيل التاجر'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
