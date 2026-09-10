export type PaymentMethod = 'Cash' | 'Credit' | 'Mixed';

export interface PosProduct {
  id: string;
  name: string;
  barcode?: string;
  categoryId: string;
  categoryName?: string;
  unitId?: string;
  unitName?: string;
  sellingPrice: number;
  currentStock: number;
  minStockLevel?: number;
  isActive?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  barcode?: string;
  unitName?: string;
  unitPrice: number;
  quantity: number;
  discount: number; // In EGP
  maxStock: number;
  total: number; // (unitPrice * quantity) - discount
}

export interface CustomerCreditInfo {
  id: string;
  name: string;
  phone: string;
  address?: string;
  currentBalance: number; // Existing debt in EGP
  creditLimit: number;    // Maximum allowable debt ceiling in EGP
}

export interface SaleLineItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CreateSaleRequestPayload {
  customerId?: string | null;
  paymentMethod: PaymentMethod;
  cashAmount: number;
  notes?: string | null;
  items: SaleLineItemRequest[];
}

export interface SaleLineItemResponse {
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

export interface SaleResponseData {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  invoiceNumber: string;
  saleDate: string;
  status: string;
  paymentMethod: PaymentMethod;
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  cashAmount: number;
  creditAmount: number;
  totalCost: number;
  notes?: string | null;
  createdAt: string;
  items: SaleLineItemResponse[];
}

export interface CartTotals {
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  grandTotal: number;
  itemCount: number;
  totalUnits: number;
}
