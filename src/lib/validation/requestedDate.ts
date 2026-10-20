/**
 * Valida uma data de calendário ISO local sem converter o dia escolhido para UTC.
 * O dia atual é permitido; datas anteriores e inexistentes não são.
 */
export function isRequestedDateValid(value: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 2000 || year > 9999) return false;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) return false;

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return value >= today;
}

export function localTodayISO(now: Date = new Date()): string {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}
