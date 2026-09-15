import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProductsQuery, useCategoriesQuery, useUnitsQuery } from '../features/products/api/useProductsQueries';
import { useToggleProductStatusMutation } from '../features/products/api/useProductsMutations';
import { ProductsHeader } from '../features/products/components/ProductsHeader';
import { ProductsFilterBar } from '../features/products/components/ProductsFilterBar';
import { ProductsTable } from '../features/products/components/ProductsTable';
import { ProductModal } from '../features/products/components/ProductModal';
import { DeleteProductModal } from '../features/products/components/DeleteProductModal';
import { ImportProductsModal } from '../features/products/components/ImportProductsModal';
import { AiInvoiceScanModal } from '../features/ai-scanner/components/AiInvoiceScanModal';
import { ManageCategoriesModal } from '../features/products/components/ManageCategoriesModal';
import type { Product } from '../features/products/types/products.types';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'Owner' || user?.role === 'Manager';

  // Filters State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  // Queries
  const { data: categories = [] } = useCategoriesQuery();
  const { data: units = [] } = useUnitsQuery();

  const { data: productsData, isLoading } = useProductsQuery({
    page: currentPage,
    pageSize,
    search: searchQuery,
    categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    inStock: stockFilter === 'inStock' ? true : undefined,
  });

  const toggleStatusMutation = useToggleProductStatusMutation();

  const products = productsData?.items || [];
  const totalCount = productsData?.totalCount || 0;

  // Filter client-side for low stock / out of stock if needed
  const filteredProducts = useMemo(() => {
    if (stockFilter === 'lowStock') {
      return products.filter((p) => {
        const stock = p.currentStock || 0;
        const min = p.minStockLevel || 0;
        return stock > 0 && stock <= min;
      });
    }
    if (stockFilter === 'outOfStock') {
      return products.filter((p) => (p.currentStock || 0) <= 0);
    }
    return products;
  }, [products, stockFilter]);

  // Compute KPI Counts
  const kpiStats = useMemo(() => {
    let lowStock = 0;
    let outOfStock = 0;

    for (let i = 0; i < products.length; i++) {
      const stock = products[i].currentStock || 0;
      const min = products[i].minStockLevel || 0;
      if (stock <= 0) outOfStock++;
      else if (stock <= min) lowStock++;
    }

    return {
      total: totalCount,
      lowStock,
      outOfStock,
    };
  }, [products, totalCount]);

  const handleOpenAddModal = useCallback(() => {
    setProductToEdit(null);
    setIsAddEditModalOpen(true);
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setProductToEdit(product);
    setIsAddEditModalOpen(true);
  }, []);

  const handleDeleteProduct = useCallback((product: Product) => {
    setProductToDelete(product);
  }, []);

  const handleToggleStatus = useCallback(
    (product: Product) => {
      toggleStatusMutation.mutate({ id: product.id, isActive: !product.isActive });
    },
    [toggleStatusMutation]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <ProductsHeader
        totalCount={kpiStats.total}
        lowStockCount={kpiStats.lowStock}
        outOfStockCount={kpiStats.outOfStock}
        onOpenAddModal={handleOpenAddModal}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenAiScannerModal={() => setIsAiScannerOpen(true)}
        onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        canManage={canManage}
      />

      {/* Filter Bar */}
      <ProductsFilterBar
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
        stockFilter={stockFilter}
        onStockFilterChange={(s) => {
          setStockFilter(s);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(st) => {
          setStatusFilter(st);
          setCurrentPage(1);
        }}
        categories={categories}
      />

      {/* Products Table */}
      <ProductsTable
        products={filteredProducts}
        isLoading={isLoading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleStatus={handleToggleStatus}
        canManage={canManage}
      />

      {/* AI Invoice Scanner Modal */}
      <AiInvoiceScanModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        defaultMode="CatalogOnly"
      />

      {/* Modals */}
      <ProductModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        productToEdit={productToEdit}
        categories={categories}
        units={units}
      />

      <DeleteProductModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        product={productToDelete}
      />

      <ImportProductsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Manage Categories Modal */}
      <ManageCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
      />
    </div>
  );
};

export const ProductsPage = Products;
export default Products;
