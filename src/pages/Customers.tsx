import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCustomersListQuery } from '../features/customers/api/useCustomersQueries';
import { CustomersHeader } from '../features/customers/components/CustomersHeader';
import { CustomersFilterBar } from '../features/customers/components/CustomersFilterBar';
import { CustomersTable } from '../features/customers/components/CustomersTable';
import { CustomerModal } from '../features/customers/components/CustomerModal';
import { ReceivePaymentModal } from '../features/customers/components/ReceivePaymentModal';
import { CustomerStatementModal } from '../features/customers/components/CustomerStatementModal';
import { DeleteCustomerModal } from '../features/customers/components/DeleteCustomerModal';
import type { Customer } from '../features/customers/types/customers.types';

export const Customers: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'Owner' || user?.role === 'Manager';

  // Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [debtFilter, setDebtFilter] = useState<'all' | 'debtors' | 'overLimit' | 'zeroDebt'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [customerForPayment, setCustomerForPayment] = useState<Customer | null>(null);
  const [customerForStatement, setCustomerForStatement] = useState<Customer | null>(null);

  // Queries
  const { data: customersData, isLoading } = useCustomersListQuery({
    pageNumber: currentPage,
    pageSize,
    search: searchQuery,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
  });

  const rawCustomers = customersData?.items || [];
  const totalCount = customersData?.totalCount || 0;

  // Filter client-side based on debt filter
  const filteredCustomers = useMemo(() => {
    return rawCustomers.filter((c) => {
      const balance = c.currentBalance || 0;
      const limit = c.creditLimit || 0;

      if (debtFilter === 'debtors') {
        return balance > 0;
      }
      if (debtFilter === 'overLimit') {
        return limit > 0 && balance >= limit * 0.85;
      }
      if (debtFilter === 'zeroDebt') {
        return balance <= 0;
      }
      return true;
    });
  }, [rawCustomers, debtFilter]);

  // Compute KPI Stats
  const kpiStats = useMemo(() => {
    let totalDebt = 0;
    let debtorsCount = 0;
    let riskCount = 0;

    for (let i = 0; i < rawCustomers.length; i++) {
      const c = rawCustomers[i];
      const balance = c.currentBalance || 0;
      const limit = c.creditLimit || 0;

      if (balance > 0) {
        totalDebt += balance;
        debtorsCount++;
      }
      if (limit > 0 && balance >= limit) {
        riskCount++;
      }
    }

    return {
      totalCount,
      totalReceivables: totalDebt,
      debtorsCount,
      riskCount,
    };
  }, [rawCustomers, totalCount]);

  const handleOpenAddModal = useCallback(() => {
    setCustomerToEdit(null);
    setIsAddEditModalOpen(true);
  }, []);

  const handleEditCustomer = useCallback((customer: Customer) => {
    setCustomerToEdit(customer);
    setIsAddEditModalOpen(true);
  }, []);

  const handleDeleteCustomer = useCallback((customer: Customer) => {
    setCustomerToDelete(customer);
  }, []);

  const handleOpenPayment = useCallback((customer: Customer) => {
    setCustomerForPayment(customer);
  }, []);

  const handleOpenStatement = useCallback((customer: Customer) => {
    setCustomerForStatement(customer);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <CustomersHeader
        totalCount={kpiStats.totalCount}
        totalReceivables={kpiStats.totalReceivables}
        debtorsCount={kpiStats.debtorsCount}
        riskCount={kpiStats.riskCount}
        onOpenAddModal={handleOpenAddModal}
        canManage={canManage}
      />

      {/* Filter Bar */}
      <CustomersFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        debtFilter={debtFilter}
        onDebtFilterChange={(d) => {
          setDebtFilter(d);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(st) => {
          setStatusFilter(st);
          setCurrentPage(1);
        }}
      />

      {/* Table */}
      <CustomersTable
        customers={filteredCustomers}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onOpenStatement={handleOpenStatement}
        onOpenPayment={handleOpenPayment}
        canManage={canManage}
      />

      {/* Modals */}
      <CustomerModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        customerToEdit={customerToEdit}
      />

      <ReceivePaymentModal
        isOpen={customerForPayment !== null}
        onClose={() => setCustomerForPayment(null)}
        customer={customerForPayment}
      />

      <CustomerStatementModal
        isOpen={customerForStatement !== null}
        onClose={() => setCustomerForStatement(null)}
        customer={customerForStatement}
      />

      <DeleteCustomerModal
        isOpen={customerToDelete !== null}
        onClose={() => setCustomerToDelete(null)}
        customer={customerToDelete}
      />
    </div>
  );
};

export const CustomersPage = Customers;
export default Customers;
