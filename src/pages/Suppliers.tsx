import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSuppliersListQuery } from '../features/suppliers/api/useSuppliersQueries';
import { SuppliersHeader } from '../features/suppliers/components/SuppliersHeader';
import { SuppliersFilterBar } from '../features/suppliers/components/SuppliersFilterBar';
import { SuppliersTable } from '../features/suppliers/components/SuppliersTable';
import { SupplierModal } from '../features/suppliers/components/SupplierModal';
import { RepresentativeModal } from '../features/suppliers/components/RepresentativeModal';
import { CreatePurchaseModal } from '../features/suppliers/components/CreatePurchaseModal';
import { DisbursePaymentModal } from '../features/suppliers/components/DisbursePaymentModal';
import { SupplierStatementModal } from '../features/suppliers/components/SupplierStatementModal';
import { DeleteSupplierModal } from '../features/suppliers/components/DeleteSupplierModal';
import type { Supplier } from '../features/suppliers/types/suppliers.types';

export const Suppliers: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'Owner' || user?.role === 'Manager';

  // Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [payablesFilter, setPayablesFilter] = useState<'all' | 'hasPayables' | 'zeroBalance'>('all');

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [supplierForReps, setSupplierForReps] = useState<Supplier | null>(null);
  const [supplierForPurchase, setSupplierForPurchase] = useState<Supplier | null>(null);
  const [supplierForPayment, setSupplierForPayment] = useState<Supplier | null>(null);
  const [supplierForStatement, setSupplierForStatement] = useState<Supplier | null>(null);

  // Queries
  const { data: suppliersData, isLoading } = useSuppliersListQuery({
    pageNumber: currentPage,
    pageSize,
    search: searchQuery,
  });

  const rawSuppliers = suppliersData?.items || [];
  const totalCount = suppliersData?.totalCount || 0;

  // Filter client-side based on payables filter
  const filteredSuppliers = useMemo(() => {
    return rawSuppliers.filter((s) => {
      const balance = s.currentBalance || 0;
      if (payablesFilter === 'hasPayables') {
        return balance > 0;
      }
      if (payablesFilter === 'zeroBalance') {
        return balance <= 0;
      }
      return true;
    });
  }, [rawSuppliers, payablesFilter]);

  // Compute KPI Stats
  const kpiStats = useMemo(() => {
    let totalDebt = 0;
    let creditorsCount = 0;

    for (let i = 0; i < rawSuppliers.length; i++) {
      const s = rawSuppliers[i];
      const balance = s.currentBalance || 0;
      if (balance > 0) {
        totalDebt += balance;
        creditorsCount++;
      }
    }

    return {
      totalCount,
      totalPayables: totalDebt,
      creditorsCount,
    };
  }, [rawSuppliers, totalCount]);

  const handleOpenAddModal = useCallback(() => {
    setSupplierToEdit(null);
    setIsAddEditModalOpen(true);
  }, []);

  const handleEditSupplier = useCallback((supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setIsAddEditModalOpen(true);
  }, []);

  const handleDeleteSupplier = useCallback((supplier: Supplier) => {
    setSupplierToDelete(supplier);
  }, []);

  const handleAddRep = useCallback((supplier: Supplier) => {
    setSupplierForReps(supplier);
  }, []);

  const handleCreatePurchase = useCallback((supplier: Supplier) => {
    setSupplierForPurchase(supplier);
  }, []);

  const handleOpenPayment = useCallback((supplier: Supplier) => {
    setSupplierForPayment(supplier);
  }, []);

  const handleOpenStatement = useCallback((supplier: Supplier) => {
    setSupplierForStatement(supplier);
  }, []);

  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Header & KPI Metrics */}
      <SuppliersHeader
        totalCount={kpiStats.totalCount}
        totalPayables={kpiStats.totalPayables}
        creditorsCount={kpiStats.creditorsCount}
        onOpenAddModal={handleOpenAddModal}
        canManage={canManage}
      />

      {/* Filter Bar */}
      <SuppliersFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        payablesFilter={payablesFilter}
        onPayablesFilterChange={(pf) => {
          setPayablesFilter(pf);
          setCurrentPage(1);
        }}
      />

      {/* Suppliers Table */}
      <SuppliersTable
        suppliers={filteredSuppliers}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        onAddRep={handleAddRep}
        onCreatePurchase={handleCreatePurchase}
        onOpenStatement={handleOpenStatement}
        onOpenPayment={handleOpenPayment}
        canManage={canManage}
      />

      {/* Modals */}
      <SupplierModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSupplierToEdit(null);
        }}
        supplierToEdit={supplierToEdit}
      />

      <RepresentativeModal
        isOpen={supplierForReps !== null}
        onClose={() => setSupplierForReps(null)}
        supplier={supplierForReps}
      />

      <CreatePurchaseModal
        isOpen={supplierForPurchase !== null}
        onClose={() => setSupplierForPurchase(null)}
        supplier={supplierForPurchase}
      />

      <DisbursePaymentModal
        isOpen={supplierForPayment !== null}
        onClose={() => setSupplierForPayment(null)}
        supplier={supplierForPayment}
      />

      <SupplierStatementModal
        isOpen={supplierForStatement !== null}
        onClose={() => setSupplierForStatement(null)}
        supplier={supplierForStatement}
      />

      <DeleteSupplierModal
        isOpen={supplierToDelete !== null}
        onClose={() => setSupplierToDelete(null)}
        supplier={supplierToDelete}
      />
    </div>
  );
};

export const SuppliersPage = Suppliers;
export default Suppliers;
