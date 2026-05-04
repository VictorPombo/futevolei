# QuadraHub - Próximos Passos (Handoff)

Fala time! Este documento foi criado para registrar o estado atual do projeto após a conclusão da **Fase 2**, servindo como guia para o próximo desenvolvedor que assumir a partir da **Fase 3/4**.

## O que já foi feito (Fase 1 e 2 - CONCLUÍDAS)
- **Design e Banco de Dados (Fase 1):** O `dashboard.html` foi validado. O bug de ELO foi corrigido com a migration `002`. As variáveis do Supabase no `.env.local` foram ajustadas para o Next.js.
- **Componentização React (Fase 2):** O painel gigante em HTML já foi fragmentado e movido para a arquitetura do App Router.
  - Criamos as rotas e o Client Component principal em `src/app/(admin)/dashboard`.
  - Instalamos o `lucide-react` e `react-chartjs-2`.
  - A lógica da Calculadora ELO foi totalmente convertida para hooks (`src/components/admin/EloCalculator.tsx`).
  - Todo o CSS base e os efeitos de Glassmorphism foram adicionados ao `src/app/globals.css`.
  - Os dados provisórios estão mockados em `src/lib/mockData.ts`.

---

## Próximo Passo: FASE 3 e 4 - Lógica de Negócio e Conexão de Dados

O próximo desenvolvedor (ou instância do Antigravity) deve plugar os componentes recém-criados com o banco de dados real (Supabase).

### O que fazer agora:
1. **Configurar o Client do Supabase:** 
   Criar a conexão no frontend (`src/lib/supabase.ts`) usando as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. **Substituir o Mock por Dados Reais:**
   - Acesse os componentes em `src/components/admin/Views.tsx` e o Client Principal `DashboardClient.tsx`.
   - Crie queries reais (usando SWR, React Query ou Server Actions) para buscar:
     - Total de Atletas ativos (`users` com role `athlete`).
     - Lista dos Top 10 Atletas.
     - Status dos Campeonatos (`draft`, `open`, `in_progress`).
     - *Atenção:* Por enquanto, os gráficos de crescimento e finanças podem continuar lendo do mockData até que a arquitetura financeira seja finalizada.

3. **Revisar a Regra de Negócio de Pagamentos:**
   Lembrete do PO: O QuadraHub possui 3 planos principais ("Atleta Free", "Atleta Premium", "Organizador Pro"). Certifique-se de que a implementação final de pagamentos reflita apenas essas três modalidades na interface administrativa.

Bora pra cima! 🚀
