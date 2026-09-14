import React, { useState } from 'react';
import api from '../../../api/client';
import toast from 'react-hot-toast';
import { FileSpreadsheet, UploadCloud, CheckCircle2, AlertTriangle, X, Loader2, Download } from 'lucide-react';
import { useImportPreviewMutation, useImportCommitMutation } from '../api/useProductsMutations';
import type { ImportPreviewResponse } from '../types/products.types';

interface ImportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportProductsModal: React.FC<ImportProductsModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);

  const previewMutation = useImportPreviewMutation();
  const commitMutation = useImportCommitMutation();

  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      const res = await api.get('/products/import/template', { responseType: 'blob' });
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'retailos_products_template.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('حدث خطأ أثناء تحميل القالب');
    } finally {
      setDownloadingTemplate(false);
    }
  };


  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    try {
      const preview = await previewMutation.mutateAsync(file);
      setPreviewData(preview);
    } catch {}
  };

  const handleCommit = async () => {
    if (!selectedFile) return;
    try {
      await commitMutation.mutateAsync(selectedFile);
      onClose();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                استيراد الأصناف عبر ملف Excel / CSV
              </h3>
              <p className="text-xs text-slate-500">
                ارفع الملف لمعاينة الأصناف وفحص الأخطاء قبل التأكيد
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

          {/* Template Download Card */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  هل تحتاج قالب Excel / CSV جاهز؟
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  قالب نموذجي يحتوي على أسماء الأعمدة الصحيحة وبيانات تجريبية جاهزة للاستيراد
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={downloadingTemplate}
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {downloadingTemplate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadingTemplate ? 'جاري تجهيز الملف...' : 'تحميل قالب Excel جاهز (.xlsx)'}</span>
            </button>
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileSelect}
              className="hidden"
              id="excel-file-input"
            />
            <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-emerald-500 mb-2 stroke-[1.5]" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                {selectedFile ? selectedFile.name : 'اضغط لاختيار ملف Excel (.xlsx / .csv)'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">الحد الأقصى للملف: 5 ميجابايت</span>
            </label>
          </div>

          {previewMutation.isPending && (
            <div className="text-center py-6 text-xs text-slate-500 font-bold flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              <span>جاري قراءة الملف والتحقق من صحة الأعمدة والأسعار...</span>
            </div>
          )}

          {/* Preview Results */}
          {previewData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-500">إجمالي الصفوف: </span>
                  <b className="font-mono">{previewData.totalRows}</b>
                </div>
                <div className="text-emerald-600 font-bold">
                  <span>الأصناف السليمة: </span>
                  <b className="font-mono">{(previewData.validRows ?? previewData.validRowsCount ?? 0)}</b>
                </div>
                {((previewData.errorRows ?? previewData.invalidRowsCount ?? previewData.errors?.length ?? 0) > 0) && (
                  <div className="text-rose-500 font-bold">
                    <span>صفوف تحتوي أخطاء: </span>
                    <b className="font-mono">{previewData.errorRows ?? previewData.invalidRowsCount ?? previewData.errors?.length ?? 0}</b>
                  </div>
                )}
              </div>

              {/* Sample Rows Table */}
              <div className="max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-right text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">اسم الصنف</th>
                      <th className="py-2 px-3">الباركود</th>
                      <th className="py-2 px-3">التكلفة</th>
                      <th className="py-2 px-3">سعر البيع</th>
                      <th className="py-2 px-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {(previewData.rows || []).slice(0, 10).map((r, i) => (
                      <tr key={i} className={r.isValid ? '' : 'bg-rose-50/50 dark:bg-rose-950/30'}>
                        <td className="py-2 px-3 font-mono">{r.rowNumber}</td>
                        <td className="py-2 px-3 font-semibold">{r.name}</td>
                        <td className="py-2 px-3 font-mono">{r.barcode || '-'}</td>
                        <td className="py-2 px-3 font-mono">{r.purchaseCost}</td>
                        <td className="py-2 px-3 font-mono">{r.sellingPrice}</td>
                        <td className="py-2 px-3">
                          {r.isValid ? (
                            <span className="text-emerald-600 font-bold">سليم</span>
                          ) : (
                            <span className="text-rose-600 font-bold" title={r.errors.join(', ')}>
                              {r.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
            onClick={handleCommit}
            disabled={!previewData || (previewData.validRows ?? previewData.validRowsCount ?? 0) === 0 || commitMutation.isPending}
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
          >
            {commitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>تأكيد الاستيراد ({previewData?.validRows ?? previewData?.validRowsCount ?? 0} صنف)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
