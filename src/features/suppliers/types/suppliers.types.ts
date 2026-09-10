export interface Representative {
  id: string;
  supplierId: string;
  name: string;
  phone: string;
  notes?: string | null;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  currentBalance: number; // In EGP
  isActive: boolean;
  representatives: Representative[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierListResponse {
  items: Supplier[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  openingBalance?: number | null;
}

export interface UpdateSupplierRequest {
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
}

export interface CreateRepresentativeRequest {
  name: string;
  phone: string;
  notes?: string | null;
}

export interface PurchaseLineItemRequest {
  productId: string;
  quantity: number;
  unitCost: number;
  discount: number;
}

export interface CreatePurchaseRequest {
  supplierId: string;
  invoiceNumber?: string | null;
  purchaseDate: string;
  notes?: string | null;
  items: PurchaseLineItemRequest[];
}

export interface PurchaseLineItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  discount: number;
  subTotal: number;
}

export interface PurchaseResponse {
  id: string;
  supplierId: string;
  supplierName: string;
  purchaseNumber: string;
  invoiceNumber?: string | null;
  purchaseDate: string;
  status: string;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  items: PurchaseLineItemResponse[];
}

export interface PurchaseListResponse {
  items: PurchaseResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AccountStatementItemResponse {
  id: string;
  date: string;
  type: string;
  amount: number;
  runningBalance: number;
  referenceId?: string | null;
  notes?: string | null;
}

export interface AccountStatementResponse {
  partyId: string;
  partyName: string;
  currentBalance: number;
  transactions: AccountStatementItemResponse[];
}

export interface CreatePaymentRequest {
  partyType: 'Supplier';
  supplierId: string;
  amount: number;
  paymentMethod: 'Cash' | 'BankTransfer' | 'Cheque';
  referenceNumber?: string | null;
  notes?: string | null;
}

export interface PaymentResponse {
  id: string;
  partyType: string;
  supplierId?: string | null;
  supplierName?: string | null;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface SupplierFilterParams {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  hasPayables?: boolean;
}
