import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().uuid('معرف المنتج غير صالح'),
  productName: z.string().min(1, 'اسم المنتج مطلوب'),
  unitPrice: z.number().min(0, 'سعر الوحدة يجب أن يكون رقماً موجباً'),
  quantity: z.number().int().min(1, 'الكمية يجب أن تكون 1 على الأقل'),
  discount: z.number().min(0, 'الخصم لا يمكن أن يكون سالباً'),
  maxStock: z.number().min(0, 'المخزون غير صالح'),
});

export const checkoutFormSchema = z.object({
  customerId: z.string().nullable().optional(),
  paymentMethod: z.enum(['Cash', 'Credit', 'Mixed'] as const, {
    message: 'يرجى اختيار طريقة الدفع',
  }),
  cashAmount: z.number().min(0, 'المبلغ النقدي يجب أن يكون 0 على الأقل'),
  notes: z.string().max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف').optional().nullable(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
