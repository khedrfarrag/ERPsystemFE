import { z } from 'zod';

export const supplierFormSchema = z.object({
  name: z.string().min(2, 'اسم المورد أو الشركة مطلوب'),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, 'رقم الهاتف يجب أن يكون رقم محمول مصري صحيح (11 رقماً)'),
  address: z.string().optional().nullable(),
  openingBalance: z.number().min(0, 'الرصيد الافتتاحي لا يمكن أن يكون سالباً').optional().nullable(),
  notes: z.string().max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف').optional().nullable(),
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;

export const representativeFormSchema = z.object({
  name: z.string().min(2, 'اسم المندوب مطلوب'),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, 'رقم الهاتف يجب أن يكون 11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015'),
  notes: z.string().max(300, 'الملاحظات يجب ألا تتجاوز 300 حرف').optional().nullable(),
});

export type RepresentativeFormData = z.infer<typeof representativeFormSchema>;

export const disbursePaymentFormSchema = z.object({
  amount: z.number().min(0.5, 'المبلغ يجب أن يكون 0.5 ج.م على الأقل'),
  paymentMethod: z.enum(['Cash', 'BankTransfer', 'Cheque'] as const, {
    message: 'يرجى تحديد طريقة السداد',
  }),
  referenceNumber: z.string().optional().nullable(),
  notes: z.string().max(300, 'الملاحظات يجب ألا تتجاوز 300 حرف').optional().nullable(),
});

export type DisbursePaymentFormData = z.infer<typeof disbursePaymentFormSchema>;
