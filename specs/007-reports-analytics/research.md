# Research & Technical Decisions: 007-reports-analytics

## 1. Date Range Preset Calculations
- **Decision**: Provide instantaneous 1-click date presets that compute ISO date strings:
  - **اليوم (Today)**: Start of today (00:00:00) to End of today (23:59:59).
  - **آخر 7 أيام (Last 7 Days)**: 7 days ago to today.
  - **هذا الشهر (This Month)**: 1st day of current month to today.
  - **الشهر الماضي (Last Month)**: 1st day of previous month to last day of previous month.
  - **مخصص (Custom)**: Start & End date pickers.

## 2. Print Optimization Architecture
- **Decision**: Use standard CSS `@media print` rules combined with browser `window.print()`.
- **Styling**: Hide navigation sidebars and interactive action buttons during print, expand full page width, render high-contrast black/white tables, and include store header & report timestamp.

## 3. Client-side vs Server-side CSV Export
- **Decision**: Trigger backend CSV download if supported (`?format=csv`) or format loaded JSON data directly into downloadable UTF-8 CSV with BOM (`\uFEFF`) for Excel Arabic support.
