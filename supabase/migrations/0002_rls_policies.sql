alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.favorites enable row level security;
alter table public.carts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.availability enable row level security;
alter table public.appointments enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public set row_security = off as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "profiles own read" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update to authenticated using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());
create policy "categories public active read" on public.categories for select using (is_active);
create policy "categories admin read" on public.categories for select to authenticated using (public.is_admin());
create policy "categories admin write" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products public active read" on public.products for select using (is_active);
create policy "products admin read" on public.products for select to authenticated using (public.is_admin());
create policy "products admin write" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "product images public read" on public.product_images for select using (true);
create policy "product images admin write" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "favorites own" on public.favorites for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "carts own" on public.carts for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "orders own read" on public.orders for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "orders own insert" on public.orders for insert to authenticated with check (user_id=auth.uid() and status='request_received');
create policy "orders admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "order items through order read" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_admin())));
create policy "order items through own order insert" on public.order_items for insert to authenticated with check (exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "availability public read" on public.availability for select using (is_active);
create policy "availability admin read" on public.availability for select to authenticated using (public.is_admin());
create policy "availability admin write" on public.availability for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "appointments own read" on public.appointments for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "appointments own insert pending" on public.appointments for insert to authenticated with check (user_id=auth.uid() and status='pending');
create policy "appointments admin update" on public.appointments for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "product media public read" on storage.objects for select using (bucket_id='product-media');
create policy "product media admin insert" on storage.objects for insert to authenticated with check (bucket_id='product-media' and public.is_admin());
create policy "product media admin update" on storage.objects for update to authenticated using (bucket_id='product-media' and public.is_admin()) with check (bucket_id='product-media' and public.is_admin());
create policy "product media admin delete" on storage.objects for delete to authenticated using (bucket_id='product-media' and public.is_admin());

-- Customers may edit only non-privileged profile columns. Role changes stay server/admin controlled.
revoke update on public.profiles from authenticated;
grant update (full_name, phone, updated_at) on public.profiles to authenticated;
