import { Language } from '../types/index.ts';

export function formatPrice(amount: number, language: Language = 'en'): string {
  const formattedNumber = new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
    maximumFractionDigits: 0,
  }).format(amount);

  if (language === 'ar') {
    return `${formattedNumber} د.إ`;
  }
  return `AED ${formattedNumber}`;
}

export function formatArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (w) => arabicDigits[+w]);
}

export function calculateCartSummary(
  subtotal: number,
  discountPercentage: number = 0,
  deliveryMethod: 'standard' | 'express' | 'pickup' = 'standard'
) {
  const discount = Math.round(subtotal * discountPercentage);
  const discountedSubtotal = subtotal - discount;

  let deliveryFee = 0;
  if (deliveryMethod === 'express') {
    deliveryFee = 350;
  } else if (deliveryMethod === 'pickup') {
    deliveryFee = 0;
  } else {
    // standard: free above 2000 AED
    deliveryFee = discountedSubtotal >= 2000 ? 0 : 150;
  }

  // VAT is 5% in UAE, typically included in luxury pricing or itemized
  const vat = Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + deliveryFee;

  return {
    subtotal,
    discount,
    discountedSubtotal,
    deliveryFee,
    vat,
    total,
    freeDeliveryThreshold: 2000,
    amountNeededForFreeDelivery: Math.max(0, 2000 - discountedSubtotal),
    hasUnlockedFreeDelivery: discountedSubtotal >= 2000,
  };
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ABA-${year}-${randomSuffix}`;
}
