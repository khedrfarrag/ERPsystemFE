import React, { useState, useMemo } from 'react';
import { Package, Layers, AlertCircle, Check, Search } from 'lucide-react';
import { useProductsCatalogQuery, useCategoriesQuery } from '../api/usePosQueries';
import type { PosProduct } from '../types/pos.types';

interface ProductCatalogGridProps {
  onSelectProduct: (product: PosProduct) => void;
  searchQuery: string;
}

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({
  onSelectProduct,
  searchQuery,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoriesQuery();
  const { data: products = [], isLoading: isProductsLoading } = useProductsCatalogQuery(
    searchQuery,
    selectedCategoryId === 'all' ? undefined : selectedCategoryId
  );

  // Filter products by search query locally as well for immediate reactivity
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
      {/* Category Pills Bar */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-850/50 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategoryId === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
          }`}
        >
          جميع الأقسام
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategoryId === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {isProductsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-700/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Package className="w-12 h-12 stroke-[1.2] mb-2 opacity-50" />
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              لا توجد منتجات مطابقة
            </span>
            <span className="text-xs text-slate-400 mt-1">
              جرب تغيير تصنيف البحث أو مسح كلمة البحث
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.currentStock <= 0;
              const isLowStock = p.currentStock > 0 && p.currentStock <= (p.minStockLevel || 5);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => !isOutOfStock && onSelectProduct(p)}
                  disabled={isOutOfStock}
                  className={`flex flex-col justify-between p-3 rounded-2xl border text-right transition-all transform active:scale-95 group ${
                    isOutOfStock
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 hover:shadow-md hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block truncate">
                      {p.categoryName || 'عام'}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-white text-xs leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {p.name}
                    </h4>
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="font-black text-slate-900 dark:text-emerald-400 text-sm font-mono">
                        {p.sellingPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 mr-0.5 font-bold">ج.م</span>
                    </div>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isOutOfStock
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                          : isLowStock
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isOutOfStock ? 'نفد' : `${p.currentStock}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
