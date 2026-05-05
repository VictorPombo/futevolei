'use client';

import dynamic from 'next/dynamic';
import { DATA } from '@/lib/mockData';
import { KpiCard } from './KpiCard';
import { EloCalculator } from './EloCalculator';

const GrowthChart = dynamic(() => import('./Charts').then(mod => mod.GrowthChart), { ssr: false });
const StatusDonut = dynamic(() => import('./Charts').then(mod => mod.StatusDonut), { ssr: false });
const LevelsDonut = dynamic(() => import('./Charts').then(mod => mod.LevelsDonut), { ssr: false });
const RevenueBars = dynamic(() => import('./Charts').then(mod => mod.RevenueBars), { ssr: false });
// const RevenueLines = dynamic(() => import('./Charts').then(mod => mod.RevenueLines), { ssr: false });
// const StatesBar = dynamic(() => import('./Charts').then(mod => mod.StatesBar), { ssr: false });

export function OverviewView() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-[var(--admin-danger-bg)] border border-[rgba(239,68,68,0.3)] text-[#fca5a5] p-4 rounded-lg flex items-start gap-3 text-sm">
        <strong>⚠️ 4 ações urgentes:</strong> Bug em produção (ELO não processa wins/losses) · 2 disputas pendentes · Política de privacidade ausente · 2 organizadores sem verificação.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Atletas Ativos" value={DATA.plataforma.atletasTotal} trend={`↑ +${DATA.crescimentoMensal[DATA.crescimentoMensal.length-1].atletas - DATA.crescimentoMensal[DATA.crescimentoMensal.length-2].atletas}% vs mês anterior`} trendColor="success" />
        <KpiCard title="Campeonatos Ativos" value={DATA.plataforma.campeonatosAtivos} trend="+4 este mês" trendColor="info" />
        <KpiCard title="Receita Atual" value={`R$ ${DATA.plataforma.receita},00`} trend="⚠️ Sem cobrança configurada" trendColor="danger" borderColor="rgba(239,68,68,0.3)" />
        <KpiCard title="Score LGPD" value={`${DATA.plataforma.lgpdScore}%`} trend="Risco Alto" trendColor="warning" borderColor="rgba(245,158,11,0.3)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-3d rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold mb-5 text-[var(--admin-text)]">Crescimento de Atletas</h3>
          <div className="h-[300px] w-full"><GrowthChart /></div>
        </div>
        <div className="card-3d rounded-2xl p-6">
          <h3 className="text-base font-semibold mb-5 text-[var(--admin-text)]">Status do Sistema</h3>
          <ul className="space-y-3 mb-6 text-sm">
            <li className="flex items-center gap-3"><span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-[var(--admin-success-bg)] text-[var(--admin-success)]">✓</span> BD Supabase: Online</li>
            <li className="flex items-center gap-3"><span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-[var(--admin-success-bg)] text-[var(--admin-success)]">✓</span> Autenticação: OK</li>
            <li className="flex items-center gap-3"><span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-[var(--admin-danger-bg)] text-[var(--admin-danger)]">✗</span> Bug ELO: RPC ausente</li>
          </ul>
          <div className="h-[150px] w-full flex justify-center"><StatusDonut /></div>
        </div>
      </div>
    </div>
  );
}

export function FinanceView() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-[var(--admin-warning-bg)] border border-[rgba(245,158,11,0.3)] text-[#fcd34d] p-4 rounded-lg flex items-start gap-3 text-sm">
        <strong>Alerta:</strong> {DATA.plataforma.atletasTotal} atletas, {DATA.plataforma.campeonatosAtivos} campeonatos, R$0 de receita. Cada mês sem cobrança = oportunidade perdida.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-3d rounded-2xl p-6 text-center flex flex-col">
          <h3 className="text-[var(--admin-text2)] text-base font-semibold">Atleta Free</h3>
          <div className="font-syne text-4xl font-bold my-4 text-[var(--admin-text)]">R$ 0</div>
          <ul className="text-left text-sm space-y-3 flex-1 mb-6">
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Perfil e rating ELO</li>
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Ranking público</li>
            <li className="flex gap-2"><span className="text-[var(--admin-danger)]">✗</span> Notificações push</li>
          </ul>
          <button className="w-full py-2 rounded-lg border border-[var(--admin-border)] text-sm font-medium hover:bg-white/5 transition-colors text-[var(--admin-text)]">Plano Padrão</button>
        </div>
        
        <div className="card-3d rounded-2xl p-6 text-center border-[var(--admin-primary)] scale-100 lg:scale-105 shadow-[0_0_30px_rgba(232,131,58,0.1)] flex flex-col relative z-10 bg-[rgba(22,22,42,0.8)]">
          <div className="absolute top-3 right-3 bg-[var(--admin-primary-glow)] text-[var(--admin-primary)] border border-[rgba(232,131,58,0.2)] px-2 py-1 rounded-full text-[10px] font-bold">MAIS POPULAR</div>
          <h3 className="text-[var(--admin-primary)] text-base font-semibold">Atleta Premium</h3>
          <div className="font-syne text-4xl font-bold my-4 text-[var(--admin-text)]">R$ 29<span className="text-sm text-[var(--admin-text2)]">/mês</span></div>
          <ul className="text-left text-sm space-y-3 flex-1 mb-6">
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Tudo do Free</li>
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Notificações push</li>
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Estatísticas avançadas</li>
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Histórico completo ELO</li>
          </ul>
          <button className="w-full py-2 rounded-lg bg-[var(--admin-primary)] text-white text-sm font-medium hover:bg-[#d4732e] hover:shadow-[0_0_15px_rgba(232,131,58,0.2)] transition-all">Lançar Plano</button>
        </div>

        <div className="card-3d rounded-2xl p-6 text-center flex flex-col">
          <h3 className="text-[var(--admin-text2)] text-base font-semibold">Organizador Pro</h3>
          <div className="font-syne text-4xl font-bold my-4 text-[var(--admin-text)]">R$ 99<span className="text-sm text-[var(--admin-text2)]">/mês</span></div>
          <ul className="text-left text-sm space-y-3 flex-1 mb-6">
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Campeonatos ilimitados</li>
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Cobrança automatizada</li>
            <li className="flex gap-2"><span className="text-[var(--admin-success)]">✓</span> Selo verificado</li>
          </ul>
          <button className="w-full py-2 rounded-lg border border-[var(--admin-border)] text-sm font-medium hover:bg-white/5 transition-colors text-[var(--admin-text)]">Ver Detalhes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-3d rounded-2xl p-6">
          <h3 className="text-base font-semibold mb-5 text-[var(--admin-text)]">Projeção de Receita (6 Meses)</h3>
          <div className="h-[300px] w-full"><RevenueBars /></div>
        </div>
      </div>
    </div>
  );
}

