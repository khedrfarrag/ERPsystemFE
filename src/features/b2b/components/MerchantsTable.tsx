import React from 'react';
import { Merchant } from '../types/b2b.types';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Edit3, 
  Power, 
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/whatsappUtils';

interface MerchantsTableProps {
  merchants: Merchant[];
  isLoading: boolean;
  onEdit: (merchant: Merchant) => void;
  onToggleActive: (id: string) => void;
}

export const MerchantsTable: React.FC<MerchantsTableProps> = ({
  merchants,
  isLoading,
  onEdit,
  onToggleActive,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 animate-pulse">
        جاري تحميل بيانات تجار الجملة...
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">لا يوجد تجار جملة مسجلين</h3>
        <p className="text-sm text-slate-400">ابدأ بإضافة أول متجر أو تاجر جملة عبر زر "إضافة تاجر جملة جديد".</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 text-xs font-bold uppercase border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">المتجر والمسئول</th>
              <th className="px-6 py-4">الاتصال</th>
              <th className="px-6 py-4">سقف الائتمان</th>
              <th className="px-6 py-4">الرصيد القائم</th>
              <th className="px-6 py-4">شروط الدفع</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {merchants.map((merchant) => {
              const isOverLimit = merchant.creditLimit > 0 && merchant.currentBalance > merchant.creditLimit;
              const waUrl = buildWhatsAppUrl(
                merchant.phone,
                `السلام عليكم ورحمة الله، مرحباً ${merchant.contactPerson} من طرف إدارة التوريد بالجملة.`
              );

              return (
                <tr key={merchant.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Shop & Contact */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">{merchant.tradeName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{merchant.contactPerson}</span>
                          {merchant.address && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-slate-500 truncate max-w-[160px]">
                                <MapPin className="w-3 h-3" />
                                {merchant.address}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Phone & WhatsApp */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-200 text-xs" dir="ltr">{merchant.phone}</span>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                          title="فتح محادثة واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {merchant.email && (
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{merchant.email}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Credit Limit */}
                  <td className="px-6 py-4 font-mono font-medium text-slate-200">
                    {merchant.creditLimit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </td>

                  {/* Current Balance */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-bold ${
                        isOverLimit ? 'text-rose-400' : merchant.currentBalance > 0 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {merchant.currentBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                      </span>
                      {isOverLimit && (
                        <span title="تجاوز سقف الائتمان" className="text-rose-400">
                          <AlertTriangle className="w-4 h-4 inline" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Payment Terms */}
                  <td className="px-6 py-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg w-fit">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{merchant.paymentTerms || 'افتراضي'}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleActive(merchant.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 transition-all ${
                        merchant.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {merchant.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>نشط</span>
                        </>
                      ) : (
                        <>
                          <Power className="w-3.5 h-3.5" />
                          <span>معطل</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(merchant)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="تعديل بيانات التاجر"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
