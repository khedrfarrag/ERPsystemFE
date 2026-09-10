import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useExpensesListQuery,
  useExpenseCategoriesQuery,
  useCashRegisterSummaryQuery,
} from '../features/expenses/api/useExpensesQueries';
import { ExpensesHeader } from '../features/expenses/components/ExpensesHeader';
import { ExpensesFilterBar } from '../features/expenses/components/ExpensesFilterBar';
import { ExpensesTable } from '../features/expenses/components/ExpensesTable';
import { RecordExpenseModal } from '../features/expenses/components/RecordExpenseModal';
import { ExpenseCategoryModal } from '../features/expenses/components/ExpenseCategoryModal';
import { OpenFloatModal } from '../features/expenses/components/OpenFloatModal';
import { CloseRegisterModal } from '../features/expenses/components/CloseRegisterModal';
import { CashDrawerHistoryModal } from '../features/expenses/components/CashDrawerHistoryModal';
import type { PaymentMethod } from '../features/expenses/types/expenses.types';

export const Expenses: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'Owner' || user?.role === 'Manager';

  // Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'all' | PaymentMethod>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals State
  const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isOpenFloatOpen, setIsOpenFloatOpen] = useState(false);
  const [isCloseRegisterOpen, setIsCloseRegisterOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Queries
  const { data: categories = [] } = useExpenseCategoriesQuery();
  const { data: registerSummary } = useCashRegisterSummaryQuery();

  const { data: expensesData, isLoading } = useExpensesListQuery({
    pageNumber: currentPage,
    pageSize,
    categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
    from: fromDate ? new Date(fromDate).toISOString() : undefined,
    to: toDate ? new Date(toDate + 'T23:59:59').toISOString() : undefined,
  });

  const rawExpenses = expensesData?.items || [];
  const totalCount = expensesData?.totalCount || 0;

  // Filter client-side for search and payment method if needed
  const filteredExpenses = useMemo(() => {
    return rawExpenses.filter((exp) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        exp.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPayment =
        selectedPaymentMethod === 'all' || exp.paymentMethod === selectedPaymentMethod;

      return matchesSearch && matchesPayment;
    });
  }, [rawExpenses, searchQuery, selectedPaymentMethod]);

  // Aggregate total expenses of current period
  const totalPeriodExpenses = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [filteredExpenses]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPaymentMethod('all');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Header & KPI Metrics */}
      <ExpensesHeader
        totalPeriodExpenses={totalPeriodExpenses}
        registerSummary={registerSummary || null}
        onOpenRecordExpense={() => setIsRecordExpenseOpen(true)}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
        onOpenFloatModal={() => setIsOpenFloatOpen(true)}
        onOpenCloseRegisterModal={() => setIsCloseRegisterOpen(true)}
        onOpenHistoryModal={() => setIsHistoryOpen(true)}
        canManage={canManage}
      />

      {/* Filter Bar */}
      <ExpensesFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setCurrentPage(1);
        }}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={(m) => {
          setSelectedPaymentMethod(m);
          setCurrentPage(1);
        }}
        fromDate={fromDate}
        onFromDateChange={(d) => {
          setFromDate(d);
          setCurrentPage(1);
        }}
        toDate={toDate}
        onToDateChange={(d) => {
          setToDate(d);
          setCurrentPage(1);
        }}
        categories={categories}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* Table */}
      <ExpensesTable
        expenses={filteredExpenses}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <RecordExpenseModal
        isOpen={isRecordExpenseOpen}
        onClose={() => setIsRecordExpenseOpen(false)}
        categories={categories}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
      />

      <ExpenseCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />

      <OpenFloatModal
        isOpen={isOpenFloatOpen}
        onClose={() => setIsOpenFloatOpen(false)}
      />

      <CloseRegisterModal
        isOpen={isCloseRegisterOpen}
        onClose={() => setIsCloseRegisterOpen(false)}
        expectedBalance={registerSummary?.currentBalance ?? 0}
      />

      <CashDrawerHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export const ExpensesPage = Expenses;
export default Expenses;
