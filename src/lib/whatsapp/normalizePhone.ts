/**
 * Converte contatos brasileiros em formato internacional para wa.me.
 * Aceita celular/telefone fixo com DDD (10 ou 11 dígitos), com +55 opcional.
 * Um telefone inválido nunca deve gerar link de atendimento.
 */
export function normalizeBrazilPhone(input: string): string {
  const trimmed = input.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed) || (trimmed.startsWith('+') && !trimmed.startsWith('+55'))) return '';
  const digits = trimmed.replace(/\D/g, '');
  let national: string;
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    national = digits.slice(2);
  } else if (digits.length === 10 || digits.length === 11) {
    national = digits;
  } else {
    return '';
  }
  const ddd = Number(national.slice(0, 2));
  const subscriber = national.slice(2);
  if (ddd < 11 || ddd > 99 || /^(\d)\1+$/.test(subscriber)) return '';
  return `55${national}`;
}
