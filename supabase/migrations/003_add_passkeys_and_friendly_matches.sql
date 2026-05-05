-- ============================================
-- QuadraHub — Migration 003
-- Passkeys (WebAuthn) e Partidas Avulsas
-- ============================================

-- 1. Permitir Partidas Avulsas (championship_id opcional)
ALTER TABLE public.teams ALTER COLUMN championship_id DROP NOT NULL;
ALTER TABLE public.matches ALTER COLUMN championship_id DROP NOT NULL;

-- 2. Tabela de Credenciais WebAuthn (Passkeys)
CREATE TABLE public.passkeys (
  id text PRIMARY KEY, -- Credential ID do WebAuthn
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  public_key bytea NOT NULL,
  counter bigint NOT NULL DEFAULT 0,
  device_type text NOT NULL,
  backed_up boolean NOT NULL DEFAULT false,
  transports text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.passkeys ENABLE ROW LEVEL SECURITY;

-- Usuário pode ver suas próprias credenciais
CREATE POLICY "passkeys_select_own" ON public.passkeys
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Inserções apenas via system (service_role) durante o registro
CREATE POLICY "passkeys_insert_system" ON public.passkeys
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Atualizações do counter apenas via system
CREATE POLICY "passkeys_update_system" ON public.passkeys
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 3. Status de Biometria no Perfil do Atleta
ALTER TABLE public.athlete_profiles ADD COLUMN biometrics_registered boolean NOT NULL DEFAULT false;

-- 4. Tabela de Check-ins Biométricos de Partida
CREATE TABLE public.match_checkins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  verified_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(match_id, user_id)
);

ALTER TABLE public.match_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "match_checkins_select_public" ON public.match_checkins
  FOR SELECT USING (true);

-- Inserção via system (service_role) após validação biométrica
CREATE POLICY "match_checkins_insert_system" ON public.match_checkins
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Index para otimização
CREATE INDEX idx_passkeys_user ON public.passkeys(user_id);
CREATE INDEX idx_match_checkins_match ON public.match_checkins(match_id);

-- Adicionar match_checkins ao realtime para a tela do organizador atualizar ao vivo
ALTER publication supabase_realtime ADD TABLE public.match_checkins;
