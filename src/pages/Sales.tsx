import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  RefreshCw,
  PlusCircle,
  Banknote,
  CreditCard,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { useSales } from '../features/sales/hooks/useSales';
import { SalesFilters } from '../features/sales/components/SalesFilters';
import { SalesTable } from '../features/sales/components/SalesTable';
import { SaleDetailsModal } from '../features/sales/components/SaleDetailsModal';
import { SaleReturnModal } from '../features/sales/components/SaleReturnModal';
import { ThermalReceiptPrint } from '../features/sales/components/ThermalReceiptPrint';
import { Sale, CreateSaleReturnRequest } from '../features/sales/types/sales.types';

export const Sales: React.FC = () => {
  const navigate = useNavigate();
  const {
    sales,
    rawSales,
    totalCount,
    pageNumber,
    pageSize,
    isLoading,
    filters,
    currentDrawer,
    setFilter,
    resetFilters,
    setPageNumber,
    refetchSales,
    processReturn,
  } = useSales();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isReturnOpen, setIsReturnOpen] = useState<boolean>(false);
  const [printingSale, setPrintingSale] = useState<Sale | null>(null);

  // Calculate summary metrics from loaded sales
  const summaryMetrics = useMemo(() => {
    const totalRevenue = rawSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalCash = rawSales.reduce((sum, s) => sum + s.cashAmount, 0);
    const totalCredit = rawSales.reduce((sum, s) => sum + s.creditAmount, 0);
    return { totalRevenue, totalCash, totalCredit };
  }, [rawSales]);

  const handleOpenDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsOpen(true);
  };

  const handleReprint = (sale: Sale) => {
    setPrintingSale(sale);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleOpenReturnModal = () => {
    setIsDetailsOpen(false);
    setIsReturnOpen(true);
  };

  const handleReturnSubmit = async (saleId: string, data: CreateSaleReturnRequest) => {
    await processReturn(saleId, data);
    setIsReturnOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Hidden Thermal Receipt Print Layout */}
      <ThermalReceiptPrint sale={printingSale || selectedSale} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            سجل فواتير المبيعات والمرتجعات
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            تصفح وأرشفة الفواتير السابقة، إعادة طباعة الإيصالات، وإدارة مرتجعات المبيعات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchSales()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 font-bold text-sm transition shadow-sm"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-primary-500' : ''}`} />
            <span>تحديث</span>
          </button>

          <button
            onClick={() => navigate('/pos')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>نقطة بيع جديدة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              إجمالي الفواتير
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              إجمالي المبيعات المحققة
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {summaryMetrics.totalRevenue.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}{' '}
              <span className="text-xs font-bold text-slate-500">ج.م</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              المحصل نقداً
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {summaryMetrics.totalCash.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}{' '}
              <span className="text-xs font-bold text-slate-500">ج.م</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              مبيعات بالآجل (العملاء)
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {summaryMetrics.totalCredit.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}{' '}
              <span className="text-xs font-bold text-slate-500">ج.م</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <SalesFilters
        search={filters.search}
        onSearchChange={(v) => setFilter('search', v)}
        paymentMethod={filters.paymentMethod}
        onPaymentMethodChange={(v) => setFilter('paymentMethod', v)}
        customerId={filters.customerId}
        onCustomerChange={(v) => setFilter('customerId', v)}
        onReset={resetFilters}
      />

      {/* Invoices Table */}
      <SalesTable
        sales={sales}
        isLoading={isLoading}
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={(p) => setPageNumber(p)}
        onSelectSale={handleOpenDetails}
        onReprintSale={handleReprint}
      />

      {/* Sale Details Modal */}
      <SaleDetailsModal
        sale={selectedSale}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onReprint={() => {
          if (selectedSale) handleReprint(selectedSale);
        }}
        onOpenReturn={handleOpenReturnModal}
      />

      {/* Return Wizard Modal */}
      <SaleReturnModal
        sale={selectedSale}
        isOpen={isReturnOpen}
        currentDrawer={currentDrawer}
        onClose={() => setIsReturnOpen(false)}
        onSubmitReturn={handleReturnSubmit}
      />
    </div>
  );
};

export default Sales;
