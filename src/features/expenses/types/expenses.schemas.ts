import { z } from 'zod';

export const createExpenseSchema = z.object({
  categoryId: z.string().min(1, 'يرجى اختيار تصنيف المصروف'),
  amount: z.number().min(0.01, 'يجب أن يكون المبلغ أكبر من 0'),
  expenseDate: z.string().min(1, 'يرجى تحديد تاريخ المصروف'),
  paymentMethod: z.enum(['Cash', 'BankTransfer', 'Cheque'] as const, {
    message: 'يرجى اختيار طريقة الدفع',
  }),
  description: z.string().max(500, 'الوصف لا يمكن أن يتجاوز 500 حرف').optional().nullable(),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;

export const createExpenseCategorySchema = z.object({
  name: z.string().min(2, 'اسم التصنيف يجب أن يكون حرفين على الأقل').max(100, 'الاسم طويل جداً'),
  description: z.string().max(300, 'الوصف لا يمكن أن يتجاوز 300 حرف').optional().nullable(),
});

export type CreateExpenseCategoryFormValues = z.infer<typeof createExpenseCategorySchema>;

export const openFloatSchema = z.object({
  amount: z.number().min(0, 'قيمة العهدة لا يمكن أن تكون سالبة'),
  notes: z.string().max(300, 'الملاحظات لا تتجاوز 300 حرف').optional().nullable(),
});

export type OpenFloatFormValues = z.infer<typeof openFloatSchema>;

export const closeRegisterSchema = z.object({
  countedAmount: z.number().min(0, 'المبلغ المعدود لا يمكن أن يكون سالباً'),
  notes: z.string().max(500, 'الملاحظات لا تتجاوز 500 حرف').optional().nullable(),
});

export type CloseRegisterFormValues = z.infer<typeof closeRegisterSchema>;
