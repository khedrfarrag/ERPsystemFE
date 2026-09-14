import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ShoppingBag, 
  Layers, 
  Archive, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  Building2,
  Calendar,
  Hash,
  AlertCircle
} from 'lucide-react';
import { InvoiceDropzone } from './InvoiceDropzone';
import { InvoiceImagePreview } from './InvoiceImagePreview';
import { InvoiceItemsReviewTable } from './InvoiceItemsReviewTable';
import { DuplicateInvoiceWarningModal } from './DuplicateInvoiceWarningModal';
import { 
  useScanInvoiceMutation, 
  useCommitInvoiceMutation, 
  useAiInvoiceSettingsQuery 
} from '../api/useAiInvoiceMutations';
import type { 
  InvoiceScanPreviewResponse, 
  InvoiceScanLineItem,
  DuplicateInvoiceWarning,
  CommitAiInvoiceRequest 
} from '../types/ai-invoice.types';

interface AiInvoiceScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'Purchase' | 'CatalogOnly';
  onSuccess?: () => void;
}

export const AiInvoiceScanModal: React.FC<AiInvoiceScanModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'Purchase',
  onSuccess,
}) => {
  const { data: settings } = useAiInvoiceSettingsQuery();
  const scanMutation = useScanInvoiceMutation();
  const commitMutation = useCommitInvoiceMutation();

  // Workflow states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<InvoiceScanPreviewResponse | null>(null);
  const [mode, setMode] = useState<'Purchase' | 'CatalogOnly'>(defaultMode);
  
  // Archiving checkbox (inherits store setting by default, user can override on the fly)
  const [saveToArchive, setSaveToArchive] = useState<boolean>(true);
  
  // Header form states
  const [supplierName, setSupplierName] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Table items state & global markup
  const [items, setItems] = useState<InvoiceScanLineItem[]>([]);
  const [globalMarkup, setGlobalMarkup] = useState<number>(25);

  // Duplicate Warning Modal state
  const [activeDuplicateWarning, setActiveDuplicateWarning] = useState<DuplicateInvoiceWarning | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [allowOverride, setAllowOverride] = useState<boolean>(false);

  // Side-by-side preview collapse state
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState<boolean>(false);

  // Sync settings when loaded
  useEffect(() => {
    if (settings) {
      setSaveToArchive(settings.enableInvoiceArchiving);
      setGlobalMarkup(settings.defaultMarkupPercent || 25);
    }
  }, [settings]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setSelectedFile(null);
      setPreviewData(null);
      setItems([]);
      setAllowOverride(false);
      setActiveDuplicateWarning(null);
      setShowDuplicateModal(false);
    }
  }, [isOpen, defaultMode]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    try {
      const data = await scanMutation.mutateAsync({
        file,
        markupPercent: globalMarkup,
      });

      setPreviewData(data);
      setSupplierName(data.supplierName || '');
      setInvoiceNumber(data.invoiceNumber || '');
      setInvoiceDate(data.invoiceDate ? data.invoiceDate.split('T')[0] : new Date().toISOString().split('T')[0]);
      setItems(data.items || []);

      if (data.duplicateWarning && data.duplicateWarning.isDuplicate) {
        setActiveDuplicateWarning(data.duplicateWarning);
        setShowDuplicateModal(true);
      }
    } catch (err) {
      // Error handled by react-hot-toast / mutation
    }
  };

  const handleApplyGlobalMarkup = () => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.unitCost <= 0) return item;
        const newSell = Math.round(item.unitCost * (1 + globalMarkup / 100) * 100) / 100;
        return {
          ...item,
          sellingPrice: newSell,
          isSellingBelowCost: Boolean(newSell && item.unitCost > 0 && newSell < item.unitCost),
        };
      })
    );
  };

  const handleUpdateItem = (index: number, updated: Partial<InvoiceScanLineItem>) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        lineNumber: prev.length + 1,
        rawItemName: '',
        barcode: null,
        matchedProductId: null,
        matchedProductName: null,
        isNewProduct: true,
        confidenceScore: 0,
        categoryName: 'عام',
        unitSymbol: 'قطعة',
        quantity: 1,
        unitCost: 0,
        sellingPrice: null,
        subTotal: 0,
        isCostMissingOrZero: true,
        isSellingBelowCost: false,
      },
    ]);
  };

  // Calculations
  const totalCost = items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
  const totalRetail = items.reduce((sum, i) => sum + (i.quantity * (i.sellingPrice || i.unitCost)), 0);
  const profitAmount = totalRetail - totalCost;
  const profitMarginPercent = totalCost > 0 ? (profitAmount / totalCost) * 100 : 0;
  const hasZeroCostItems = items.some((i) => i.unitCost <= 0);

  const handleCommit = async (overrideFlag: boolean = allowOverride) => {
    if (items.length === 0) return;

    // Check duplicate warning if not confirmed yet
    if (activeDuplicateWarning && !overrideFlag) {
      setShowDuplicateModal(true);
      return;
    }

    const payload: CommitAiInvoiceRequest = {
      mode,
      supplierName: supplierName.trim() || undefined,
      supplierId: previewData?.matchedSupplierId || undefined,
      invoiceNumber: invoiceNumber.trim() || undefined,
      invoiceDate: invoiceDate ? new Date(invoiceDate).toISOString() : undefined,
      notes: notes.trim() || undefined,
      imageTempKey: previewData?.imageTempKey,
      saveToArchive,
      allowDuplicateOverride: overrideFlag,
      items: items.map((i) => ({
        productId: i.matchedProductId,
        name: i.rawItemName.trim(),
        barcode: i.barcode?.trim() || null,
        categoryName: i.categoryName.trim() || 'عام',
        unitSymbol: i.unitSymbol.trim() || 'قطعة',
        quantity: i.quantity,
        unitCost: i.unitCost,
        sellingPrice: i.sellingPrice ?? i.unitCost,
      })),
    };

    await commitMutation.mutateAsync(payload);
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div
          className="w-full max-w-7xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-50/50 via-white to-indigo-50/50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>المسح الذكي لفواتير الموردين</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] font-extrabold border border-violet-200 dark:border-violet-800">
                    Google Gemini Pro Vision
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  التقط أو ارفع صورة الفاتورة لاستخراج الأصناف والأسعار وتحديث المخزون بنقرة واحدة
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {!previewData ? (
              /* Step 1: Upload Dropzone */
              <div className="py-6 max-w-2xl mx-auto">
                <InvoiceDropzone
                  onFileSelect={handleFileSelect}
                  isScanning={scanMutation.isPending}
                />
              </div>
            ) : (
              /* Step 2: Verification and Review Grid */
              <div className="space-y-5">
                {/* Mode Selector & Archiving Controls */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
                  {/* Mode Tabs */}
                  <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMode('Purchase')}
                      className={
                        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' +
                        (mode === 'Purchase'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900')
                      }
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>فاتورة مشتريات وتحديث مخزون</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('CatalogOnly')}
                      className={
                        'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ' +
                        (mode === 'CatalogOnly'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900')
                      }
                    >
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>إضافة وتحديث دليل المنتجات فقط</span>
                    </button>
                  </div>

                  {/* Archiving Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={saveToArchive}
                      onChange={(e) => setSaveToArchive(e.target.checked)}
                      className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
                    />
                    <Archive className="w-4 h-4 text-violet-600" />
                    <span>حفظ نسخة ضوئية من الفاتورة في الأرشيف الرقمي</span>
                  </label>
                </div>

                {/* Metadata Fields Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Supplier */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>اسم المورد / الشركة</span>
                    </label>
                    <input
                      type="text"
                      value={supplierName}
                      placeholder="اسم المورد"
                      onChange={(e) => setSupplierName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  {/* Invoice Number */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      <span>رقم الفاتورة الأصلية</span>
                    </label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      placeholder="رقم الفاتورة"
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  {/* Invoice Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>تاريخ الفاتورة</span>
                    </label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>ملاحظات إضافية</span>
                    </label>
                    <input
                      type="text"
                      value={notes}
                      placeholder="أي ملاحظات تخص الفاتورة..."
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Main Split Content: Receipt Image Preview & Verification Table */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                  {/* Left Column: Image Preview */}
                  <div className={isPreviewCollapsed ? 'xl:col-span-1' : 'xl:col-span-4'}>
                    <InvoiceImagePreview
                      file={selectedFile}
                      isCollapsed={isPreviewCollapsed}
                      onToggleCollapse={() => setIsPreviewCollapsed((c) => !c)}
                    />
                  </div>

                  {/* Right Column: Interactive Table */}
                  <div className={isPreviewCollapsed ? 'xl:col-span-11' : 'xl:col-span-8'}>
                    <InvoiceItemsReviewTable
                      items={items}
                      globalMarkup={globalMarkup}
                      onGlobalMarkupChange={setGlobalMarkup}
                      onApplyGlobalMarkup={handleApplyGlobalMarkup}
                      onUpdateItem={handleUpdateItem}
                      onDeleteItem={handleDeleteItem}
                      onAddItem={handleAddItem}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Summary & Actions */}
          {previewData && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Financial KPI Summary */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">إجمالي البنود:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {items.length} صنف
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">إجمالي التكلفة:</span>
                  <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                    {totalCost.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">المبيعات المتوقعة:</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {totalRetail.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">متوسط هامش الربح:</span>
                  <span className="font-mono font-black text-violet-600 dark:text-violet-400">
                    +{profitMarginPercent.toFixed(1)}%
                  </span>
                </div>

                {hasZeroCostItems && (
                  <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>توجد أصناف بتكلفة صفرية</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewData(null);
                    setSelectedFile(null);
                    setItems([]);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
                >
                  مسح ملف آخر
                </button>

                <button
                  type="button"
                  onClick={() => handleCommit(allowOverride)}
                  disabled={items.length === 0 || commitMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commitMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {mode === 'Purchase' ? 'اعتماد الفاتورة وتحديث المخزون' : 'اعتماد وتحديث دليل المنتجات'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Duplicate Invoice Warning Modal */}
      <DuplicateInvoiceWarningModal
        isOpen={showDuplicateModal}
        warning={activeDuplicateWarning}
        onConfirm={() => {
          setAllowOverride(true);
          setShowDuplicateModal(false);
          handleCommit(true);
        }}
        onCancel={() => {
          setShowDuplicateModal(false);
        }}
      />
    </>
  );
};
