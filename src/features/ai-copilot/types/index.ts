export type CopilotAction = 
  | CatalogExportAction 
  | ProductDisambiguationAction
  | ProductConfirmAction;

export interface CatalogExportAction {
  type: 'DOWNLOAD_CATALOG';
  title: string;
  filename: string;
  rows: CatalogItemRow[];
}

export interface ProductDisambiguationAction {
  type: 'DISAMBIGUATE_PRODUCT';
  query: string;
  variants: ProductVariantItem[];
}

export interface ProductVariantItem {
  id: string;
  name: string;
  currentStock: number;
  sellingPrice: number;
  categoryName?: string;
}

export interface CatalogItemRow {
  name: string;
  barcode?: string;
  category: string;
  unit: string;
  sellingPrice: number;
  purchaseCost?: number;
  minStockLevel?: number;
  description?: string;
  wholesalePrice?: number;
  isWholesaleAvailable?: boolean;
}

export interface ProductConfirmAction {
  type: 'CREATE_PRODUCT';
  product: {
    name: string;
    barcode?: string;
    categoryName: string;
    unitName: string;
    sellingPrice: number;
    purchaseCost?: number;
    minStockLevel?: number;
    initialStock?: number;
    wholesalePrice?: number;
    isWholesaleAvailable?: boolean;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  actions?: CopilotAction[];
}

export interface ChatResponse {
  reply: string;
  model: string;
  actions?: CopilotAction[];
}

export interface SendMessagePayload {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  pageContext?: string;
}
