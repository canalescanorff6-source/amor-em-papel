import { supabase } from '../../lib/supabase/client';
import { validateImageFileMeta } from './admin.service.logic';

export interface AdminProductInput {
  id?: string;
  category_id?: string | null;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number | null;
  compare_at_price: number | null;
  stock_quantity: number | null;
  stock_status: 'available' | 'unavailable' | 'unknown';
  personalizable: boolean;
  is_active: boolean;
  is_demo: boolean;
  tags: string[];
  collections: string[];
  customization_fields: string[];
}

function requireBackend() {
  if (!supabase) throw new Error('Supabase ainda não configurado.');
  return supabase;
}

export async function listAdminProducts() {
  const db = requireBackend();
  const { data, error } = await db.from('products').select('*, categories(name), product_images(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function saveAdminProduct(input: AdminProductInput) {
  const db = requireBackend();
  const payload = { ...input, id: undefined };
  const query = input.id ? db.from('products').update(payload).eq('id', input.id).select().single() : db.from('products').insert(payload).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function deleteAdminProduct(id: string) {
  const db = requireBackend();
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(productId: string, file: File) {
  const validation = validateImageFileMeta(file);
  if (!validation.ok) throw new Error(validation.error);
  const db = requireBackend();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const storagePath = `${productId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await db.storage.from('product-media').upload(storagePath, file, { cacheControl: '3600', upsert: false });
  if (uploadError) throw uploadError;
  const { error: metaError } = await db.from('product_images').insert({ product_id: productId, storage_path: storagePath, alt_text: file.name, sort_order: 0, is_primary: false });
  if (metaError) throw metaError;
  return db.storage.from('product-media').getPublicUrl(storagePath).data.publicUrl;
}

export async function listAdminOrders() {
  const db = requireBackend();
  const { data, error } = await db.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: string) {
  const db = requireBackend();
  const { error } = await db.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function listAvailability() {
  const db = requireBackend();
  const { data, error } = await db.from('availability').select('*').order('specific_date', { ascending: true }).order('weekday', { ascending: true }).order('start_time', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveAvailability(input: { id?: string; weekday: number | null; specific_date: string | null; start_time: string; end_time: string; service_type: string; capacity: number; is_active: boolean }) {
  const db = requireBackend();
  const payload = { ...input, id: undefined };
  const query = input.id ? db.from('availability').update(payload).eq('id', input.id).select().single() : db.from('availability').insert(payload).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function deleteAvailability(id: string) {
  const db = requireBackend();
  const { error } = await db.from('availability').delete().eq('id', id);
  if (error) throw error;
}
