import React, { useState } from 'react';
import { Layers, Ruler, X, Loader2, Plus } from 'lucide-react';
import { useCreateCategoryMutation, useCreateUnitMutation } from '../api/useProductsMutations';

interface CategoryUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'category' | 'unit';
  onSuccess: (id: string) => void;
}

export const CategoryUnitModal: React.FC<CategoryUnitModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [extra, setExtra] = useState(''); // description for category, symbol for unit

  const createCategoryMutation = useCreateCategoryMutation();
  const createUnitMutation = useCreateUnitMutation();

  if (!isOpen) return null;

  const isPending = createCategoryMutation.isPending || createUnitMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (mode === 'category') {
      try {
        const cat = await createCategoryMutation.mutateAsync({
          name: name.trim(),
          description: extra.trim() || null,
        });
        onSuccess(cat.id);
        onClose();
      } catch {}
    } else {
      try {
        const unit = await createUnitMutation.mutateAsync({
          name: name.trim(),
          symbol: extra.trim() || name.trim(),
        });
        onSuccess(unit.id);
        onClose();
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {mode === 'category' ? <Layers className="w-5 h-5 text-emerald-600" /> : <Ruler className="w-5 h-5 text-emerald-600" />}
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              {mode === 'category' ? 'إضافة قسم جديد' : 'إضافة وحدة قياس'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {mode === 'category' ? 'اسم القسم *' : 'اسم الوحدة *'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === 'category' ? 'مثال: معلبات ومجمدات' : 'مثال: كيلو جرام'}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {mode === 'category' ? 'وصف القسم (اختياري)' : 'رمز الوحدة (مثال: كجم) *'}
            </label>
            <input
              type="text"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder={mode === 'category' ? 'وصف للمنتجات التابعة للقسم' : 'كجم، قطعة، لتر'}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required={mode === 'unit'}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>حفظ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
