export function mergeFavoriteIds(localIds: string[], remoteIds: string[]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const id of [...localIds, ...remoteIds]) {
    if (typeof id === 'string' && id && !seen.has(id)) { seen.add(id); merged.push(id); }
  }
  return merged;
}
