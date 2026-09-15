import React from 'react';
import { Package, AlertTriangle, XCircle, Plus, FileSpreadsheet, Sparkles, Layers } from 'lucide-react';

interface ProductsHeaderProps {
  totalCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onOpenAiScannerModal: () => void;
  onOpenCategoriesModal: () => void;
  canManage: boolean;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  totalCount,
  lowStockCount,
  outOfStockCount,
  onOpenAddModal,
  onOpenImportModal,
  onOpenAiScannerModal,
  onOpenCategoriesModal,
  canManage,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            إدارة المنتجات والمخزون
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            متابعة الأصناف، الأسعار، هوامش الربح، وتنبيهات نواقص المخزن
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCategoriesModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
              title="إدارة أقسام وفئات المنتجات، تعديلها أو حذفها"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>إدارة الأقسام</span>
            </button>

            <button
              type="button"
              onClick={onOpenAiScannerModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>مسح فاتورة ذكي</span>
            </button>

            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>استيراد إكسل</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all transform active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Products */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Package className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">إجمالي المنتجات المسجلة</span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">أصناف قاربت على النفاد</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {lowStockCount}
            </span>
          </div>
        </div>

        {/* Out of Stock Alert */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <XCircle className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">أصناف نفدت من المخزن</span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {outOfStockCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
