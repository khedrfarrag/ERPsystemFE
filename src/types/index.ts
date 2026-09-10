export type UserRole = 'Owner' | 'Manager' | 'Cashier' | 'InventoryClerk' | 'Merchant';

﻿export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  errors?: string[];
  code?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  storeId: string;
  storeName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface DashboardSummary {
  todaySalesRevenue: number;
  todayOrdersCount: number;
  todayCashSales: number;
  todayCreditSales: number;
  todayGrossProfit: number;
  todayExpenses: number;
  todayOperatingProfit: number;
  monthToDateSalesRevenue: number;
  monthToDateOperatingProfit: number;
  isCashRegisterOpen: boolean;
  liveCashDrawerBalance: number;
  activeRegisterCashierName?: string;
  totalReceivables: number;
  totalPayables: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  grossProfit: number;
  ordersCount: number;
}

export interface SalesTrend {
  totalDays: number;
  totalPeriodRevenue: number;
  totalPeriodProfit: number;
  totalPeriodOrders: number;
  points: SalesTrendPoint[];
}

export interface TopProduct {
  productId: string;
  productName: string;
  barcode?: string;
  unitName: string;
  quantitySold: number;
  totalRevenue: number;
  currentStock: number;
}

export interface SlowMovingProduct {
  productId: string;
  productName: string;
  barcode?: string;
  unitName: string;
  currentStock: number;
  unitCost: number;
  tiedUpCapital: number;
  lastSaleDate?: string;
  daysSinceLastSale: number;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  barcode?: string;
  unitName: string;
  currentStock: number;
  minStockLevel: number;
  deficitQuantity: number;
  isOutOfStock: boolean;
}

export interface RecentActivity {
  id: string;
  activityType: 'SALE' | 'PURCHASE' | 'EXPENSE' | 'PAYMENT';
  referenceNumber: string;
  description: string;
  amount: number;
  timestamp: string;
  performedBy: string;
}

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  categoryId: string;
  categoryName?: string;
  unitId: string;
  unitName?: string;
  sellingPrice: number;
  wholesalePrice?: number;
  isWholesaleAvailable?: boolean;
  purchaseCost?: number;
  minStockLevel?: number;
  currentStock?: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  creditLimit?: number;
  currentBalance?: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  currentBalance?: number;
}
