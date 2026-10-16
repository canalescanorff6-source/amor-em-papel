export function validateImageFileMeta(file: { type: string; size: number; name: string }): { ok: true } | { ok: false; error: string } {
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowed.has(file.type)) return { ok: false, error: 'Envie JPG, PNG ou WebP.' };
  if (file.size <= 0 || file.size > 5_000_000) return { ok: false, error: 'A imagem deve ter até 5 MB.' };
  if (!file.name.trim()) return { ok: false, error: 'Nome de arquivo inválido.' };
  return { ok: true };
}
