import { describe, expect, it } from 'vitest';
import { formatFileBytes, PHOTO_LIMITS, resizedDimensions, validateProductImage } from '../../src/features/admin/imageOptimization';

describe('estúdio de fotos da papelaria', () => {
  it('aceita apenas formatos estáticos suportados e rejeita arquivo perigoso/maior que o limite', () => {
    expect(validateProductImage({ type: 'image/jpeg', size: 100_000 })).toBeNull();
    expect(validateProductImage({ type: 'image/png', size: 100_000 })).toBeNull();
    expect(validateProductImage({ type: 'image/webp', size: 100_000 })).toBeNull();
    for (const type of ['image/svg+xml', 'image/gif', 'image/heic', 'text/html']) {
      expect(validateProductImage({ type, size: 100_000 })).toMatch(/JPG, PNG ou WebP/);
    }
    expect(validateProductImage({ type: 'image/jpeg', size: 0 })).toMatch(/vazio/);
    expect(validateProductImage({ type: 'image/jpeg', size: PHOTO_LIMITS.maxSourceBytes + 1 })).toMatch(/12 MB/);
  });

  it('reduz proporcionalmente sem distorcer nem aumentar fotos pequenas', () => {
    expect(resizedDimensions(3200, 1600)).toEqual({ width: 1600, height: 800 });
    expect(resizedDimensions(900, 1200)).toEqual({ width: 900, height: 1200 });
    expect(resizedDimensions(500, 500)).toEqual({ width: 500, height: 500 });
    expect(resizedDimensions(1800, 3600)).toEqual({ width: 800, height: 1600 });
  });

  it('recusa dimensões desconhecidas e resoluções que podem travar o celular', () => {
    expect(() => resizedDimensions(0, 100)).toThrow(/dimensões/);
    expect(() => resizedDimensions(Infinity, 100)).toThrow(/dimensões/);
    expect(() => resizedDimensions(8000, 8000)).toThrow(/grande demais/);
  });

  it('mostra redução de armazenamento em unidades compreensíveis', () => {
    expect(formatFileBytes(512 * 1024)).toBe('512 KB');
    expect(formatFileBytes(1.5 * 1024 * 1024)).toBe('1.50 MB');
  });
});
