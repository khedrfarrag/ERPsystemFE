import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { salesApi, CurrentDrawerResponse } from '../api/salesApi';
import { Sale, CreateSaleReturnRequest, SaleReturn } from '../types/sales.types';

export interface SalesFiltersState {
  search: string;
  customerId: string;
  paymentMethod: string;
}

export const useSales = () => {
  const [rawSales, setRawSales] = useState<Sale[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [returnsMap, setReturnsMap] = useState<Record<string, SaleReturn[]>>(() => {
    try {
      const cached = localStorage.getItem('retailos_returns_cache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [filters, setFilters] = useState<SalesFiltersState>({
    search: '',
    customerId: '',
    paymentMethod: '',
  });

  const [currentDrawer, setCurrentDrawer] = useState<CurrentDrawerResponse | null>(null);
  const [isDrawerLoading, setIsDrawerLoading] = useState<boolean>(false);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await salesApi.getSales({
        customerId: filters.customerId || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        pageNumber,
        pageSize,
      });
      setRawSales(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشل في تحميل سجل الفواتير';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters.customerId, filters.paymentMethod, pageNumber, pageSize]);

  const fetchDrawer = useCallback(async () => {
    setIsDrawerLoading(true);
    try {
      const drawer = await salesApi.getCurrentDrawer();
      setCurrentDrawer(drawer);
    } catch {
      setCurrentDrawer(null);
    } finally {
      setIsDrawerLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    fetchDrawer();
  }, [fetchDrawer]);

  const setFilter = useCallback((key: keyof SalesFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPageNumber(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', customerId: '', paymentMethod: '' });
    setPageNumber(1);
  }, []);

  // Enrich sales with local and remote return vouchers
  const enrichedSales = useMemo(() => {
    return rawSales.map((s) => ({
      ...s,
      returns: returnsMap[s.id] || s.returns || [],
    }));
  }, [rawSales, returnsMap]);

  // Client-side search for instantaneous feedback matching invoice number, customer or products
  const filteredSales = useMemo(() => {
    if (!filters.search.trim()) return enrichedSales;
    const term = filters.search.trim().toLowerCase();
    return enrichedSales.filter((s) => {
      const matchesInv = s.invoiceNumber.toLowerCase().includes(term);
      const matchesCust = s.customerName?.toLowerCase().includes(term) ?? false;
      const matchesNotes = s.notes?.toLowerCase().includes(term) ?? false;
      const matchesProduct = s.items.some((i) => i.productName.toLowerCase().includes(term));
      return matchesInv || matchesCust || matchesNotes || matchesProduct;
    });
  }, [enrichedSales, filters.search]);

  const processReturn = async (
    saleId: string,
    data: CreateSaleReturnRequest
  ): Promise<SaleReturn> => {
    try {
      const returnResult = await salesApi.createSaleReturn(saleId, data);
      toast.success(`تم تسجيل المرتجع بنجاح برقم: ${returnResult.returnNumber}`);

      // Update return map in state & localStorage
      const updatedMap = {
        ...returnsMap,
        [saleId]: [...(returnsMap[saleId] || []), returnResult],
      };
      setReturnsMap(updatedMap);
      try {
        localStorage.setItem('retailos_returns_cache', JSON.stringify(updatedMap));
      } catch {
        // quota ignore
      }

      // Refresh sales and cash drawer
      await fetchSales();
      await fetchDrawer();
      return returnResult;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'حدث خطأ أثناء معالجة المرتجع';
      toast.error(msg);
      throw err;
    }
  };

  return {
    sales: filteredSales,
    rawSales: enrichedSales,
    totalCount,
    pageNumber,
    pageSize,
    isLoading,
    error,
    filters,
    currentDrawer,
    isDrawerLoading,
    setFilter,
    resetFilters,
    setPageNumber,
    setPageSize,
    refetchSales: fetchSales,
    refetchDrawer: fetchDrawer,
    processReturn,
  };
};
