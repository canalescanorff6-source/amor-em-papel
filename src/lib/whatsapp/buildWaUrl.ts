import { normalizeBrazilPhone } from './normalizePhone.ts';

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeBrazilPhone(phone);
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
