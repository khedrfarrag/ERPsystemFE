# Catalog Export & Import Format Contract

**File Formats**: `.csv` (UTF-8 with BOM `\uFEFF`), `.xlsx`
**Sheet Direction**: Right-To-Left (`rtl`)

## Header Specification

| # | Header Title (Arabic) | Type | Required? | Example | Notes |
|---|------------------------|------|-----------|---------|-------|
| 1 | اسم الصنف (إجباري) | string | Yes | مسحوق أريال أوتوماتيك 3 كجم | Product descriptive name |
| 2 | الباركود | string | No | 6221234567890 | Numerical or alphanumeric barcode |
| 3 | الفئة | string | Yes | المساحيق | Auto-mapped or provisioned in Categories |
| 4 | الوحدة | string | Yes | كجم | Unit name or symbol (e.g. قطعة, كرتونة) |
| 5 | سعر البيع (إجباري) | decimal | Yes | 180.00 | Consumer retail price > 0 |
| 6 | سعر التكلفة | decimal | No | 140.00 | Purchasing cost for profit calculations |
| 7 | الحد الأدنى للمخزون | decimal | No | 5.00 | Reorder point alert trigger |
| 8 | الوصف | string | No | مسحوق غسيل عالي الرغوة | Extra product metadata |
| 9 | سعر الجملة | decimal | No | 160.00 | B2B wholesale pricing |
| 10 | متاح جملة (1 أو 0) | integer | No | 1 | 1 for B2B catalog exposure, 0 otherwise |
