/**
 * Normalizes a phone number to E.164 digits format (without the leading '+')
 * suitable for the wa.me URL scheme.
 * Defaults to Egypt (+20) if a local 01xxxxxxxxx number is passed.
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');

  // If local Egyptian mobile starting with 01 (11 digits: 01xxxxxxxxx)
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '2' + digits; // prepend country code 20 -> 201xxxxxxxxx
  }

  // If already starts with 00, replace with nothing
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  return digits;
}

/**
 * Builds a direct WhatsApp Click-to-Chat URI with a pre-composed, URL-encoded message.
 * Pure URL protocol; requires NO external APIs, paid tokens, or webhooks.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = normalizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  
  if (!cleanPhone) {
    return `https://wa.me/?text=${encodedText}`;
  }
  
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Builds a friendly Arabic WhatsApp message for B2B wholesale order communication.
 */
export function buildOrderWhatsAppUrl(
  phone: string,
  orderNumber: string,
  tradeName?: string,
  status?: string,
  totalAmount?: number,
  paymentPref?: string
): string {
  const statusArabic =
    status === 'Pending'
      ? 'قيد المراجعة والتدقيق'
      : status === 'Approved'
      ? 'تمت المراجعة والاعتماد'
      : status === 'Invoiced'
      ? 'تم إصدار الفاتورة وجاري التجهيز والشحن'
      : status === 'Rejected'
      ? 'نعتذر، تم رفض الطلب'
      : 'قيد المتابعة';

  const lines = [
    `مرحباً ${tradeName || 'عزيزنا التاجر'}،`,
    `بخصوص طلب التوريد رقم: #${orderNumber}`,
    `حالة الطلب الحالية: ${statusArabic}`,
  ];

  if (totalAmount !== undefined && totalAmount > 0) {
    lines.push(`إجمالي المبلغ: ${totalAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`);
  }

  if (paymentPref) {
    const prefArabic =
      paymentPref === 'Cash'
        ? 'نقداً'
        : paymentPref === 'Credit'
        ? 'آجل (على الحساب)'
        : 'دفعة مقدمة + آجل';
    lines.push(`طريقة السداد: ${prefArabic}`);
  }

  lines.push('شكراً لتعاملكم معنا ونسعد بخدمتكم دائماً.');

  return buildWhatsAppUrl(phone, lines.join('\n'));
}
