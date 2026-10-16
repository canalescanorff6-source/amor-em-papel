export function normalizeBrazilPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const normalized = digits.startsWith('55') ? digits : (digits.length === 10 || digits.length === 11 ? `55${digits}` : digits);
  if (!/^55\d{10,11}$/.test(normalized)) throw new Error('Número de WhatsApp brasileiro inválido.');
  return normalized;
}
