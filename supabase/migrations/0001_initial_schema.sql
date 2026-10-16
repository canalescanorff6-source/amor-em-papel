-- Amor em Papel V2 initial schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default 'Sparkles',
  accent text not null default 'pink',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  price numeric(12,2) check (price is null or price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= 0),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  stock_status text not null default 'unknown' check (stock_status in ('available','unavailable','unknown')),
  personalizable boolean not null default false,
  customization_fields jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  collections text[] not null default '{}',
  is_demo boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','awaiting_confirmation','confirmed','in_production','ready','delivered','cancelled')),
  customer_name text not null,
  customer_phone text not null,
  receive_type text not null check (receive_type in ('pickup','delivery')),
  delivery_address text not null default '',
  desired_date date,
  notes text not null default '',
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  has_quote_items boolean not null default false,
  whatsapp_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0 and quantity <= 99),
  unit_price numeric(12,2) check (unit_price is null or unit_price >= 0),
  customization jsonb not null default '{}'::jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  weekday integer check (weekday is null or weekday between 0 and 6),
  specific_date date,
  start_time time not null,
  end_time time not null,
  service_type text not null default 'Atendimento geral',
  capacity integer not null default 1 check (capacity = 1),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (specific_date is not null or weekday is not null),
  check (end_time > start_time)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  availability_id uuid references public.availability(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  customer_name text not null,
  customer_phone text not null,
  service_type text not null,
  requested_date date not null,
  requested_time time not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_active_category on public.products(is_active, category_id);
create index if not exists idx_orders_user_created on public.orders(user_id, created_at desc);
create index if not exists idx_appointments_date on public.appointments(requested_date, requested_time);
create unique index if not exists idx_one_professional_confirmed_slot on public.appointments(requested_date, requested_time) where status = 'confirmed';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do update set public = excluded.public;
