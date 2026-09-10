# Quickstart & Validation Guide: Frontend Core Foundation

## 1. Prerequisites
- Node.js v20+ / v24+
- Backend API running on `http://localhost:5030`

## 2. Launch Development Servers
```bash
# Backend
cd g:\system-analysiss-saas\system-BE
dotnet run --project src/RetailOS.Api

# Frontend
cd g:\system-analysiss-saas\system-FE
npm run dev
```

## 3. Validation Checklist
- [ ] Visit `http://localhost:5173` → Redirects to `/login`.
- [ ] Click "المالك (Owner)" demo button → Form auto-fills → Click "تسجيل الدخول" → Toast pops up → Redirects to Dashboard.
- [ ] Inspect React Query Devtools in development mode to confirm active cache.
- [ ] Click "تسجيل الخروج" in sidebar → Token removed from localStorage → Redirects to `/login`.
