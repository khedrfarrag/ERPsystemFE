import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertTriangle,
  Package,
  Power,
  Info,
} from 'lucide-react';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} from '../api/useProductsMutations';
import type { Category } from '../types/products.types';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // New category form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Delete confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Mutations
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const toggleStatusMutation = useUpdateCategoryStatusMutation();
  const deleteMutation = useDeleteCategoryMutation();

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  if (!isOpen) return null;

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await createMutation.mutateAsync({
        name: newName.trim(),
        description: newDesc.trim() || null,
      });
      setNewName('');
      setNewDesc('');
      setIsAddFormOpen(false);
    } catch {
      // Handled in mutation toast
    }
  };

  // Start Editing
  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDesc(category.description || '');
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDesc('');
  };

  // Save Edit
  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateMutation.mutateAsync({
        id,
        name: editName.trim(),
        description: editDesc.trim() || null,
      });
      cancelEditing();
    } catch {
      // Handled in mutation toast
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = (category: Category) => {
    toggleStatusMutation.mutate({
      id: category.id,
      isActive: !(category.isActive ?? true),
    });
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteMutation.mutateAsync(categoryToDelete.id);
      setCategoryToDelete(null);
    } catch {
      // Handled in mutation toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  إدارة أقسام وفئات المنتجات
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {categories.length} قسم
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تعديل، حذف، أو تفعيل أقسام المنتجات لتنظيم المخزن ونقاط البيع
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar (Search & Add Toggle) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم القسم أو الوصف..."
              className="w-full pr-10 pl-4 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isAddFormOpen
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            {isAddFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddFormOpen ? 'إلغاء الإضافة' : 'إضافة قسم جديد'}</span>
          </button>
        </div>

        {/* Inline Add Category Form */}
        {isAddFormOpen && (
          <form
            onSubmit={handleAddCategory}
            className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 animate-fade-in"
          >
            <div className="text-xs font-black text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إنشاء قسم جديد</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم القسم <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: منظفات ومعطرات"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصف القسم (اختياري)
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="وصف مختصر لمحتويات القسم"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || !newName.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-sm disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>حفظ القسم</span>
              </button>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 p-2 sm:p-4">
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {searchQuery ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد أقسام مسجلة بعد'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                اضغط على زر "إضافة قسم جديد" للبدء في تنظيم منتجاتك
              </p>
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const isEditing = editingId === cat.id;
              const productCount = cat.productCount ?? 0;
              const isActive = cat.isActive ?? true;

              if (isEditing) {
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-800/60 my-1 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          اسم القسم <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          autoFocus
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          الوصف
                        </label>
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg"
                      >
                        إلغاء
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        disabled={updateMutation.isPending || !editName.trim()}
                        className="flex items-center gap-1 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50"
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        <span>حفظ التعديل</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-750/50 rounded-2xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-extrabold ${
                            isActive
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400 dark:text-slate-500 line-through'
                          }`}
                        >
                          {cat.name}
                        </h4>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {isActive ? 'نشط' : 'معطل'}
                        </span>

                        {/* Product count badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            productCount > 0
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                          title={
                            productCount > 0
                              ? `يحتوي على ${productCount} صنف مسجل`
                              : 'لا يحتوي على أي أصناف حالياً'
                          }
                        >
                          <Package className="w-3 h-3" />
                          <span>{productCount} صنف</span>
                        </span>
                      </div>

                      {cat.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Toggle Active / Inactive */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat)}
                      title={isActive ? 'تعطيل هذا القسم' : 'تفعيل هذا القسم'}
                      className={`p-2 rounded-xl transition-colors ${
                        isActive
                          ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                          : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => startEditing(cat)}
                      title="تعديل اسم أو وصف القسم"
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      title={
                        productCount > 0
                          ? `تحذير: يحتوي على ${productCount} منتج مسجل`
                          : 'حذف القسم نهائياً'
                      }
                      className={`p-2 rounded-xl transition-colors ${
                        productCount > 0
                          ? 'text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>الأقسام التي تحتوي على منتجات لا يمكن حذفها مباشرة لحماية البيانات.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl w-full max-w-md p-6 overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white text-center mb-1">
              تأكيد حذف القسم
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 text-center mb-4">
              هل أنت متأكد من رغبتك في حذف القسم{' '}
              <strong className="text-rose-600 dark:text-rose-400">
                "{categoryToDelete.name}"
              </strong>
              ؟
            </p>

            {(categoryToDelete.productCount ?? 0) > 0 ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs mb-5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">تحذير أمني:</span>
                  يوجد{' '}
                  <strong className="font-mono font-black">
                    {categoryToDelete.productCount}
                  </strong>{' '}
                  منتج مسجل بهذا القسم. لن يقبل النظام الحذف إلا بعد إعادة تعيين قسم آخر لتلك
                  المنتجات أولاً، أو يمكنك تعطيل القسم بدلاً من حذفه.
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 text-center mb-5">
                هذا القسم لا يحتوي على أي منتجات حالياً، وسيتم حذفه من قاعدة البيانات بأمان.
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-600/25 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>تأكيد الحذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
