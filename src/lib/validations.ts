import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const productSchema = z.object({
  name: z.string().min(2, 'اسم المنتج مطلوب (حرفين على الأقل)'),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, 'يجب اختيار القسم'),
  unitId: z.string().min(1, 'يجب اختيار وحدة القياس'),
  sellingPrice: z.number().min(0.1, 'سعر البيع يجب أن يكون أكبر من 0'),
  purchaseCost: z.number().min(0, 'سعر الشراء لا يمكن أن يكون سالباً').optional().default(0),
  minStockLevel: z.number().min(1, 'حد الأمان يجب أن يكون 1 على الأقل').default(5),
  initialStock: z.number().min(0, 'الرصيد الأولي لا يمكن أن يكون سالباً').default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const customerSchema = z.object({
  name: z.string().min(2, 'اسم العميل مطلوب'),
  phone: z.string().min(7, 'رقم الهاتف مطلوب'),
  address: z.string().optional(),
  creditLimit: z.number().min(0, 'سقف الائتمان لا يمكن أن يكون سالباً').default(1000),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const expenseSchema = z.object({
  amount: z.number().min(0.5, 'المبلغ يجب أن يكون أكبر من 0'),
  category: z.string().min(1, 'تصنيف المصروف مطلوب'),
  description: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
