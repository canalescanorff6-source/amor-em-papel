import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/supabase/client', () => ({
  supabase: {
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => ({ data: { publicUrl: 'https://example.invalid/' + path } }),
      }),
    },
  },
}));

import { ProductMediaGallery, productPhotos, type ProductPhoto } from '../../src/features/admin/ProductMediaGallery';

const photos: ProductPhoto[] = [
  { id: 'b', product_id: 'p1', storage_path: 'p1/b.webp', alt_text: 'Foto da tampa', sort_order: 10 },
  { id: 'a', product_id: 'p1', storage_path: 'p1/a.webp', alt_text: 'Foto da frente', sort_order: 0 },
  { id: 'c', product_id: 'p2', storage_path: 'p2/c.webp', alt_text: 'Outro produto', sort_order: 0 },
];

describe('galeria de produtos no painel', () => {
  it('isola fotos por produto e coloca a capa conforme a ordem cadastrada', () => {
    expect(productPhotos(photos, 'p1').map(photo => photo.id)).toEqual(['a', 'b']);
    expect(productPhotos(photos, 'p2').map(photo => photo.id)).toEqual(['c']);
    expect(photos[0].id).toBe('b'); // A lista original nunca é mutada.
  });

  it('mostra imagens com texto alternativo e permite definir capa/excluir', async () => {
    const user = userEvent.setup();
    const cover = vi.fn();
    const remove = vi.fn();
    render(<ProductMediaGallery photos={productPhotos(photos, 'p1')} productName="Topo clássico"
      disabled={false} onMakeCover={cover} onDelete={remove} />);
    expect(screen.getByRole('img', { name: 'Foto da frente' })).toBeInTheDocument();
    expect(screen.getByText('Foto de capa')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Definir como capa a foto 2/i }));
    expect(cover).toHaveBeenCalledWith(photos[0]);
    await user.click(screen.getByRole('button', { name: /Remover foto 1/i }));
    expect(remove).toHaveBeenCalledWith(photos[1]);
  });

  it('bloqueia ações enquanto o upload está em andamento', () => {
    render(<ProductMediaGallery photos={productPhotos(photos, 'p1')} productName="Topo clássico"
      disabled={true} onMakeCover={vi.fn()} onDelete={vi.fn()} />);
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  });
});
