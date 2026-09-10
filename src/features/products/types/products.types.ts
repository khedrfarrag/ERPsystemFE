export interface Product {
  id: string;
  name: string;
  barcode?: string;
  categoryId?: string;
  categoryName?: string;
  category?: { id: string; name: string };
  unitId?: string;
  unitName?: string;
  unit?: { id: string; name: string; symbol?: string };
  sellingPrice: number;
  wholesalePrice?: number;
  isWholesaleAvailable?: boolean;
  purchaseCost?: number;
  minStockLevel?: number;
  currentStock?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
}

export interface CreateProductRequest {
  name: string;
  barcode?: string;
  categoryId: string;
  unitId: string;
  purchaseCost: number;
  sellingPrice: number;
  wholesalePrice?: number;
  isWholesaleAvailable?: boolean;
  minStockLevel: number;
  initialStock?: number;
}

export interface UpdateProductRequest {
  name: string;
  barcode?: string;
  categoryId: string;
  unitId: string;
  purchaseCost: number;
  sellingPrice: number;
  wholesalePrice?: number;
  isWholesaleAvailable?: boolean;
  minStockLevel: number;
}

export interface ProductListResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ImportPreviewRow {
  rowNumber: number;
  name: string;
  barcode?: string;
  categoryName?: string;
  unitName?: string;
  purchaseCost: number;
  sellingPrice: number;
  minStockLevel: number;
  isValid: boolean;
  errors: string[];
}

export interface ImportPreviewResponse {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  rows: ImportPreviewRow[];
}

export interface ImportCommitResponse {
  importedCount: number;
  skippedCount: number;
}

export interface ProductFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  inStock?: boolean;
  lowStockOnly?: boolean;
}
