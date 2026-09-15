import { CatalogItemRow } from '../types';

/**
 * Official RetailOS Excel/CSV import headers in exact sequence
 */
export const CATALOG_HEADERS = [
  'اسم الصنف (إجباري)',
  'الباركود',
  'الفئة',
  'الوحدة',
  'سعر البيع (إجباري)',
  'سعر التكلفة',
  'الحد الأدنى للمخزون',
  'الوصف',
  'سعر الجملة',
  'متاح جملة (1 أو 0)'
];

/**
 * Escapes CSV field value handling quotes and commas
 */
function escapeCsvValue(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates a UTF-8 CSV string with BOM (\uFEFF) to guarantee Arabic character fidelity in Microsoft Excel.
 */
export function generateCatalogCsv(rows: CatalogItemRow[]): string {
  const headerRow = CATALOG_HEADERS.map(escapeCsvValue).join(',');
  
  const dataRows = rows.map((row) => {
    return [
      escapeCsvValue(row.name),
      escapeCsvValue(row.barcode || ''),
      escapeCsvValue(row.category),
      escapeCsvValue(row.unit || 'قطعة'),
      escapeCsvValue(row.sellingPrice),
      escapeCsvValue(row.purchaseCost ?? ''),
      escapeCsvValue(row.minStockLevel ?? 5),
      escapeCsvValue(row.description || ''),
      escapeCsvValue(row.wholesalePrice ?? ''),
      escapeCsvValue(row.isWholesaleAvailable ? 1 : 0)
    ].join(',');
  });

  // Prepend UTF-8 Byte Order Mark (\uFEFF)
  return '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
}

/**
 * Downloads a generated catalog directly as a .csv file in the user's browser.
 */
export function downloadCatalogCsvFile(filename: string, rows: CatalogItemRow[]): void {
  const csvContent = generateCatalogCsv(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const safeFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