export function AthletesView() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total de Atletas" value={DATA.plataforma.atletasTotal} trend={`+${DATA.plataforma.atletasNovos30dias} este mês`} trendColor="success" />
        <KpiCard title="Profissional (1600+)" value={DATA.niveis.profissional.count} trend={`${DATA.niveis.profissional.pct}% do total`} trendColor="primary" />
        <KpiCard title="Amador A (1400+)" value={DATA.niveis.amadorA.count} trend={`${DATA.niveis.amadorA.pct}% do total`} trendColor="warning" />
        <KpiCard title="Amador B (1200+)" value={DATA.niveis.amadorB.count} trend={`${DATA.niveis.amadorB.pct}% do total`} trendColor="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-3d rounded-2xl p-6 overflow-x-auto">
          <h3 className="text-base font-semibold mb-5 text-[var(--admin-text)]">Top 10 Ranking Nacional</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b border-[var(--admin-border)] text-sm font-medium text-[var(--admin-text2)]">#</th>
                <th className="p-3 border-b border-[var(--admin-border)] text-sm font-medium text-[var(--admin-text2)]">Atleta</th>
                <th className="p-3 border-b border-[var(--admin-border)] text-sm font-medium text-[var(--admin-text2)]">Nível</th>
                <th className="p-3 border-b border-[var(--admin-border)] text-sm font-medium text-[var(--admin-text2)]">Rating</th>
              </tr>
            </thead>
            <tbody>
              {DATA.topAtletas.map((a, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border-b border-white/5 text-sm">{i===0?'🥇':i===1?'🥈':i===2?'🥉':a.pos}</td>
                  <td className="p-3 border-b border-white/5 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[var(--admin-card2)] border border-[var(--admin-border2)] flex items-center justify-center text-[10px] font-bold text-[var(--admin-primary)]">
                        {a.iniciais}
                      </div>
                      <span className="text-[var(--admin-text)]">{a.nome}</span>
                      <span className="text-xs text-[var(--admin-text2)]">{a.cidade.split(',')[1].trim()}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b border-white/5 text-sm">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      a.nivel === 'Profissional' ? 'bg-[var(--admin-primary-glow)] text-[var(--admin-primary)] border border-[rgba(232,131,58,0.2)]' :
                      'bg-[var(--admin-warning-bg)] text-[var(--admin-warning)] border border-[rgba(245,158,11,0.2)]'
                    }`}>{a.nivel}</span>
                  </td>
                  <td className="p-3 border-b border-white/5 text-sm font-dm-mono">
                    <span className="text-[var(--admin-text)]">{a.rating}</span>
                    <span className={`text-[10px] ml-2 ${a.delta > 0 ? 'text-[var(--admin-success)]' : a.delta < 0 ? 'text-[var(--admin-danger)]' : 'text-[var(--admin-text2)]'}`}>
                      {a.delta > 0 ? `▲${a.delta}` : a.delta < 0 ? `▼${Math.abs(a.delta)}` : '='}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="space-y-6">
          <div className="card-3d rounded-2xl p-6">
            <h3 className="text-base font-semibold mb-5 text-[var(--admin-text)]">Distribuição por Nível ELO</h3>
            <div className="flex gap-6 items-center">
              <div className="h-[180px] w-[180px] shrink-0"><LevelsDonut /></div>
              <div className="flex-1 flex flex-col justify-center gap-2 text-xs">
                {Object.entries(DATA.niveis).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1 text-[var(--admin-text)]">
                      <span className="capitalize">{key.replace('amador', 'Amador ')}</span>
                      <span>{val.count} ({val.pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[var(--admin-border)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${val.pct}%`, backgroundColor: val.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <EloCalculator />
        </div>
      </div>
    </div>
  );
}

export function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="animate-fade-in card-3d rounded-2xl p-12 text-center text-[var(--admin-text2)]">
      Conteúdo de {title} (Em construção conforme as seções principais)
    </div>
  );
}
