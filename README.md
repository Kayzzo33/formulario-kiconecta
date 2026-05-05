# Masterclass Registration System

Sistema completo de inscrição para Masterclass com aprovação manual pelo administrador.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Formatting**: Date-fns

## Configuração do Supabase

1. Crie um novo projeto no [Supabase Dashboard](https://supabase.com).
2. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase/schema.sql` para criar a tabela e configurar as políticas de RLS.
3. Em **Authentication -> Users**, crie um usuário administrador com e-mail e senha.
4. Em **Project Settings -> API**, copie a `Project URL` e a `anon key`.

## Configuração Local

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` na raiz do projeto com base no `.env.local.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   NEXT_PUBLIC_WHATSAPP_LINK_COMUNIDADE=link_do_seu_grupo_whatsapp
   NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER=seu_numero_para_contato
   ```
4. Rode o projeto em desenvolvimento:
   ```bash
   npm run dev
   ```

## Deploy na Vercel

1. Suba o código para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com).
3. Configure as Variáveis de Ambiente (as mesmas do `.env.local`).
4. Clique em Deploy.

## Estrutura de Pastas
- `/src/app`: Rotas e páginas da aplicação.
- `/src/components`: Componentes reutilizáveis (Formulário, Cards, Badges, etc).
- `/src/lib`: Configurações de clientes (Supabase) e utilitários (WhatsApp).
- `/src/types`: Definições de tipos TypeScript.
- `/supabase`: Arquivos de configuração do banco de dados.
