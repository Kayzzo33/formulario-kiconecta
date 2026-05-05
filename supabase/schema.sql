create table public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  telefone text not null,
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'reprovado')),
  created_at timestamp with time zone default now()
);

-- RLS: apenas o admin autenticado pode ler e atualizar
alter table public.inscricoes enable row level security;

create policy "Admin pode tudo" on public.inscricoes
  for all
  using (auth.role() = 'authenticated');

-- Permite INSERT anônimo (para o formulário público funcionar)
create policy "Público pode inserir" on public.inscricoes
  for insert
  with check (true);
-- Tabela para configurações do sistema (ex: link da comunidade)
create table public.configuracoes (
  id text primary key,
  valor text not null
);

insert into public.configuracoes (id, valor) 
values ('whatsapp_link_comunidade', 'https://chat.whatsapp.com/SEU_LINK_AQUI');

-- RLS: Admin pode tudo, Público pode ler as configs
alter table public.configuracoes enable row level security;

create policy "Admin pode tudo" on public.configuracoes
  for all
  using (auth.role() = 'authenticated');

create policy "Público pode ler" on public.configuracoes
  for select
  using (true);

-- NOTA: Para que o painel admin atualize em tempo real, 
-- você deve habilitar o "Realtime" para a tabela 'inscricoes' 
-- no Dashboard do Supabase (Database -> Replication -> Enable Realtime).
