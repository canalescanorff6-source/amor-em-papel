// Favoritos de visitantes preservam a chave histórica. Logins separados
// não compartilham favoritos por engano em computadores/celulares compartilhados.
const GUEST_KEY = 'amor-em-papel:favorites:v1';

export function getFavoritesStorageKey(userId: string | null = null): string {
  return userId
    ? `amor-em-papel:favorites:user:${encodeURIComponent(userId)}:v1`
    : GUEST_KEY;
}

export function loadFavorites(userId: string | null = null): string[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(getFavoritesStorageKey(userId)) || '[]',
    );
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((value): value is string => typeof value === 'string'))]
      : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[], userId: string | null = null): void {
  try {
    localStorage.setItem(getFavoritesStorageKey(userId), JSON.stringify(ids));
  } catch {
    // O estado continua disponível na sessão mesmo sem localStorage.
  }
}
