import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import type { DuplicateInvoiceWarning } from '../types/ai-invoice.types';

interface DuplicateInvoiceWarningModalProps {
  isOpen: boolean;
  warning: DuplicateInvoiceWarning | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DuplicateInvoiceWarningModal: React.FC<DuplicateInvoiceWarningModalProps> = ({
  isOpen,
  warning,
  onConfirm,
  onCancel,
}) => {
  const [managerAcknowledged, setManagerAcknowledged] = useState(false);

  if (!isOpen || !warning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={
                'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ' +
                (warning.isIdentical
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400')
              }
            >
              {warning.isIdentical ? (
                <ShieldAlert className="w-6 h-6 stroke-[2]" />
              ) : (
                <AlertTriangle className="w-6 h-6 stroke-[2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {warning.isIdentical ? 'تنبيه أمني: فاتورة مكررة ومطابقة 100%' : 'تنبيه: تكرار رقم الفاتورة لنفس المورد'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {warning.isIdentical
                  ? 'تم تسجيل فاتورة مطابقة تماماً لهذه الفاتورة مسبقاً'
                  : 'تم العثور على فاتورة سابقة مسجلة بنفس الرقم'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Invoice Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="font-semibold">رقم الفاتورة المسجلة:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {warning.existingPurchaseNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="font-semibold">تاريخ التسجيل السابق:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {new Date(warning.existingPurchaseDate).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="font-semibold">إجمالي الفاتورة المسجلة:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {warning.existingTotalAmount.toFixed(2)} ج.م
            </span>
          </div>
          {warning.isIdentical && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[11px] font-extrabold">
                <ShieldAlert className="w-3.5 h-3.5" />
                تطابق 100% في الأصناف والكميات والإجمالي
              </span>
            </div>
          )}
        </div>

        {/* Warning Message Notice */}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {warning.warningMessage}
        </p>

        {/* Override Confirmation for 100% identical */}
        {warning.isIdentical && (
          <label className="flex items-start gap-3 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer">
            <input
              type="checkbox"
              checked={managerAcknowledged}
              onChange={(e) => setManagerAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
              أقر بصفتي مشرفاً/مديراً بصحة تسجيل هذه الفاتورة المطابقة وتحديث رصيد المخزن والمورد.
            </span>
          </label>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            إلغاء العملية
          </button>
          <button
            type="button"
            disabled={warning.isIdentical && !managerAcknowledged}
            onClick={onConfirm}
            className={
              'flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-xs font-extrabold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed ' +
              (warning.isIdentical
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20')
            }
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{warning.isIdentical ? 'تأكيد الحفظ بصلاحية المشرف' : 'متابعة الحفظ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
