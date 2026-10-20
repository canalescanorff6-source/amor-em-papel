import { useEffect, useState } from 'react';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

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

  const refresh = async () => {
    if (!supabase) return;
    const [{ data: products }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id,name').eq('is_active', true).order('sort_order'),
    ]);
    setRows((products ?? []) as Row[]);
    setCategories((cats ?? []) as CategoryRow[]);
  };
  useEffect(() => { refresh(); }, []);

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
  const upload = async (productId: string, file: File) => {
    if (!supabase) return;
    if (!file.type.startsWith('image/')) { setNotice('Selecione uma imagem válida.'); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice('A imagem deve ter no máximo 8 MB.'); return; }
    setNotice('Enviando imagem...');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${productId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('product-media').upload(path, file, { upsert: false, contentType: file.type });
    if (error) { setNotice(error.message); return; }
    const { error: metaError } = await supabase.from('product_images').insert({ product_id: productId, storage_path: path, alt_text: 'Foto do produto' });
    setNotice(metaError?.message ?? 'Imagem enviada com sucesso.');
  };
  const remove = async (row: Row) => {
    if (!supabase) return;
    if (!window.confirm(`Excluir definitivamente “${row.name}”? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', row.id);
    setNotice(error?.message ?? 'Produto excluído.');
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
    {notice && <div className="notice">{notice}</div>}
    <div className="admin-list products-admin-list">{rows.map((product) => <article className="surface" key={product.id}>
      <div><strong>{product.name}</strong><small>{product.is_active ? 'Publicado' : 'Rascunho'} · {product.price_cents === null ? 'Preço sob consulta' : `R$ ${(product.price_cents / 100).toFixed(2)}`}</small></div>
      <label className="upload-label"><Upload size={15}/> Imagem<input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) upload(product.id, file); }} /></label>
      <button className="icon-btn" onClick={() => edit(product)} aria-label={`Editar ${product.name}`}><Pencil size={18}/></button>
      <button className="icon-btn danger" onClick={() => remove(product)} aria-label={`Excluir ${product.name}`}><Trash2 size={18}/></button>
    </article>)}</div>
  </div>;
}
