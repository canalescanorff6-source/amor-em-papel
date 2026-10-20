import { normalizeBrazilPhone } from './normalizePhone';
export function buildWhatsAppUrl(phoneInput:string, message:string): string {
  const phone=normalizeBrazilPhone(phoneInput);
  if(!phone) throw new Error('WhatsApp inválido. Configure um número brasileiro com DDD.');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
