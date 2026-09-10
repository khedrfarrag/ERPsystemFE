import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useSalesReportQuery,
  useProfitLossReportQuery,
  useInventoryValuationQuery,
  useCashRegisterAuditQuery,
} from '../features/reports/api/useReportsQueries';
import { ReportsHeader } from '../features/reports/components/ReportsHeader';
import { ReportsTabNavigation } from '../features/reports/components/ReportsTabNavigation';
import { ProfitLossReportTab } from '../features/reports/components/ProfitLossReportTab';
import { SalesReportTab } from '../features/reports/components/SalesReportTab';
import { InventoryValuationReportTab } from '../features/reports/components/InventoryValuationReportTab';
import { BalancesReportTab } from '../features/reports/components/BalancesReportTab';
import { CashRegisterAuditTab } from '../features/reports/components/CashRegisterAuditTab';
import { ProductMovementModal } from '../features/reports/components/ProductMovementModal';
import type { ReportTabType, DatePreset } from '../features/reports/types/reports.types';
import toast from 'react-hot-toast';

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ReportTabType>('profit-loss');
  const [datePreset, setDatePreset] = useState<DatePreset>('thisMonth');

  // Compute default dates based on preset
  const { initialFrom, initialTo } = useMemo(() => {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];
    return { initialFrom: firstDayThisMonth, initialTo: today };
  }, []);

  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);

  // Movement Modal state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string | null>(null);

  const handleSelectPreset = useCallback((preset: DatePreset) => {
    setDatePreset(preset);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'today') {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (preset === 'last7') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFromDate(past.toISOString().split('T')[0]);
      setToDate(todayStr);
    } else if (preset === 'thisMonth') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setFromDate(first);
      setToDate(todayStr);
    } else if (preset === 'lastMonth') {
      const firstLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const lastLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      setFromDate(firstLastMonth);
      setToDate(lastLastMonth);
    }
  }, []);

  // ISO Dates for queries
  const isoFrom = fromDate ? new Date(fromDate + 'T00:00:00').toISOString() : undefined;
  const isoTo = toDate ? new Date(toDate + 'T23:59:59').toISOString() : undefined;

  // Tab-specific queries
  const salesQuery = useSalesReportQuery(isoFrom, isoTo);
  const plQuery = useProfitLossReportQuery(isoFrom, isoTo);
  const inventoryQuery = useInventoryValuationQuery(undefined, undefined);
  const cashAuditQuery = useCashRegisterAuditQuery(isoFrom, isoTo);

  const isLoading =
    (activeTab === 'sales' && salesQuery.isLoading) ||
    (activeTab === 'profit-loss' && plQuery.isLoading) ||
    (activeTab === 'inventory-valuation' && inventoryQuery.isLoading) ||
    (activeTab === 'cash-audit' && cashAuditQuery.isLoading);

  const handleRefresh = () => {
    salesQuery.refetch();
    plQuery.refetch();
    inventoryQuery.refetch();
    cashAuditQuery.refetch();
    toast.success('تم تحديث بيانات التقارير');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5030/api';
    let url = `${apiBase}/reports/${activeTab}?format=csv`;
    if (isoFrom) url += `&from=${encodeURIComponent(isoFrom)}`;
    if (isoTo) url += `&to=${encodeURIComponent(isoTo)}`;
    window.open(url, '_blank');
    toast.success('جاري تصدير التقرير بتنسيق CSV...');
  };

  const handleOpenProductMovement = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
  };

  return (
    <div className="space-y-6 pb-12 font-sans" dir="rtl">
      {/* Printable Header - Visible ONLY during print */}
      <div className="hidden print:block text-center border-b pb-4 mb-6">
        <h1 className="text-xl font-black">RetailOS — تقرير مالي وإداري معتمد</h1>
        <p className="text-xs text-slate-500 mt-1">
          المؤسسة: {user?.storeName || 'المتجر الرئيسي'} • طُبع بتاريخ: {new Date().toLocaleString('ar-EG')}
        </p>
        <p className="text-xs font-mono font-bold mt-1">
          فترة التقرير: من {fromDate} إلى {toDate}
        </p>
      </div>

      {/* Interactive Controls & Header */}
      <ReportsHeader
        datePreset={datePreset}
        onSelectPreset={handleSelectPreset}
        fromDate={fromDate}
        onFromDateChange={(d) => {
          setFromDate(d);
          setDatePreset('custom');
        }}
        toDate={toDate}
        onToDateChange={(d) => {
          setToDate(d);
          setDatePreset('custom');
        }}
        onPrint={handlePrint}
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Tabs Switcher */}
      <ReportsTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Panels */}
      <div>
        {activeTab === 'profit-loss' && (
          <ProfitLossReportTab data={plQuery.data || null} isLoading={plQuery.isLoading} />
        )}

        {activeTab === 'sales' && (
          <SalesReportTab data={salesQuery.data || null} isLoading={salesQuery.isLoading} />
        )}

        {activeTab === 'inventory-valuation' && (
          <InventoryValuationReportTab
            data={inventoryQuery.data || null}
            isLoading={inventoryQuery.isLoading}
            onSelectProduct={handleOpenProductMovement}
          />
        )}

        {activeTab === 'balances' && <BalancesReportTab />}

        {activeTab === 'cash-audit' && (
          <CashRegisterAuditTab data={cashAuditQuery.data || null} isLoading={cashAuditQuery.isLoading} />
        )}
      </div>

      {/* Product Movement Drilldown Modal */}
      <ProductMovementModal
        isOpen={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
        productId={selectedProductId}
        productName={selectedProductName}
      />
    </div>
  );
};

export const ReportsPage = Reports;
export default Reports;
