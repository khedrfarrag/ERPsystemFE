import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z.string().min(2, 'اسم العميل يجب أن يتكون من حرفين على الأقل'),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, 'رقم الهاتف يجب أن يكون رقم محمول مصري صحيح (11 رقماً يبدأ بـ 010 أو 011 أو 012 أو 015)'),
  address: z.string().optional().nullable(),
  creditLimit: z.number().min(0, 'سقف الائتمان يجب أن يكون 0 أو أكثر').optional().nullable(),
  openingBalance: z.number().min(0, 'الرصيد الافتتاحي لا يمكن أن يكون سالباً').optional().nullable(),
  notes: z.string().max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف').optional().nullable(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;

export const receivePaymentFormSchema = z.object({
  amount: z.number().min(0.5, 'المبلغ يجب أن يكون 0.5 ج.م على الأقل'),
  paymentMethod: z.enum(['Cash', 'BankTransfer', 'Cheque'] as const, {
    message: 'يرجى تحديد طريقة السداد',
  }),
  referenceNumber: z.string().optional().nullable(),
  notes: z.string().max(300, 'الملاحظات يجب ألا تتجاوز 300 حرف').optional().nullable(),
});

export type ReceivePaymentFormData = z.infer<typeof receivePaymentFormSchema>;
