import { useEffect, useState } from 'react';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { prepareProductImage, formatFileBytes } from './imageOptimization';
import { ProductMediaGallery, productPhotos, type ProductPhoto } from './ProductMediaGallery';

type Row = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  price_cents: number | null;
  compare_at_price_cents: number | null;
  stock: number | null;
  is_personalizable: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_demo: boolean;
  tags: string[];
};
type CategoryRow = { id: string; name: string };
type PendingPhoto = {
  productId: string;
  file: File;
  url: string;
  sourceBytes: number;
  width: number;
  height: number;
};

const emptyDraft: Omit<Row, 'id'> = {
  category_id: null,
  name: '',
  slug: '',
  description: '',
  price_cents: null,
  compare_at_price_cents: null,
  stock: null,
  is_personalizable: true,
  is_active: false,
  is_featured: false,
  is_best_seller: false,
  is_new: true,
  is_demo: false,
  tags: [],
};

const slugify = (value: string) => value
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function ProductsAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [draft, setDraft] = useState<Omit<Row, 'id'>>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [photos, setPhotos] = useState<ProductPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);
  const [preparingId, setPreparingId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingPhoto | null>(null);

  // A URL temporária existe somente enquanto a prévia está visível.
  useEffect(() => () => {
    if (pending) URL.revokeObjectURL(pending.url);
  }, [pending]);

  const refresh = async () => {
    if (!supabase) { setLoading(false); return; }
    const [{ data: products, error: productsError },
      { data: cats, error: categoriesError },
      { data: images, error: imagesError }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id,name').eq('is_active', true).order('sort_order'),
      supabase.from('product_images').select('id,product_id,storage_path,alt_text,sort_order').order('sort_order'),
    ]);
    setLoading(false);
    if (productsError || categoriesError || imagesError) {
      setNotice('Não foi possível atualizar produtos e fotos. Verifique a conexão e tente novamente.');
      return;
    }
    setRows((products ?? []) as Row[]);
    setCategories((cats ?? []) as CategoryRow[]);
    setPhotos((images ?? []) as ProductPhoto[]);
  };
  useEffect(() => { void refresh(); }, []);

  const set = <K extends keyof Omit<Row, 'id'>>(key: K, value: Omit<Row, 'id'>[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };
  const edit = (row: Row) => {
    const { id, ...rest } = row;
    setEditingId(id);
    setDraft(rest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { setEditingId(null); setDraft(emptyDraft); };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft.name.trim()) return;
    const payload = {
      ...draft,
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    };
    const result = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload);
    if (result.error) { setNotice(result.error.message); return; }
    setNotice(editingId ? 'Produto atualizado.' : 'Produto criado como rascunho.');
    reset();
    await refresh();
  };
  const selectPhoto = async (productId: string, file: File) => {
    if (preparingId || busyPhotoId) return;
    setNotice('');
    setPending(null);
    setPreparingId(productId);
    try {
      const optimized = await prepareProductImage(file);
      const url = URL.createObjectURL(optimized.file);
      setPending({
        productId, file: optimized.file, url, sourceBytes: optimized.sourceBytes,
        width: optimized.width, height: optimized.height,
      });
      setNotice('Imagem preparada. Confira a prévia e confirme o envio.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível preparar esta imagem.');
    } finally {
      setPreparingId(null);
    }
  };

  const confirmPhoto = async () => {
    if (!supabase || !pending || busyPhotoId) return;
    const selected = pending;
    setBusyPhotoId(selected.productId);
    setNotice('Enviando imagem otimizada...');
    const ext = selected.file.type === 'image/webp' ? 'webp'
      : selected.file.type === 'image/png' ? 'png' : 'jpg';
    const path = selected.productId + '/' + crypto.randomUUID() + '.' + ext;
    try {
      const { error: storageError } = await supabase.storage.from('product-media')
        .upload(path, selected.file, { upsert: false, contentType: selected.file.type, cacheControl: '31536000' });
      if (storageError) throw new Error('Falha ao enviar a imagem. Nenhuma foto foi cadastrada.');
      const product = rows.find(row => row.id === selected.productId);
      const order = productPhotos(photos, selected.productId);
      const sort = order.length ? Math.max(...order.map(p => p.sort_order)) + 10 : 0;
      const { error: metaError } = await supabase.from('product_images').insert({
        product_id: selected.productId,
        storage_path: path,
        alt_text: product?.name ?? 'Foto de produto personalizado',
        sort_order: sort,
      });
      if (metaError) {
        const cleanup = await supabase.storage.from('product-media').remove([path]);
        throw new Error(cleanup.error
          ? 'Falha no cadastro da foto e na limpeza do arquivo. Verifique o Storage.'
          : 'Falha no cadastro da foto; o arquivo enviado foi removido.');
      }
      setPending(null);
      setNotice('Foto cadastrada! Arquivo enviado: ' + formatFileBytes(selected.file.size) +
        ' (original: ' + formatFileBytes(selected.sourceBytes) + ').');
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível cadastrar a imagem.');
    } finally {
      setBusyPhotoId(null);
    }
  };

  const makeCover = async (photo: ProductPhoto) => {
    if (!supabase || busyPhotoId) return;
    setBusyPhotoId(photo.product_id);
    try {
      const list = productPhotos(photos, photo.product_id);
      const firstOrder = Math.min(...list.map(p => p.sort_order));
      const { error } = await supabase.from('product_images')
        .update({ sort_order: firstOrder - 1 }).eq('id', photo.id);
      if (error) throw new Error('Não foi possível definir a foto de capa.');
      setNotice('Foto principal atualizada.');
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Falha ao alterar a capa.');
    } finally {
      setBusyPhotoId(null);
    }
  };

  const removePhoto = async (photo: ProductPhoto) => {
    if (!supabase || busyPhotoId) return;
    if (!window.confirm('Remover esta foto do catálogo?')) return;
    setBusyPhotoId(photo.product_id);
    try {
      // Remover metadados primeiro evita cartões que apontem para uma foto inexistente.
      const { error } = await supabase.from('product_images').delete().eq('id', photo.id);
      if (error) throw new Error('Não foi possível excluir a foto do catálogo.');
      const { error: storageError } = await supabase.storage.from('product-media').remove([photo.storage_path]);
      setNotice(storageError
        ? 'A foto foi removida do catálogo, mas o arquivo precisa de limpeza no Storage.'
        : 'Foto removida do catálogo e do armazenamento.');
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível excluir a foto.');
    } finally {
      setBusyPhotoId(null);
    }
  };

  const remove = async (row: Row) => {
    if (!supabase) return;
    if (!window.confirm(`Excluir definitivamente “${row.name}”? Esta ação não pode ser desfeita.`)) return;
    const paths = productPhotos(photos, row.id).map(photo => photo.storage_path);
    const { error } = await supabase.from('products').delete().eq('id', row.id);
    if (error) { setNotice('Não foi possível excluir este produto: ' + error.message); return; }
    // O banco exclui os metadados por cascade. Os objetos exigem limpeza separada.
    const cleanup = paths.length ? await supabase.storage.from('product-media').remove(paths) : null;
    setNotice(cleanup?.error
      ? 'Produto excluído, mas algumas fotos precisam de limpeza no Storage.'
      : 'Produto e fotos excluídos.');
    await refresh();
  };

  return <div className="admin-panel">
    <form className="surface product-editor" onSubmit={save}>
      <div className="editor-title"><div><span className="eyebrow">{editingId ? 'Editar' : 'Novo'}</span><h2>{editingId ? 'Atualizar produto' : 'Cadastrar produto'}</h2></div>{editingId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancelar edição</button>}</div>
      <label>Nome<input value={draft.name} required onChange={(e) => set('name', e.target.value)} /></label>
      <label>Slug<input value={draft.slug} onChange={(e) => set('slug', e.target.value)} placeholder="Gerado automaticamente se vazio" /></label>
      <label className="full">Descrição<textarea rows={4} value={draft.description} onChange={(e) => set('description', e.target.value)} /></label>
      <label>Categoria<select value={draft.category_id ?? ''} onChange={(e) => set('category_id', e.target.value || null)}><option value="">Sem categoria</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Preço real (R$)<input inputMode="decimal" value={draft.price_cents === null ? '' : (draft.price_cents / 100).toFixed(2)} onChange={(e) => set('price_cents', e.target.value ? Math.round(Number(e.target.value.replace(',', '.')) * 100) : null)} /></label>
      <label>Preço anterior (R$)<input inputMode="decimal" value={draft.compare_at_price_cents === null ? '' : (draft.compare_at_price_cents / 100).toFixed(2)} onChange={(e) => set('compare_at_price_cents', e.target.value ? Math.round(Number(e.target.value.replace(',', '.')) * 100) : null)} /></label>
      <label>Estoque<input type="number" min="0" value={draft.stock ?? ''} onChange={(e) => set('stock', e.target.value === '' ? null : Number(e.target.value))} /></label>
      <label className="full">Tags (separadas por vírgula)<input value={draft.tags.join(', ')} onChange={(e) => set('tags', e.target.value.split(','))} /></label>
      <div className="editor-checks full">
        {[['is_personalizable','Personalizável'],['is_featured','Destaque'],['is_best_seller','Mais vendido'],['is_new','Novidade'],['is_active','Publicado']].map(([key,label]) => <label key={key}><input type="checkbox" checked={Boolean(draft[key as keyof typeof draft])} onChange={(e) => set(key as keyof Omit<Row,'id'>, e.target.checked as never)} /> {label}</label>)}
      </div>
      <button className="btn btn-primary full">{editingId ? 'Salvar alterações' : 'Cadastrar produto'}</button>
    </form>
    <p className="admin-photo-hint">Fotos JPG, PNG ou WebP (até 12 MB na origem). O navegador reduz a imagem para até 1600 px e 2 MB antes do envio. Fotos e preços reais devem ser conferidos pela loja.</p>
    {notice && <div className="notice" role="status" aria-live="polite">{notice}</div>}
    {loading && <div className="notice" role="status">Carregando produtos e fotos...</div>}
    <div className="admin-list products-admin-list">
      {rows.map(product => {
        const itemPhotos = productPhotos(photos, product.id);
        return <article className="surface" key={product.id}>
          <div className="product-admin-summary">
            <strong>{product.name}</strong>
            <small>{product.is_active ? 'Publicado' : 'Rascunho'} · {product.price_cents === null ? 'Preço sob consulta' : 'R$ ' + (product.price_cents / 100).toFixed(2)} · {itemPhotos.length} foto(s)</small>
          </div>
          <label className="upload-label" aria-label={'Selecionar foto para ' + product.name}>
            <Upload size={15}/> {preparingId === product.id ? 'Preparando...' : 'Adicionar foto'}
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busyPhotoId !== null || preparingId !== null}
              onChange={event => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = '';
                if (file) void selectPhoto(product.id, file);
              }} />
          </label>
          <button className="icon-btn" disabled={busyPhotoId !== null} onClick={() => edit(product)}
            aria-label={'Editar ' + product.name}><Pencil size={18}/></button>
          <button className="icon-btn danger" disabled={busyPhotoId !== null} onClick={() => void remove(product)}
            aria-label={'Excluir ' + product.name}><Trash2 size={18}/></button>
          {pending?.productId === product.id && <div className="product-photo-preview" role="region" aria-label="Conferência antes do envio">
            <img src={pending.url} alt={'Prévia da foto para ' + product.name}/>
            <div><strong>Conferir imagem</strong><small>{pending.width} × {pending.height} px · {formatFileBytes(pending.file.size)} (original: {formatFileBytes(pending.sourceBytes)})</small>
              <div className="photo-preview-actions">
                <button type="button" className="btn btn-primary" disabled={busyPhotoId !== null} onClick={() => void confirmPhoto()}>Confirmar envio</button>
                <button type="button" className="btn btn-ghost" disabled={busyPhotoId !== null} onClick={() => setPending(null)}>Cancelar</button>
              </div>
            </div>
          </div>}
          <div className="product-photo-gallery-wrap">
            <ProductMediaGallery photos={itemPhotos} productName={product.name} disabled={busyPhotoId !== null}
              onMakeCover={photo => void makeCover(photo)} onDelete={photo => void removePhoto(photo)}/>
          </div>
        </article>;
      })}
    </div>
    {!loading && !rows.length && <div className="notice">Nenhum produto cadastrado. Utilize o formulário acima para começar.</div>}
  </div>;
}
