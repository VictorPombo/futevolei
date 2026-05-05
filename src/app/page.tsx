import Link from "next/link";

import { Leaf, Circle, CircleDot, Disc, Star, Flame, BarChart3, Trophy, Fingerprint, Users, LayoutDashboard, Zap, ArrowRight } from "lucide-react";

const LEVELS = [
  { name: "Aprendiz", range: "0–799", color: "#6B7280", Icon: Leaf },
  { name: "Iniciante", range: "800–999", color: "#22C55E", Icon: Circle },
  { name: "Amador C", range: "1.0k–1.2k", color: "#3B82F6", Icon: CircleDot },
  { name: "Amador B", range: "1.2k–1.4k", color: "#8B5CF6", Icon: Disc },
  { name: "Amador A", range: "1.4k–1.6k", color: "#F59E0B", Icon: Star },
  { name: "Pro", range: "1600+", color: "#F43F5E", Icon: Flame },
];

const RANKING = [
  { pos: 1, name: "Victor Pombo", rating: 1542, delta: "+28", level: "Amador A", lc: "#F59E0B", w: 47, l: 11 },
  { pos: 2, name: "Rafael Duarte", rating: 1387, delta: "+12", level: "Amador B", lc: "#8B5CF6", w: 39, l: 13 },
  { pos: 3, name: "Lucas Ferreira", rating: 1245, delta: "-8", level: "Amador B", lc: "#8B5CF6", w: 31, l: 17 },
  { pos: 4, name: "André Costa", rating: 1102, delta: "+15", level: "Amador C", lc: "#3B82F6", w: 22, l: 13 },
  { pos: 5, name: "Thiago Mendes", rating: 1051, delta: "+4", level: "Amador C", lc: "#3B82F6", w: 18, l: 14 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: "var(--color-bg)" }}>

      {/* ── BG Gradient Mesh ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[10%] w-[70vw] h-[70vw] rounded-full opacity-[0.07] animate-float"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.6), transparent 60%)" }} />
        <div className="absolute bottom-[-20%] right-[5%] w-[50vw] h-[50vw] rounded-full opacity-[0.05] animate-float"
          style={{ background: "radial-gradient(circle, rgba(244,63,94,0.6), transparent 60%)", animationDelay: "-3s" }} />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 animate-fade-in" style={{ background: "rgba(8,8,10,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Quadra<span className="gradient-text">Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors" style={{ color: "var(--color-text-secondary)" }}>
              Entrar
            </Link>
            <Link href="/cadastro" className="btn-primary text-sm font-bold px-5 py-2 rounded-lg">
              Criar conta
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">

        {/* ═══════════════════════════════════
            HERO — Full width, edge to edge
        ═══════════════════════════════════ */}
        <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left: Copy */}
              <div className="animate-slide-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-6"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#F59E0B" }} />
                  Futevôlei competitivo
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-5">
                  O futevôlei{" "}
                  <span className="gradient-text-alt">agora tem ranking.</span>
                </h1>

                <p className="text-base sm:text-lg font-light leading-relaxed mb-8 max-w-lg" style={{ color: "var(--color-text-secondary)" }}>
                  Ranking ELO, campeonatos automatizados, verificação biométrica
                  e estatísticas em tempo real para atletas e organizadores.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/cadastro" className="btn-primary px-7 py-3 rounded-xl text-sm inline-flex items-center gap-2">
                    Começar agora <ArrowRight size={18} strokeWidth={2.5} />
                  </Link>
                  <Link href="/ranking" className="btn-ghost px-7 py-3 rounded-xl text-sm">
                    Ver Ranking Live
                  </Link>
                </div>

                {/* Micro stats */}
                <div className="flex gap-8 mt-10 pt-8 border-t border-white/5">
                  {[
                    { v: "6", l: "Faixas de nível" },
                    { v: "K=32", l: "Precisão ELO" },
                    { v: "1.5×", l: "Bônus oficial" },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="text-xl font-black font-mono gradient-text">{s.v}</div>
                      <div className="text-[11px] font-medium mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Live Ranking Card */}
              <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
                <div className="glass-card rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-3 flex items-center justify-between border-b border-white/5" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B" }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#22C55E" }} />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest ml-1" style={{ color: "var(--color-text-muted)" }}>RANKING</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
                      <span className="text-[10px] font-mono" style={{ color: "#22C55E" }}>LIVE</span>
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="p-3 space-y-1.5">
                    {RANKING.map((p) => (
                      <div key={p.pos} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.03]"
                        style={p.pos === 1 ? { background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" } : { border: "1px solid transparent" }}>
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black shrink-0"
                          style={{
                            background: p.pos === 1 ? "linear-gradient(135deg, #F59E0B, #D97706)" : p.pos === 2 ? "rgba(245,158,11,0.12)" : p.pos === 3 ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.04)",
                            color: p.pos === 1 ? "#000" : p.pos === 2 ? "#F59E0B" : p.pos === 3 ? "#A855F7" : "var(--color-text-muted)",
                          }}>
                          {p.pos}
                        </span>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{ background: `${p.lc}12`, color: p.lc, border: `1px solid ${p.lc}25` }}>
                          {p.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{p.name}</div>
                          <div className="text-[10px] font-medium" style={{ color: p.lc }}>{p.level}</div>
                        </div>
                        <span className="hidden sm:block text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>{p.w}W/{p.l}L</span>
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-sm">{p.rating}</div>
                          <div className="text-[10px] font-bold" style={{ color: p.delta.startsWith("+") ? "#22C55E" : "#EF4444" }}>{p.delta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FEATURES — 3 col grid, wider
        ═══════════════════════════════════ */}
        <section className="py-16 sm:py-24" style={{ background: "rgba(255,255,255,0.01)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Tudo que a areia <span className="gradient-text">precisava</span>
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Ferramentas profissionais para levar o futevôlei a sério.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { Icon: BarChart3, title: "Ranking ELO", desc: "Algoritmo adaptado para duplas. Cada partida recalcula seu rating com base na força real do adversário.", accent: "#F59E0B" },
                { Icon: Trophy, title: "Campeonatos", desc: "Grupos, mata-mata ou eliminação direta. O sistema gera tudo automaticamente — até 24 duplas.", accent: "#F43F5E" },
                { Icon: Fingerprint, title: "Biometria", desc: "Verificação de identidade por biometria. Sem contas falsas, sem manipulação de ranking.", accent: "#38BDF8" },
                { Icon: Users, title: "Sistema de níveis", desc: "6 faixas: de Aprendiz até Profissional. Seu desempenho define onde você está.", accent: "#22C55E" },
                { Icon: LayoutDashboard, title: "Painel de gestão", desc: "Organizadores criam torneios, gerenciam duplas e lançam placares num só lugar.", accent: "#A855F7" },
                { Icon: Zap, title: "Tempo real", desc: "Resultados, ranking e estatísticas atualizados instantaneamente após cada partida.", accent: "#FBBF24" },
              ].map((f, i) => (
                <div key={i} className="card-3d rounded-xl p-5 group cursor-default">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${f.accent}10`, color: f.accent, border: `1px solid ${f.accent}18` }}>
                      <f.Icon />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] mb-1">{f.title}</h3>
                      <p className="text-[13px] font-light leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            LEVELS — Full width strip
        ═══════════════════════════════════ */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
              {/* Left text */}
              <div className="lg:w-1/3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                  Faixas de{" "}
                  <span className="gradient-text-alt">classificação</span>
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  Seu rating ELO define sua faixa. Cada vitória te aproxima do próximo nível.
                  Campeonatos oficiais dão 1.5× mais pontos.
                </p>
              </div>

              {/* Right: level cards */}
              <div className="lg:w-2/3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {LEVELS.map((lv) => (
                  <div key={lv.name} className="text-center py-4 px-2 rounded-xl transition-all duration-200 hover:scale-105 cursor-default"
                    style={{ background: `${lv.color}08`, border: `1px solid ${lv.color}15` }}>
                    <div className="flex justify-center mb-1"><lv.Icon size={24} style={{ color: lv.color }} /></div>
                    <div className="font-bold text-xs">{lv.name}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: lv.color }}>{lv.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            HOW IT WORKS — Horizontal 3 steps
        ═══════════════════════════════════ */}
        <section className="py-16 sm:py-24" style={{ background: "rgba(255,255,255,0.01)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-[100px] opacity-20" style={{ background: "#F59E0B" }} />

              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 relative z-10">Do zero ao ranking</h2>
              <p className="text-center text-sm mb-10 relative z-10" style={{ color: "var(--color-text-secondary)" }}>
                Três passos para começar a competir.
              </p>

              <div className="grid sm:grid-cols-3 gap-8 relative z-10">
                <div className="hidden sm:block absolute top-8 left-[15%] right-[15%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent)" }} />

                {[
                  { n: "01", t: "Cadastre-se", d: "Crie sua conta e valide sua identidade por biometria. Inicie com rating 1000 — Amador C." },
                  { n: "02", t: "Jogue torneios", d: "Entre em campeonatos da sua cidade. Cada resultado atualiza seu ELO automaticamente." },
                  { n: "03", t: "Suba de nível", d: "Acompanhe sua evolução. De Aprendiz a Pro — o ranking reflete seu desempenho real." },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col items-center text-center group">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-lg mb-4 transition-all duration-300 group-hover:scale-110 group-hover:glow-primary"
                      style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                      {s.n}
                    </div>
                    <h3 className="font-bold text-base mb-1.5">{s.t}</h3>
                    <p className="text-xs font-light leading-relaxed max-w-[240px]" style={{ color: "var(--color-text-secondary)" }}>{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            CTA FINAL
        ═══════════════════════════════════ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              A areia te espera.{" "}
              <span className="gradient-text-alt">Mostre seu nível.</span>
            </h2>
            <p className="text-base font-light mb-8 max-w-lg mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Crie sua conta, verifique sua identidade e entre no ranking nacional de futevôlei.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/cadastro" className="btn-primary px-8 py-4 rounded-xl text-base inline-flex items-center gap-2">
                Criar Perfil de Atleta <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link href="/cadastro" className="btn-ghost px-8 py-4 rounded-xl text-base">
                Sou Organizador
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/5" style={{ background: "rgba(8,8,10,0.9)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>QuadraHub</span>
          <p className="text-[10px] font-mono tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            {new Date().getFullYear()} · Futevôlei Competitivo · v3.0
          </p>
        </div>
      </footer>
    </div>
  );
}
