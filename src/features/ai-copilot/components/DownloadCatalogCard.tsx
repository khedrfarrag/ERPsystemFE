import React, { useState } from 'react';
import { FileSpreadsheet, Download, Check, Eye, EyeOff, Layers } from 'lucide-react';
import { CatalogExportAction } from '../types';
import { downloadCatalogCsvFile } from '../utils/exportCsvUtils';
import toast from 'react-hot-toast';

interface Props {
  action: CatalogExportAction;
}

export const DownloadCatalogCard: React.FC<Props> = ({ action }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    try {
      downloadCatalogCsvFile(action.filename || 'products_catalog.csv', action.rows);
      setDownloaded(true);
      toast.success('تم تحميل ملف الإكسيل بنجاح! جاهز للاستيراد المباشر.');
      setTimeout(() => setDownloaded(false), 3500);
    } catch (err) {
      toast.error('حدث خطأ أثناء تحميل الملف');
    }
  };

  const rows = action.rows || [];

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-slate-800 dark:to-slate-800/90 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm text-right" dir="rtl">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-tight">
              {action.title || 'ملف كتالوج المنتجات المقترح'}
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {action.filename || 'products_catalog.csv'}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700">
          <Layers className="w-3 h-3" />
          {rows.length} صنف
        </span>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
        الملف مجهز بترميز UTF-8 وبنفس ترتيب أعمدة الاستيراد الرسمية لمتجرك لتفادي أي أخطاء في الاستيراد.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white transition-all duration-200 shadow-sm active:scale-95 ${
            downloaded
              ? 'bg-emerald-700'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20'
          }`}
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>تم التحميل!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-white" />
              <span>تحميل ملف الإكسيل الآن (.csv)</span>
            </>
          )}
        </button>

        {rows.length > 0 && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title={showPreview ? 'إخفاء المعاينة' : 'معاينة الأصناف'}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Mini preview table */}
      {showPreview && rows.length > 0 && (
        <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-slate-700 text-[11px] overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-semibold">
                <th className="py-1 px-1.5">الصنف</th>
                <th className="py-1 px-1.5">القسم</th>
                <th className="py-1 px-1.5">سعر البيع</th>
                <th className="py-1 px-1.5">التكلفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {rows.slice(0, 5).map((r, i) => (
                <tr key={i}>
                  <td className="py-1 px-1.5 font-medium truncate max-w-[120px]">{r.name}</td>
                  <td className="py-1 px-1.5 text-slate-500 dark:text-slate-400">{r.category}</td>
                  <td className="py-1 px-1.5 font-mono text-emerald-600 dark:text-emerald-400">{r.sellingPrice} ج.م</td>
                  <td className="py-1 px-1.5 font-mono text-slate-500">{r.purchaseCost ?? '-'} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 5 && (
            <div className="text-center py-1 text-[10px] text-slate-400">
              ... بالإضافة إلى {rows.length - 5} أصناف أخرى داخل الملف المحمّل
            </div>
          )}
        </div>
      )}
    </div>
  );
};
