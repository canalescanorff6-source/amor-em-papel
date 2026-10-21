/** Otimização local antes do upload, sem enviar bytes de alta resolução.
 * Protege transparência do PNG e evita SVG/GIF executável ou animado.
 */
export const PHOTO_LIMITS = Object.freeze({
  maxSourceBytes: 12 * 1024 * 1024,
  maxOutputBytes: 2 * 1024 * 1024,
  maxDimension: 1600,
  maxPixels: 25_000_000,
  accepted: ['image/jpeg', 'image/png', 'image/webp'] as const,
});

export type PreparedProductImage = {
  file: File;
  sourceBytes: number;
  width: number;
  height: number;
  optimized: boolean;
};

export function validateProductImage(file: Pick<File, 'type' | 'size'>): string | null {
  if (!PHOTO_LIMITS.accepted.includes(file.type as typeof PHOTO_LIMITS.accepted[number])) {
    return 'Use uma foto JPG, PNG ou WebP. HEIC, SVG e GIF não são aceitos.';
  }
  if (file.size <= 0) return 'O arquivo de imagem está vazio.';
  if (file.size > PHOTO_LIMITS.maxSourceBytes) {
    return 'A imagem original ultrapassa 12 MB. Escolha uma foto menor.';
  }
  return null;
}

export function resizedDimensions(width: number, height: number, max = PHOTO_LIMITS.maxDimension) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Não foi possível identificar as dimensões da foto.');
  }
  if (width * height > PHOTO_LIMITS.maxPixels) {
    throw new Error('Foto grande demais para processamento seguro. Reduza a resolução antes de enviar.');
  }
  const ratio = Math.min(1, max / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) };
}

function loadBrowserImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não foi possível abrir esta imagem.')); };
    image.src = url;
  });
}

function canvasBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, mime, quality));
}

export async function prepareProductImage(file: File): Promise<PreparedProductImage> {
  const validation = validateProductImage(file);
  if (validation) throw new Error(validation);
  const image = await loadBrowserImage(file);
  const sourceSize = file.size;
  const dimensions = resizedDimensions(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('O navegador não permite otimizar imagens neste dispositivo.');

  let best: Blob | null = null;
  for (const scale of [1, 0.82, 0.65]) {
    canvas.width = Math.max(1, Math.round(dimensions.width * scale));
    canvas.height = Math.max(1, Math.round(dimensions.height * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.83, 0.72, 0.58]) {
      // JPEG de fallback para fotos JPEG; PNG mantém transparência
      // quando um navegador antigo não oferece WebP no canvas.
      let blob = await canvasBlob(canvas, 'image/webp', quality);
      if (!blob || blob.type !== 'image/webp') {
        blob = await canvasBlob(canvas, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
      }
      if (blob && blob.size > 0 && (!best || blob.size < best.size)) best = blob;
      if (blob && blob.size <= PHOTO_LIMITS.maxOutputBytes) break;
    }
    if (best && best.size <= PHOTO_LIMITS.maxOutputBytes) break;
  }

  if (!best || best.size > PHOTO_LIMITS.maxOutputBytes) {
    throw new Error('Não foi possível reduzir a foto para 2 MB. Escolha uma imagem menor.');
  }
  if (file.size <= best.size && file.size <= PHOTO_LIMITS.maxOutputBytes &&
      image.naturalWidth <= PHOTO_LIMITS.maxDimension && image.naturalHeight <= PHOTO_LIMITS.maxDimension) {
    return { file, sourceBytes: sourceSize, width: image.naturalWidth, height: image.naturalHeight, optimized: false };
  }
  const ext = best.type === 'image/webp' ? 'webp' : best.type === 'image/png' ? 'png' : 'jpg';
  const basename = file.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '-').slice(0, 45) || 'foto';
  return {
    file: new File([best], `${basename}.${ext}`, { type: best.type, lastModified: Date.now() }),
    sourceBytes: sourceSize,
    width: canvas.width,
    height: canvas.height,
    optimized: true,
  };
}

export function formatFileBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
