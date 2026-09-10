import api from '../../../api/client';
import {
  Sale,
  SaleListResponse,
  CreateSaleReturnRequest,
  SaleReturn,
} from '../types/sales.types';

export interface GetSalesParams {
  customerId?: string;
  paymentMethod?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CurrentDrawerResponse {
  currentBalance: number;
  lastFloatDate?: string | null;
  lastFloatAmount?: number | null;
  todayInflows: number;
  todayOutflows: number;
}

export const salesApi = {
  getSales: async (params: GetSalesParams = {}): Promise<SaleListResponse> => {
    const res = await api.get('/sales', { params });
    return res.data.data;
  },

  getSaleById: async (id: string): Promise<Sale> => {
    const res = await api.get(`/sales/${id}`);
    return res.data.data;
  },

  createSaleReturn: async (id: string, data: CreateSaleReturnRequest): Promise<SaleReturn> => {
    const res = await api.post(`/sales/${id}/returns`, data);
    return res.data.data;
  },

  getCurrentDrawer: async (): Promise<CurrentDrawerResponse | null> => {
    try {
      const res = await api.get('/cash-register/current');
      return res.data.data;
    } catch {
      return null;
    }
  },
};
