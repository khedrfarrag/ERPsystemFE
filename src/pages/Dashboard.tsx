import React, { useEffect, useState } from 'react';
import api from '../api/client';
import type {
  DashboardSummary,
  SalesTrend,
  TopProduct,
  SlowMovingProduct,
  LowStockAlert,
  RecentActivity,
  ApiResponse,
} from '../types';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Layers,
  Sparkles,
  PackageX,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trend, setTrend] = useState<SalesTrend | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [slowMoving, setSlowMoving] = useState<SlowMovingProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockAlert[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        sumRes,
        trendRes,
        topRes,
        slowRes,
        lowRes,
        actRes,
      ] = await Promise.allSettled([
        api.get<ApiResponse<DashboardSummary>>('/dashboard/summary'),
        api.get<ApiResponse<SalesTrend>>('/dashboard/sales-trend?days=14'),
        api.get<ApiResponse<TopProduct[]>>('/dashboard/top-products?days=30&limit=5'),
        api.get<ApiResponse<SlowMovingProduct[]>>('/dashboard/slow-moving-products?days=30&limit=10'),
        api.get<ApiResponse<LowStockAlert[]>>('/dashboard/low-stock-alerts?limit=10'),
        api.get<ApiResponse<RecentActivity[]>>('/dashboard/recent-activity?limit=6'),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value.data?.success && sumRes.value.data?.data) {
        setSummary(sumRes.value.data.data);
      }
      if (trendRes.status === 'fulfilled' && trendRes.value.data?.success && trendRes.value.data?.data) {
        setTrend(trendRes.value.data.data);
      }
      if (topRes.status === 'fulfilled' && topRes.value.data?.success && topRes.value.data?.data) {
        setTopProducts(Array.isArray(topRes.value.data.data) ? topRes.value.data.data : []);
      }
      if (slowRes.status === 'fulfilled' && slowRes.value.data?.success && slowRes.value.data?.data) {
        setSlowMoving(Array.isArray(slowRes.value.data.data) ? slowRes.value.data.data : []);
      }
      if (lowRes.status === 'fulfilled' && lowRes.value.data?.success && lowRes.value.data?.data) {
        setLowStock(Array.isArray(lowRes.value.data.data) ? lowRes.value.data.data : []);
      }
      if (actRes.status === 'fulfilled' && actRes.value.data?.success && actRes.value.data?.data) {
        setRecentActivities(Array.isArray(actRes.value.data.data) ? actRes.value.data.data : []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 font-sans" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            لوحة الإحصائيات والمؤشرات المباشرة
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            متابعة دقيقة للأرباح، المبيعات، ومراقبة الراكد والنواقص في المخزن لحظياً
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('retailos:open-tour', { detail: { step: -1 } }))}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-primary-500/20 hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>الجولة الإرشادية للمستخدم</span>
          </button>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={"w-4 h-4 " + (loading ? 'animate-spin' : '')} />
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card border-r-4 border-r-primary-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">مبيعات اليوم</span>
            <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900">
              {(summary?.todaySalesRevenue || 0).toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
              })}{' '}
              ج.م
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
              عدد الفواتير: {summary?.todayOrdersCount || 0}
            </p>
          </div>
        </div>

        <div className="card border-r-4 border-r-emerald-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">صافي الربح اليومي</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-600">
              {(summary?.todayOperatingProfit || 0).toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
              })}{' '}
              ج.م
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
              مجمل الربح: {(summary?.todayGrossProfit || 0).toLocaleString('ar-EG')} ج.م
            </p>
          </div>
        </div>

        <div className="card border-r-4 border-r-rose-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">مصروفات اليوم</span>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-rose-600">
              {(summary?.todayExpenses || 0).toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
              })}{' '}
              ج.م
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">تم خصمها من صافي اليوم</p>
          </div>
        </div>

        <div className="card border-r-4 border-r-indigo-500 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">أرباح الشهر حتى اليوم</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-indigo-600">
              {(summary?.monthToDateOperatingProfit || 0).toLocaleString('ar-EG', {
                minimumFractionDigits: 2,
              })}{' '}
              ج.م
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
              مبيعات الشهر: {(summary?.monthToDateSalesRevenue || 0).toLocaleString('ar-EG')} ج.م
            </p>
          </div>
        </div>
      </div>

      {/* Sales & Profit Chart */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            مؤشر الإيرادات والأرباح (آخر 14 يوم)
          </h2>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-primary-600">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-600"></span>
              المبيعات
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              الربح
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {trend && trend.points && trend.points.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.points}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('ar-EG')} ج.م`, '']}
                  labelFormatter={(label) => `التاريخ: ${label}`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  name="المبيعات"
                />
                <Area
                  type="monotone"
                  dataKey="grossProfit"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProf)"
                  name="الربح"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              لا توجد بيانات كافية للرسم البياني
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            الأكثر مبيعاً هذا الشهر
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {topProducts.length === 0 ? (
              <p className="py-6 text-center text-slate-600 dark:text-slate-300 font-medium text-sm">لا توجد مبيعات مسجلة</p>
            ) : (
              topProducts.map((p) => (
                <div key={p.productId} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.productName}</h4>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                      الكمية المباعة: {p.quantitySold} {p.unitName}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="font-black text-slate-900 dark:text-white text-sm block">
                      {p.totalRevenue.toLocaleString('ar-EG')} ج.م
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">
                      المتبقي بالمخزن: {p.currentStock}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PackageX className="w-5 h-5 text-amber-600" />
              الأصناف الراكدة (رأس مال مجمد)
            </h2>
            <span className="badge badge-warning">لم تبع منذ 30 يوم</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {slowMoving.length === 0 ? (
              <p className="py-6 text-center text-slate-600 dark:text-slate-300 font-medium text-sm">ممتاز! لا توجد بضائع راكدة</p>
            ) : (
              slowMoving.map((p) => (
                <div key={p.productId} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.productName}</h4>
                    <span className="text-xs text-rose-500 font-semibold">
                      راكد منذ {p.daysSinceLastSale} يوم
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="font-black text-amber-600 text-sm block">
                      {p.tiedUpCapital.toLocaleString('ar-EG')} ج.م مجمدة
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                      رصيد المخزن: {p.currentStock} {p.unitName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              تنبيهات نواقص المخزون
            </h2>
            <span className="badge badge-danger">{lowStock.length} أصناف حرجة</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {lowStock.length === 0 ? (
              <p className="py-6 text-center text-slate-600 dark:text-slate-300 font-medium text-sm">المخزون متوفر بالكامل ولا توجد نواقص</p>
            ) : (
              lowStock.map((p) => (
                <div key={p.productId} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.productName}</h4>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                      حد الأمان: {p.minStockLevel} {p.unitName}
                    </span>
                  </div>
                  <div className="text-left">
                    <span
                      className={
                        "font-black text-sm block " +
                        (p.isOutOfStock ? 'text-red-600' : 'text-amber-600')
                      }
                    >
                      {p.isOutOfStock ? 'نفد تماماً (0)' : p.currentStock + ' ' + p.unitName}
                    </span>
                    <span className="text-xs text-rose-500">عجز: {p.deficitQuantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            أحدث الحركات اليومية
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentActivities.length === 0 ? (
              <p className="py-6 text-center text-slate-600 dark:text-slate-300 font-medium text-sm">لا توجد حركات مسجلة مؤخراً</p>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs " +
                        (act.activityType === 'SALE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : act.activityType === 'EXPENSE'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-primary-100 text-primary-700')
                      }
                    >
                      {act.activityType === 'SALE'
                        ? 'بيع'
                        : act.activityType === 'EXPENSE'
                        ? 'صرف'
                        : 'شراء'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{act.description}</p>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
                        {act.performedBy} •{' '}
                        {new Date(act.timestamp).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {act.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = Dashboard;
export default Dashboard;
