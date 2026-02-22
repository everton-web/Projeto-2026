-- ================================================================
-- WebDesign Hub — Schema completo do Supabase
-- Execute este script no SQL Editor do seu projeto Supabase
-- ================================================================

-- ---------------------------------------------------------------
-- EXTENSÕES
-- ---------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------
-- TABELA: profiles (estende auth.users do Supabase)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('admin', 'subscriber')),
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: cria profile automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------
-- TABELA: clients
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  niche       TEXT NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ---------------------------------------------------------------
-- TABELA: briefing_forms
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.briefing_forms (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id      UUID REFERENCES public.clients(id) ON DELETE SET NULL,  -- opcional
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token          TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  page_type      TEXT NOT NULL DEFAULT 'landing_page'
                   CHECK (page_type IN ('landing_page', 'one_page', 'sales_page')),
  niche_selected TEXT NOT NULL DEFAULT 'Outro',
  niche          TEXT NOT NULL DEFAULT 'Outro',  -- mantido para compatibilidade
  title          TEXT,                            -- titulo interno do WD
  responses      JSONB,
  submitted_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration para projetos existentes (rode se ja tiver o banco criado):
-- ALTER TABLE public.briefing_forms ALTER COLUMN client_id DROP NOT NULL;
-- ALTER TABLE public.briefing_forms ADD COLUMN IF NOT EXISTS page_type TEXT NOT NULL DEFAULT 'landing_page' CHECK (page_type IN ('landing_page','one_page','sales_page'));
-- ALTER TABLE public.briefing_forms ADD COLUMN IF NOT EXISTS niche_selected TEXT NOT NULL DEFAULT 'Outro';
-- ALTER TABLE public.briefing_forms ADD COLUMN IF NOT EXISTS title TEXT;

-- ---------------------------------------------------------------
-- TABELA: generated_copies
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.generated_copies (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id    UUID REFERENCES public.clients(id) ON DELETE SET NULL,  -- opcional
  briefing_id  UUID REFERENCES public.briefing_forms(id) ON DELETE SET NULL,
  type         TEXT NOT NULL CHECK (type IN ('landing_page', 'one_page', 'sales_page')),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABELA: code_snippets (conteúdo gerenciado pelo admin)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.code_snippets (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT,
  code         TEXT NOT NULL,
  language     TEXT NOT NULL DEFAULT 'html',
  category     TEXT NOT NULL,
  tags         TEXT[] DEFAULT '{}',
  is_premium   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABELA: tips
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tips (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  category     TEXT NOT NULL,
  tags         TEXT[] DEFAULT '{}',
  is_premium   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABELA: lessons
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  description       TEXT,
  video_url         TEXT NOT NULL,
  thumbnail_url     TEXT,
  duration_minutes  INTEGER,
  category          TEXT NOT NULL,
  order_index       INTEGER NOT NULL DEFAULT 0,
  is_premium        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABELA: lives
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lives (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  stream_url       TEXT NOT NULL,
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  is_recorded      BOOLEAN NOT NULL DEFAULT FALSE,
  recording_url    TEXT,
  is_premium       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefing_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snippets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lives          ENABLE ROW LEVEL SECURITY;

-- profiles: usuário vê e edita apenas o próprio perfil
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- clients: usuário CRUD apenas nos próprios clientes
DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "clients_delete_own" ON public.clients;
CREATE POLICY "clients_select_own"  ON public.clients FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "clients_insert_own"  ON public.clients FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_update_own"  ON public.clients FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "clients_delete_own"  ON public.clients FOR DELETE  USING (auth.uid() = user_id);

-- briefing_forms: usuario acessa os proprios; acesso publico ao formulario via token (sem auth)
DROP POLICY IF EXISTS "briefings_select_own" ON public.briefing_forms;
DROP POLICY IF EXISTS "briefings_insert_own" ON public.briefing_forms;
DROP POLICY IF EXISTS "briefings_update_own" ON public.briefing_forms;
DROP POLICY IF EXISTS "briefings_public_select" ON public.briefing_forms;
DROP POLICY IF EXISTS "briefings_public_update" ON public.briefing_forms;
CREATE POLICY "briefings_select_own"    ON public.briefing_forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "briefings_insert_own"    ON public.briefing_forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "briefings_update_own"    ON public.briefing_forms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "briefings_public_select" ON public.briefing_forms FOR SELECT USING (true); -- acesso por token publico (anon)
CREATE POLICY "briefings_public_update" ON public.briefing_forms FOR UPDATE USING (true); -- cliente preenche sem auth

-- generated_copies
DROP POLICY IF EXISTS "copies_select_own" ON public.generated_copies;
DROP POLICY IF EXISTS "copies_insert_own" ON public.generated_copies;
DROP POLICY IF EXISTS "copies_delete_own" ON public.generated_copies;
CREATE POLICY "copies_select_own" ON public.generated_copies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "copies_insert_own" ON public.generated_copies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "copies_delete_own" ON public.generated_copies FOR DELETE USING (auth.uid() = user_id);

-- Conteúdo público (todos os autenticados podem ver free; pro filtra no app)
DROP POLICY IF EXISTS "snippets_select_all" ON public.code_snippets;
DROP POLICY IF EXISTS "tips_select_all" ON public.tips;
DROP POLICY IF EXISTS "lessons_select_all" ON public.lessons;
DROP POLICY IF EXISTS "lives_select_all" ON public.lives;
CREATE POLICY "snippets_select_all" ON public.code_snippets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "tips_select_all"     ON public.tips           FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "lessons_select_all"  ON public.lessons        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "lives_select_all"    ON public.lives          FOR SELECT USING (auth.role() = 'authenticated');

-- Admin pode gerenciar todo o conteúdo
DROP POLICY IF EXISTS "snippets_admin" ON public.code_snippets;
DROP POLICY IF EXISTS "tips_admin" ON public.tips;
DROP POLICY IF EXISTS "lessons_admin" ON public.lessons;
DROP POLICY IF EXISTS "lives_admin" ON public.lives;
CREATE POLICY "snippets_admin" ON public.code_snippets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "tips_admin" ON public.tips FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "lessons_admin" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "lives_admin" ON public.lives FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ================================================================
-- DADOS DE EXEMPLO (opcional — remova se preferir começar vazio)
-- ================================================================

INSERT INTO public.code_snippets (title, description, code, language, category, is_premium) VALUES
(
  'Botão CTA com hover animado',
  'Botão de chamada para ação com animação suave no hover',
  '.btn-cta {
  display: inline-flex;
  align-items: center;
  padding: 14px 32px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.6);
}',
  'css',
  'Botões',
  false
),
(
  'Hero Section responsiva',
  'Seção hero com imagem de fundo e texto centralizado',
  '<section class="hero">
  <div class="hero__content">
    <h1 class="hero__title">Transforme sua ideia em realidade</h1>
    <p class="hero__subtitle">Soluções digitais que geram resultados reais</p>
    <a href="#contato" class="btn-cta">Fale conosco</a>
  </div>
</section>',
  'html',
  'Seções',
  false
),
(
  'Grid de cards responsivo',
  'Layout de 3 colunas que se adapta a mobile',
  '.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 40px 0;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}',
  'css',
  'Layouts',
  false
);

INSERT INTO public.tips (title, content, category, is_premium) VALUES
(
  'Use lazy loading em todas as imagens',
  'Adicione o atributo loading="lazy" em todas as tags <img> que não estejam visíveis na tela inicial (above the fold). Isso reduz o tempo de carregamento inicial da página em até 40%, pois o browser só carrega as imagens quando o usuário rola até elas.',
  'Performance',
  false
),
(
  'Comprima imagens antes de subir',
  'Use ferramentas como TinyPNG ou Squoosh para comprimir imagens antes de fazer upload. Uma imagem de 2MB comprimida pode chegar a 200KB sem perda visual perceptível, melhorando drasticamente o PageSpeed Score.',
  'Performance',
  false
),
(
  'Hierarquia visual clara aumenta conversão',
  'A ordem de leitura do usuário segue o padrão F ou Z. Posicione seu CTA principal no final do fluxo natural dos olhos. Títulos grandes, subtítulo médio e corpo menor criam hierarquia que guia o leitor até a ação desejada.',
  'Conversão',
  false
);

-- ---------------------------------------------------------------
-- TABELA: biblioteca_posts
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.biblioteca_posts (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,
  category       TEXT NOT NULL DEFAULT 'Geral',
  tags           TEXT[] DEFAULT '{}',
  cover_url      TEXT,
  published      BOOLEAN NOT NULL DEFAULT false,
  plan_required  TEXT NOT NULL DEFAULT 'basic' CHECK (plan_required IN ('basic', 'pro')),
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABELA: biblioteca_blocks
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.biblioteca_blocks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES public.biblioteca_posts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('text', 'code', 'image', 'video', 'gif', 'svg')),
  content     TEXT,
  file_url    TEXT,
  language    TEXT,
  caption     TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- RLS: biblioteca_posts
-- ---------------------------------------------------------------
ALTER TABLE public.biblioteca_posts ENABLE ROW LEVEL SECURITY;

-- Todos os usuários autenticados podem ler posts publicados
DROP POLICY IF EXISTS "Authenticated users can read published posts" ON public.biblioteca_posts;
DROP POLICY IF EXISTS "Admin can read all posts" ON public.biblioteca_posts;
DROP POLICY IF EXISTS "Admin can insert posts" ON public.biblioteca_posts;
DROP POLICY IF EXISTS "Admin can update posts" ON public.biblioteca_posts;
DROP POLICY IF EXISTS "Admin can delete posts" ON public.biblioteca_posts;

CREATE POLICY "Authenticated users can read published posts"
  ON public.biblioteca_posts
  FOR SELECT
  TO authenticated
  USING (published = true);

-- Admin pode ler todos (incluindo rascunhos)
CREATE POLICY "Admin can read all posts"
  ON public.biblioteca_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode inserir
CREATE POLICY "Admin can insert posts"
  ON public.biblioteca_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode atualizar
CREATE POLICY "Admin can update posts"
  ON public.biblioteca_posts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode deletar
CREATE POLICY "Admin can delete posts"
  ON public.biblioteca_posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------
-- RLS: biblioteca_blocks
-- ---------------------------------------------------------------
ALTER TABLE public.biblioteca_blocks ENABLE ROW LEVEL SECURITY;

-- Usuários autenticados podem ler blocos de posts publicados
DROP POLICY IF EXISTS "Authenticated users can read blocks of published posts" ON public.biblioteca_blocks;
DROP POLICY IF EXISTS "Admin can read all blocks" ON public.biblioteca_blocks;
DROP POLICY IF EXISTS "Admin can insert blocks" ON public.biblioteca_blocks;
DROP POLICY IF EXISTS "Admin can delete blocks" ON public.biblioteca_blocks;

CREATE POLICY "Authenticated users can read blocks of published posts"
  ON public.biblioteca_blocks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.biblioteca_posts
      WHERE id = post_id AND published = true
    )
  );

-- Admin pode ler todos os blocos
CREATE POLICY "Admin can read all blocks"
  ON public.biblioteca_blocks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode inserir blocos
CREATE POLICY "Admin can insert blocks"
  ON public.biblioteca_blocks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode deletar blocos
CREATE POLICY "Admin can delete blocks"
  ON public.biblioteca_blocks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------
-- TABELA: wd_profiles (dados profissionais do Web Designer)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wd_profiles (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name       TEXT NOT NULL,
  cpf_cnpj   TEXT NOT NULL,
  address    TEXT NOT NULL DEFAULT '',
  city       TEXT NOT NULL DEFAULT '',
  state      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.wd_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own wd_profile" ON public.wd_profiles;
CREATE POLICY "Users manage own wd_profile"
  ON public.wd_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------
-- TABELA: contracts (contratos gerados pelo WD)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contracts (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Dados do cliente
  client_name         TEXT NOT NULL,
  client_cpf_cnpj     TEXT NOT NULL DEFAULT '',
  client_address      TEXT NOT NULL DEFAULT '',
  client_city         TEXT NOT NULL DEFAULT '',
  client_state        TEXT NOT NULL DEFAULT '',
  -- Serviço
  service_type        TEXT NOT NULL DEFAULT 'Landing Page',
  service_description TEXT NOT NULL,
  -- Valores
  value               NUMERIC(10,2) NOT NULL,
  entry_value         NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_type        TEXT NOT NULL DEFAULT 'pix_entrada'
                        CHECK (payment_type IN ('pix_entrada','pix_avista','cartao_avista','parcelado_sem_juros','parcelado_com_juros')),
  installments        INTEGER NOT NULL DEFAULT 2,
  payment_terms       TEXT NOT NULL DEFAULT '',
  -- Prazos
  delivery_days       INTEGER NOT NULL DEFAULT 15,
  materials_days      INTEGER NOT NULL DEFAULT 3,
  maintenance_days    INTEGER NOT NULL DEFAULT 7,
  start_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_months     INTEGER NOT NULL DEFAULT 1,
  -- Escopo
  excluded_services   TEXT[] DEFAULT '{}',
  -- Testemunhas
  witness_1           TEXT,
  witness_2           TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration para banco existente:
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS service_type TEXT NOT NULL DEFAULT 'Landing Page';
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS entry_value NUMERIC(10,2) NOT NULL DEFAULT 0;
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS payment_type TEXT NOT NULL DEFAULT 'pix_entrada' CHECK (payment_type IN ('pix_entrada','pix_avista','cartao_avista','parcelado_sem_juros','parcelado_com_juros'));
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS installments INTEGER NOT NULL DEFAULT 2;
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS delivery_days INTEGER NOT NULL DEFAULT 15;
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS materials_days INTEGER NOT NULL DEFAULT 3;
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS maintenance_days INTEGER NOT NULL DEFAULT 7;
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS excluded_services TEXT[] DEFAULT '{}';
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS witness_1 TEXT;
-- ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS witness_2 TEXT;

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own contracts" ON public.contracts;
CREATE POLICY "Users manage own contracts"
  ON public.contracts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
