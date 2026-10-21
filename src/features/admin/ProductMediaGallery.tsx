import { Image, Star, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

export type ProductPhoto = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
};

export function photoUrl(storagePath: string): string {
  if (!supabase) return '';
  return supabase.storage.from('product-media').getPublicUrl(storagePath).data.publicUrl;
}

export function productPhotos(photos: ProductPhoto[], productId: string): ProductPhoto[] {
  return photos.filter(photo => photo.product_id === productId)
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
}

type Props = {
  photos: ProductPhoto[];
  productName: string;
  disabled: boolean;
  onMakeCover: (photo: ProductPhoto) => void;
  onDelete: (photo: ProductPhoto) => void;
};

export function ProductMediaGallery({ photos, productName, disabled, onMakeCover, onDelete }: Props) {
  if (!photos.length) return (
    <div className="product-photo-empty"><Image size={18}/> Nenhuma foto cadastrada. Adicione uma imagem para exibir o trabalho no catálogo.</div>
  );
  return <div className="product-photo-gallery" aria-label={'Fotos de ' + productName}>
    {photos.map((photo, index) =>
      <div className="product-photo-tile" key={photo.id}>
        <img src={photoUrl(photo.storage_path)} alt={photo.alt_text || productName} loading="lazy" />
        <div className="product-photo-actions">
          <span className="product-photo-caption">{index === 0 ? 'Foto de capa' : 'Foto ' + (index + 1)}</span>
          {index !== 0 && <button type="button" className="photo-action" disabled={disabled} onClick={() => onMakeCover(photo)}
            aria-label={'Definir como capa a foto ' + (index + 1) + ' de ' + productName}><Star size={14}/> Capa</button>}
          <button type="button" className="photo-action danger" disabled={disabled} onClick={() => onDelete(photo)}
            aria-label={'Remover foto ' + (index + 1) + ' de ' + productName}><Trash2 size={14}/> Excluir</button>
        </div>
      </div>)}
  </div>;
}
