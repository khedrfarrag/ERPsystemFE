# Verification Quickstart Guide: 009-table-hover-dark-contrast

## 1. Live Verification via Chrome DevTools MCP

### Scenario A: Dashboard Dark Mode Text Verification
1. Navigate browser to `http://localhost:5173/`.
2. Verify Dark Mode is active (toggle if necessary).
3. Inspect `h2`, `h4`, and `p` elements under "أحدث الحركات اليومية" and "تنبيهات نواقص المخزون".
4. Check computed color: must be `rgb(255, 255, 255)` or `rgb(241, 245, 249)` with contrast $> 7:1$.
5. Capture screenshot: verify visual clarity without text selection.

### Scenario B: Products Table Header & Hover Verification
1. Navigate browser to `http://localhost:5173/products`.
2. Inspect table header (`<thead>`): must display solid dark background (`rgb(15, 23, 42)` / `slate-900`) with bold white column titles.
3. Simulate hover on a table row (`tr:hover`).
4. Verify computed background color is dark slate (`rgb(51, 65, 85)` / `slate-700/60`) and text remains crisp.
5. Capture screenshot showing hover state in Dark Mode.

### Scenario C: Build Validation
```bash
cd system-FE
npm run build
```
Verify 0 TypeScript and bundling errors.
