# Design Tokens & UI Data Model: 009-table-hover-dark-contrast

## 1. Table Contrast Design Tokens

| UI Element | Light Mode Token | Dark Mode Token | Min Contrast Ratio |
|---|---|---|---|
| **Table Container** | `bg-white border-slate-200/80` | `dark:bg-slate-800 dark:border-slate-700/80` | $> 12:1$ |
| **Table Header Row (`<thead>`)** | `bg-slate-100 text-slate-800` | `dark:bg-slate-900 dark:text-slate-100` | $> 10:1$ |
| **Table Header Border** | `border-slate-200` | `dark:border-slate-700` | $> 3:1$ |
| **Table Row Default** | `bg-white text-slate-900` | `dark:bg-slate-800 dark:text-white` | $> 12:1$ |
| **Table Row Hover (`:hover`)** | `hover:bg-slate-100/70` | `dark:hover:bg-slate-700/60` | $> 7:1$ |
| **Table Row Secondary Text** | `text-slate-600` | `dark:text-slate-300` | $> 7:1$ |
| **Table Row Muted Text** | `text-slate-500` | `dark:text-slate-400` | $> 4.5:1$ |

## 2. Dashboard Event Card Design Tokens

| Element | Light Mode Token | Dark Mode Token | Min Contrast Ratio |
|---|---|---|---|
| **Activity Event Title** | `text-slate-900 font-bold` | `dark:text-white font-bold` | $> 13:1$ |
| **Activity Subtitle & ID** | `text-slate-600 font-medium` | `dark:text-slate-300 font-medium` | $> 7:1$ |
| **Stock Alert Product Name** | `text-slate-900 font-bold` | `dark:text-white font-bold` | $> 13:1$ |
| **Stock Alert Deficit Tag** | `text-rose-600 font-bold` | `dark:text-rose-400 font-bold` | $> 5:1$ |
