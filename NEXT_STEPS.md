# QuadraHub - Próximos Passos (Handoff)

Fala time! Este documento foi criado para registrar o estado atual do projeto após a conclusão da **Fase 1**, servindo como guia para o próximo desenvolvedor que assumir a **Fase 2**.

## O que foi feito até agora (Fase 1)
- **Design System Validado:** O arquivo estático `dashboard.html` na raiz do projeto está completo. Ele é nossa fonte da verdade visual (dark tech, glassmorphism, layouts) para o painel de controle administrativo.
- **Correção Crítica no Supabase:** Foi criada e aplicada a migration `002_add_increment_match_stats.sql` para adicionar a RPC que faltava, consertando o bug de ELO (vitórias/derrotas que não atualizavam).
- **Ajustes de Ambiente:** O `.env.local` teve as chaves atualizadas de `EXPO_PUBLIC_` para `NEXT_PUBLIC_` para rodar corretamente no web Next.js.

---

## Próximo Passo: FASE 2 - Componentização do Dashboard

O próximo desenvolvedor deve converter o protótipo `dashboard.html` em uma aplicação funcional no Next.js (App Router).

### 1. Instalar Dependências Ausentes
Antes de iniciar, instale as bibliotecas necessárias para os gráficos e ícones:
```bash
npm install lucide-react react-chartjs-2 chart.js
```

### 2. Estrutura de Componentes
Desacople o `dashboard.html` e crie os componentes em `src/components/admin/`:
- `Sidebar.tsx` e `Header.tsx` (Use ícones do `lucide-react`)
- `KpiCard.tsx` (Componente base para indicadores)
- `EloCalculator.tsx` (Converter a lógica de JS puro do HTML para React states com `useState`/`useEffect`)
- `FinanceModule.tsx` e `LgpdModule.tsx`

*Dica:* Para os gráficos do Chart.js, utilize o `react-chartjs-2` com Lazy Loading (`next/dynamic`) para garantir que a página não fique pesada.

### 3. Página Central do Admin
- Crie a rota `src/app/(admin)/dashboard/page.tsx` importando e agrupando todos os módulos acima.
- Por enquanto, crie um arquivo `src/lib/mockData.ts` contendo o objeto `DATA` (que está no final do arquivo `dashboard.html`) para popular a UI sem precisar integrar com o Supabase nesta etapa.

### 4. Dúvida Pendente (A confirmar com PO)
- No HTML constam os planos "Atleta Free", "Atleta Premium" e "Organizador Pro". O prompt de requisitos mencionava um plano "Equipe Parceira" (sem página de captura). Validar se este plano substitui o Organizador Pro ou se é um plano extra antes de implementar.

Bora pra cima! 🚀
