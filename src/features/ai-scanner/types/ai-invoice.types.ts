export interface DuplicateInvoiceWarning {
  isDuplicate: boolean;
  existingPurchaseId: string;
  existingPurchaseNumber: string;
  existingPurchaseDate: string;
  existingTotalAmount: number;
  isIdentical: boolean;
  warningMessage: string;
}

export interface InvoiceScanLineItem {
  lineNumber: number;
  rawItemName: string;
  barcode: string | null;
  matchedProductId: string | null;
  matchedProductName: string | null;
  isNewProduct: boolean;
  confidenceScore: number;
  categoryName: string;
  unitSymbol: string;
  quantity: number;
  unitCost: number;
  sellingPrice: number | null;
  subTotal: number;
  isCostMissingOrZero: boolean;
  isSellingBelowCost: boolean;
}

export interface InvoiceScanPreviewResponse {
  supplierName: string | null;
  matchedSupplierId: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  totalAmount: number;
  taxAmount: number | null;
  discountAmount: number | null;
  imageTempKey: string | null;
  duplicateWarning: DuplicateInvoiceWarning | null;
  items: InvoiceScanLineItem[];
}

export interface CommitAiInvoiceItemRequest {
  productId: string | null;
  name: string;
  barcode: string | null;
  categoryName: string;
  unitSymbol: string;
  quantity: number;
  unitCost: number;
  sellingPrice: number;
}

export interface CommitAiInvoiceRequest {
  mode: 'Purchase' | 'CatalogOnly';
  supplierName?: string | null;
  supplierId?: string | null;
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  notes?: string | null;
  imageTempKey?: string | null;
  saveToArchive?: boolean;
  allowDuplicateOverride: boolean;
  items: CommitAiInvoiceItemRequest[];
}

export interface CommitAiInvoiceResponse {
  success: boolean;
  message: string;
  purchaseId: string | null;
  purchaseNumber: string | null;
  invoiceImageUrl: string | null;
  productsCreated: number;
  productsUpdated: number;
  inventoryItemsIncreased: number;
  totalProcessedAmount: number;
}

export interface AiInvoiceSettings {
  enableInvoiceArchiving: boolean;
  defaultMarkupPercent: number;
}
