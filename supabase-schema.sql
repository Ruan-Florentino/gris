-- Tabela de perfis de usuário
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  plan text default 'FREE' check (plan in ('FREE', 'PRO', 'ENTERPRISE')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text default 'inactive',
  ai_queries_today integer default 0,
  ai_queries_reset_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  primary key (id)
);

-- Habilitar RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Trigger para criar perfil automaticamente
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
