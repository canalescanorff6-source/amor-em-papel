/** Data ISO local sempre futura para evitar testes que expiram. */
export function futureDateISO(daysAhead = 14): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
