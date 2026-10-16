import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import {
  deleteAdminProduct,
  listAdminCategories,
  listAdminProducts,
  saveAdminProduct,
  uploadProductImage,
  type AdminProductInput
} from './admin.service';

const empty: AdminProductInput = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  category_id: null,
  price: null,
  compare_at_price: null,
  stock_quantity: null,
  stock_status: 'unknown',
  personalizable: false,
  is_active: true,
  is_demo: false,
  tags: [],
  collections: [],
  customization_fields: []
};

const collectionOptions = [
  ['featured', 'Destaques'],
  ['new', 'Novidades'],
  ['inspiration', 'Inspirações'],
  ['custom', 'Personalizados']
] as const;

const customizationOptions = [
  ['name', 'Nome'],
  ['age', 'Idade'],
  ['theme', 'Tema'],
  ['colors', 'Cores'],
  ['notes', 'Observações']
] as const;

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function ProductsAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [form, setForm] = useState<AdminProductInput>(empty);
  const [message, setMessage] = useState('');

  async function refresh() {
    try {
      const [products, categoryRows] = await Promise.all([listAdminProducts(), listAdminCategories()]);
      setItems(products);
      setCategories(categoryRows as Array<{ id: string; name: string; slug: string }>);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível carregar o painel.');
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('Salvando…');
    try {
      await saveAdminProduct({
        ...form,
        customization_fields: form.personalizable ? form.customization_fields : []
      });
      setForm(empty);
      setMessage('Produto salvo.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao salvar.');
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Excluir este produto? Esta ação não pode ser desfeita.')) return;
    try {
      await deleteAdminProduct(id);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao excluir.');
    }
  }

  async function image(id: string, file?: File) {
    if (!file) return;
    try {
      await uploadProductImage(id, file);
      setMessage('Imagem enviada.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro na imagem.');
    }
  }

  return (
    <div>
      <header className="page-header"><span className="eyebrow">Admin</span><h1>Produtos</h1><p>Cadastre os dados reais que serão exibidos automaticamente no catálogo público.</p></header>

      <form className="admin-form" onSubmit={submit}>
        <Field label="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Field label="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />

        <label className="field">
          <span className="field__label">Categoria</span>
          <select className="field__control" value={form.category_id ?? ''} onChange={(event) => setForm({ ...form, category_id: event.target.value || null })}>
            <option value="">Sem categoria</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>

        <Field label="Descrição curta" value={form.short_description} onChange={(event) => setForm({ ...form, short_description: event.target.value })} />
        <Field label="Descrição" textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <Field label="Preço real (R$)" type="number" min="0" step="0.01" value={form.price ?? ''} onChange={(event) => setForm({ ...form, price: event.target.value === '' ? null : Number(event.target.value) })} />

        <label className="field">
          <span className="field__label">Estoque</span>
          <select className="field__control" value={form.stock_status} onChange={(event) => setForm({ ...form, stock_status: event.target.value as AdminProductInput['stock_status'] })}>
            <option value="unknown">Sob confirmação</option>
            <option value="available">Disponível</option>
            <option value="unavailable">Indisponível</option>
          </select>
        </label>

        <label className="check-filter"><input type="checkbox" checked={form.personalizable} onChange={(event) => setForm({ ...form, personalizable: event.target.checked })} /> Personalizável</label>
        <label className="check-filter"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Ativo</label>

        <fieldset className="admin-options">
          <legend>Vitrines da Home</legend>
          {collectionOptions.map(([value, label]) => (
            <label key={value}><input type="checkbox" checked={form.collections.includes(value)} onChange={() => setForm({ ...form, collections: toggleValue(form.collections, value) })} /> {label}</label>
          ))}
        </fieldset>

        {form.personalizable && (
          <fieldset className="admin-options">
            <legend>Campos de personalização</legend>
            {customizationOptions.map(([value, label]) => (
              <label key={value}><input type="checkbox" checked={form.customization_fields.includes(value)} onChange={() => setForm({ ...form, customization_fields: toggleValue(form.customization_fields, value) })} /> {label}</label>
            ))}
          </fieldset>
        )}

        <Button type="submit">{form.id ? 'Atualizar produto' : 'Cadastrar produto'}</Button>
        {message && <p role="status">{message}</p>}
      </form>

      <div className="admin-table">
        {items.map((item) => (
          <article key={item.id}>
            <div><strong>{item.name}</strong><span>{item.price == null ? 'Sob consulta' : Number(item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
            <div className="admin-row-actions">
              <button onClick={() => setForm({ ...empty, ...item, tags: item.tags ?? [], collections: item.collections ?? [], customization_fields: item.customization_fields ?? [] })}>Editar</button>
              <label>Imagem<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => image(item.id, event.target.files?.[0])} /></label>
              <button className="danger-link" onClick={() => remove(item.id)}>Excluir</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
