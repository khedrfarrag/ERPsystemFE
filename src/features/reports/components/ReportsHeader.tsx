import React from 'react';
import { BarChart3, Printer, Download, Calendar, RefreshCw } from 'lucide-react';
import type { DatePreset } from '../types/reports.types';

interface ReportsHeaderProps {
  datePreset: DatePreset;
  onSelectPreset: (preset: DatePreset) => void;
  fromDate: string;
  onFromDateChange: (d: string) => void;
  toDate: string;
  onToDateChange: (d: string) => void;
  onPrint: () => void;
  onExportCsv: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  datePreset,
  onSelectPreset,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onPrint,
  onExportCsv,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="space-y-4 print:hidden">
      {/* Title & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            مركز التقارير والتحليلات المالية
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
            متابعة دقيقة للأرباح والخسائر، تقييم المخزون، حركة المبيعات، ومراجعة تسويات الدرج
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="btn btn-secondary flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="btn bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white flex items-center gap-1.5 text-xs font-bold shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>تصدير CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="btn btn-primary flex items-center gap-1.5 text-xs font-bold shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير (A4)</span>
          </button>
        </div>
      </div>

      {/* Date Presets & Custom Range */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2 shrink-0">فترة التقرير:</span>
          {[
            { id: 'today', label: 'اليوم' },
            { id: 'last7', label: 'آخر 7 أيام' },
            { id: 'thisMonth', label: 'هذا الشهر' },
            { id: 'lastMonth', label: 'الشهر الماضي' },
            { id: 'custom', label: 'فترة مخصصة' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id as DatePreset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                datePreset === preset.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {datePreset === 'custom' && (
          <div className="flex items-center gap-2 w-full md:w-auto animate-fadeIn">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">إلى</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
