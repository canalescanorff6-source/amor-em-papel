-- Row level security policies
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.appointments enable row level security;
alter table public.availability enable row level security;

create policy "profiles own read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update to authenticated using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy "public active categories" on public.categories for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "admin categories insert" on public.categories for insert to authenticated with check (public.is_admin());
create policy "admin categories update" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin categories delete" on public.categories for delete to authenticated using (public.is_admin());

create policy "public active products" on public.products for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "admin products insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "admin products update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin products delete" on public.products for delete to authenticated using (public.is_admin());

create policy "public active product images" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.is_active = true or public.is_admin())));
create policy "admin product images insert" on public.product_images for insert to authenticated with check (public.is_admin());
create policy "admin product images update" on public.product_images for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin product images delete" on public.product_images for delete to authenticated using (public.is_admin());

create policy "favorites own select" on public.favorites for select to authenticated using (user_id = auth.uid());
create policy "favorites own insert" on public.favorites for insert to authenticated with check (user_id = auth.uid());
create policy "favorites own delete" on public.favorites for delete to authenticated using (user_id = auth.uid());

create policy "orders own select" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "orders own insert" on public.orders for insert to authenticated with check (user_id = auth.uid());
create policy "admin orders update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin orders delete" on public.orders for delete to authenticated using (public.is_admin());

create policy "order items own select" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy "order items own insert" on public.order_items for insert to authenticated with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "admin order items update" on public.order_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin order items delete" on public.order_items for delete to authenticated using (public.is_admin());

create policy "availability public read" on public.availability for select to anon, authenticated using (is_active = true or public.is_admin());
create policy "availability admin insert" on public.availability for insert to authenticated with check (public.is_admin());
create policy "availability admin update" on public.availability for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "availability admin delete" on public.availability for delete to authenticated using (public.is_admin());

create policy "appointments public pending insert" on public.appointments for insert to anon, authenticated with check (status = 'pending' and (user_id is null or user_id = auth.uid()));
create policy "appointments own select" on public.appointments for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "appointments admin update" on public.appointments for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "appointments admin delete" on public.appointments for delete to authenticated using (public.is_admin());

create policy "product media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'product-media');
create policy "product media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and public.is_admin());
create policy "product media admin update" on storage.objects for update to authenticated using (bucket_id = 'product-media' and public.is_admin()) with check (bucket_id = 'product-media' and public.is_admin());
create policy "product media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and public.is_admin());
