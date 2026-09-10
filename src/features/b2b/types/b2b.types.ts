export type B2BOrderStatus = 'Pending' | 'Approved' | 'Invoiced' | 'Rejected' | 'Cancelled';
export type B2BPaymentPreference = 'Cash' | 'Credit' | 'Partial';

export interface Merchant {
  id: string;
  tradeName: string;
  contactPerson: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  creditLimit: number;
  currentBalance: number;
  paymentTerms?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateMerchantRequest {
  tradeName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  password?: string;
  address?: string;
  creditLimit: number;
  paymentTerms?: string;
}

export interface UpdateMerchantRequest {
  tradeName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  paymentTerms?: string;
  isActive: boolean;
}

export interface B2BCatalogProduct {
  id: string;
  name: string;
  barcode?: string | null;
  unitName?: string | null;
  categoryName?: string | null;
  availableStock: number;
  effectiveWholesalePrice: number;
}

export interface B2BOrderItem {
  id: string;
  productId: string;
  productName: string;
  requestedQuantity: number;
  approvedQuantity?: number | null;
  unitWholesalePrice: number;
  requestedSubtotal: number;
  approvedSubtotal?: number | null;
  adjustmentReason?: string | null;
  adjustedAt?: string | null;
  availableStock?: number;
  purchaseCost?: number | null;
}

export interface B2BOrder {
  id: string;
  orderNumber: string;
  merchantId: string;
  merchantTradeName?: string;
  merchantPhone?: string;
  status: B2BOrderStatus;
  paymentPreference: B2BPaymentPreference;
  expectedDownPayment?: number | null;
  discountAmount?: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes?: string | null;
  rejectionReason?: string | null;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  isCreditLimitOverrideUsed: boolean;
  creditLimitOverrideReason?: string | null;
  salesInvoiceId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  items: B2BOrderItem[];
}

export interface CreateB2BOrderRequest {
  paymentPreference: B2BPaymentPreference;
  expectedDownPayment?: number;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface ApproveB2BOrderRequest {
  items: {
    orderItemId: string;
    approvedQuantity: number;
    unitWholesalePrice?: number;
    adjustmentReason?: string;
  }[];
}

export interface InvoiceB2BOrderRequest {
  paidAmount: number;
  paymentMethod: string;
  creditLimitOverrideConfirmed?: boolean;
  creditLimitOverrideReason?: string;
  notes?: string;
}

export interface CancelB2BOrderRequest {
  reason?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  notificationType: string;
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
  payloadJson?: string | null;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
