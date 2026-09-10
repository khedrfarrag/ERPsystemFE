export type SalePaymentMethod = 'Cash' | 'Credit' | 'Mixed';

export type SaleStatus = 'Completed' | 'PartiallyReturned' | 'FullyReturned' | 'Cancelled';

export type RefundMethod = 'Cash' | 'Credit';

export interface SaleLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  subTotal: number;
  totalCost: number;
}

export interface SaleReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  subTotal: number;
  totalCost: number;
}

export interface SaleReturn {
  id: string;
  saleId: string;
  returnNumber: string;
  returnDate: string;
  totalAmount: number;
  totalCost: number;
  refundMethod: RefundMethod;
  reason: string;
  items: SaleReturnItem[];
}

export interface Sale {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  invoiceNumber: string;
  saleDate: string;
  status: string;
  paymentMethod: SalePaymentMethod;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  cashAmount: number;
  creditAmount: number;
  totalCost: number;
  notes?: string | null;
  createdAt: string;
  items: SaleLineItem[];
  returns?: SaleReturn[];
}

export interface SaleListResponse {
  items: Sale[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface SaleReturnItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateSaleReturnRequest {
  reason: string;
  refundMethod: RefundMethod;
  items: SaleReturnItemRequest[];
}

export interface ReturnFormItemState {
  productId: string;
  productName: string;
  unitPrice: number;
  purchasedQty: number;
  previouslyReturnedQty: number;
  returnableQty: number;
  selectedQty: number;
  isSelected: boolean;
}
