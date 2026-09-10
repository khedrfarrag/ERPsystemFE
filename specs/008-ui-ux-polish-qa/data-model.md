# UI Design Tokens & Theme Specification: 008-ui-ux-polish-qa

## Standardized Color Contrast Classes

### 1. Typography Hierarchy
| Role | Light Mode Class | Dark Mode Class | Minimum Contrast |
|---|---|---|---|
| **Page / Section Headings** | `text-slate-900 font-black` | `dark:text-white` | 16:1 |
| **Card Titles / Subheadings** | `text-slate-800 font-bold` | `dark:text-slate-100` | 13:1 |
| **Primary Body / Cell Text** | `text-slate-800 font-medium` | `dark:text-slate-200` | 10:1 |
| **Secondary Descriptions** | `text-slate-600 font-normal` | `dark:text-slate-300` | 7.5:1 |
| **Muted Metadata / Timestamps** | `text-slate-500 font-semibold` | `dark:text-slate-400` | 5:1 |

### 2. Form Inputs & Controls
```css
/* High Contrast Form Input */
input, select, textarea {
  @apply text-slate-900 dark:text-white bg-white dark:bg-slate-800 
         border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold
         placeholder:text-slate-400 dark:placeholder:text-slate-500
         focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500;
}
```

### 3. Financial Status Badges
- **Paid / In Stock / Balanced / Active**: `bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800`
- **Unpaid / Deficit / Out of Stock / Inactive**: `bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800`
- **Credit / Debt / Low Stock / Surplus**: `bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800`
- **Bank / Card Transfer**: `bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800`
- **Valuation / Totals**: `bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800`
