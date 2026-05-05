import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLevelForRating } from "@/lib/elo";
import { capitalizeName } from "@/lib/utils";
import QuickMatchWrapper from "./QuickMatchWrapper";
import { ShieldCheck, Crosshair, Flag, Medal, Zap, Sliders, History, Users, Crown, ArrowRight, Trophy, Flame, Swords, Calendar, MapPin, Target } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | QuadraHub",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get athlete profile
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get user data
  const { data: userData } = await supabase
    .from("users")
    .select("name, city, role")
    .eq("id", user.id)
    .single();

  // Get Rank Position
  const { data: rankData } = await supabase
    .from("athlete_profiles")
    .select("rating", { count: "exact" })
    .gte("rating", profile?.rating || 0);

  const position = rankData?.length || 1;
  const rating = profile?.rating ?? 1000;
  const level = getLevelForRating(rating);
  const winRate = profile?.total_matches ? Math.round(((profile?.wins || 0) / profile.total_matches) * 100) : 0;
  
  const isOrganizer = userData?.role === "organizer";

  if (isOrganizer) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-1 uppercase">Painel do Organizador</h1>
          <p className="text-text-secondary text-sm font-medium">Bem-vindo(a), {capitalizeName(userData?.name)}. Gerencie a liga local.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/organizar/novo" className="card-3d p-8 rounded-xl group border border-white/5 bg-[#0a0a0c]">
            <Crown size={32} className="text-primary mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Criar Campeonato</h3>
            <p className="text-sm text-text-secondary">Abra inscrições, configure chaves e organize eventos locais.</p>
          </Link>
          <Link href="/organizar" className="card-3d p-8 rounded-xl group border border-white/5 bg-[#0a0a0c]">
            <Sliders size={32} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Meus Campeonatos</h3>
            <p className="text-sm text-text-secondary">Lance resultados, aprove inscrições e gerencie torneios ativos.</p>
          </Link>
        </div>
      </div>
    );
  }

  // MOCK DATA for the new features (Since DB is empty/new)
  const winStreak = 4;
  const isOnFire = winStreak >= 3;
  const nextTargetRank = position > 1 ? position - 1 : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-[1200px] mx-auto pb-20">
      
      {/* 1. Alert Banner (With Date/Time) */}
      <div className="rounded-xl border relative overflow-hidden" style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.1), rgba(0,0,0,0.8))", borderColor: "rgba(245,158,11,0.2)" }}>
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-primary/20 text-primary border border-primary/30" style={{ color: "var(--color-primary)" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--color-primary)" }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-primary)" }}>PRÓXIMO EVENTO</span>
                <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase ml-2">• SEXTA, 19H00 - ARENA PRAIA</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">{capitalizeName(userData?.name)}, Circuito Local — Fase de Grupos</h2>
              <p className="text-xs text-text-secondary font-medium mt-1">
                Sua biometria facial é obrigatória para fazer check-in na quadra 1 e validar o ELO da partida.
              </p>
            </div>
          </div>
          <button className="bg-white text-black shrink-0 px-6 py-3 rounded-lg text-sm font-bold tracking-tight uppercase hover:bg-gray-200 transition-colors">
            Validar Identidade
          </button>
        </div>
      </div>

      {/* 2. Top Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating */}
        <div className={`card-3d p-6 rounded-xl border flex flex-col justify-between min-h-[140px] relative overflow-hidden ${isOnFire ? 'border-orange-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border-white/5 bg-[#0a0a0c]'}`}>
          {isOnFire && <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />}
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col gap-1">
              <Crosshair size={18} className={isOnFire ? 'text-orange-400 mb-2' : 'text-text-secondary mb-2'} />
              <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Seu Rating</span>
            </div>
            {isOnFire && (
              <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
                <Flame size={12} className="animate-pulse" /> On Fire ({winStreak})
              </div>
            )}
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-black tracking-tighter" style={{ color: "var(--color-primary)" }}>{rating}</div>
            <div className="text-xs text-text-muted mt-1 font-medium">{profile?.total_matches || 0} partidas oficiais</div>
          </div>
        </div>

        {/* Rank Position & Call-Out */}
        <div className="card-3d p-6 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col justify-between min-h-[140px] group relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <Trophy size={18} className="text-text-secondary mb-2" />
              <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Posição Ranking</span>
            </div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter">#{position}</div>
            <div className="text-xs text-text-muted mt-1 font-medium">na cidade</div>
          </div>
          
          {/* Call Out Hover Action */}
          {nextTargetRank && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center">
              <Target size={24} className="text-red-500 mb-2" />
              <button className="bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors w-full">
                Desafiar o #{nextTargetRank}
              </button>
            </div>
          )}
        </div>

        {/* Level */}
        <div className="card-3d p-6 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col justify-between min-h-[140px]">
          <div className="flex flex-col gap-1">
            <Flag size={18} className="text-text-secondary mb-2" />
            <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Faixa Atual</span>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight uppercase" style={{ color: level.color }}>{level.name}</div>
            <div className="text-xs text-text-muted mt-1 font-medium">Faltam 50 pts pro Rank B</div>
          </div>
        </div>

        {/* Performance */}
        <div className="card-3d p-6 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col justify-between min-h-[140px]">
          <div className="flex flex-col gap-1">
            <Medal size={18} className="text-text-secondary mb-2" />
            <span className="text-[10px] font-bold text-text-secondary tracking-widest uppercase">Performance</span>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter">{winRate}%</div>
            <div className="text-xs text-text-muted mt-1 font-medium">{profile?.wins || 0}V - {profile?.losses || 0}D</div>
          </div>
        </div>
      </div>

      {/* 3. Engagement Features Grid (The 5 new features + Calendar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Calendar / Próximos Jogos */}
        <div className="card-3d p-5 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-blue-400" />
            <h4 className="text-[13px] font-bold uppercase tracking-wide">Calendário</h4>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex gap-3 items-center border-b border-white/5 pb-3">
              <div className="bg-white/5 rounded px-2 py-1 text-center min-w-[48px]">
                <div className="text-[9px] uppercase text-text-secondary font-black">Sáb</div>
                <div className="text-sm font-black text-white">12</div>
              </div>
              <div>
                <div className="text-xs font-bold">Circuito de Inverno</div>
                <div className="text-[10px] text-text-secondary mt-0.5">14h00 • Arena Sul</div>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="bg-white/5 rounded px-2 py-1 text-center min-w-[48px]">
                <div className="text-[9px] uppercase text-text-secondary font-black">Qua</div>
                <div className="text-sm font-black text-white">16</div>
              </div>
              <div>
                <div className="text-xs font-bold opacity-60">Amistoso Avaliativo</div>
                <div className="text-[10px] text-text-secondary mt-0.5 opacity-60">19h30 • Praia Club</div>
              </div>
            </div>
          </div>
        </div>

        {/* Freguês e Algoz */}
        <div className="card-3d p-5 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <Swords size={18} className="text-red-400" />
            <h4 className="text-[13px] font-bold uppercase tracking-wide">Rivalidade Direta</h4>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">Seu Maior Freguês</div>
              <div className="flex items-center justify-between bg-green-500/5 px-3 py-2 rounded border border-green-500/10">
                <span className="text-sm font-bold">João Pedro</span>
                <span className="text-xs font-black text-green-400">4V - 0D</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Pedra no Sapato</div>
              <div className="flex items-center justify-between bg-red-500/5 px-3 py-2 rounded border border-red-500/10">
                <span className="text-sm font-bold">Matheus C.</span>
                <span className="text-xs font-black text-red-400">1V - 5D</span>
              </div>
            </div>
          </div>
        </div>

        {/* Química de Dupla & Radar */}
        <div className="flex flex-col gap-4">
          <div className="card-3d p-4 rounded-xl border border-white/5 bg-[#0a0a0c] flex-1 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] opacity-5">
              <Users size={100} />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-yellow-500 tracking-widest uppercase mb-1 flex items-center gap-1">
                <Crown size={12} /> A Dupla de Ouro
              </div>
              <div className="text-sm font-bold">Lucas Mendes</div>
              <div className="text-[11px] text-text-secondary mt-1">Sua Win Rate sobe para <strong className="text-white">82%</strong> jogando com ele.</div>
            </div>
          </div>

          <Link href="/quadras" className="card-3d p-4 rounded-xl border border-white/5 bg-[#0a0a0c] flex-1 flex flex-col justify-center group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mb-1 flex items-center gap-1">
                  <MapPin size={12} /> Radar de Quadras
                </div>
                <div className="text-sm font-bold">3 Arenas Ativas Agora</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>

      </div>

      {/* Floating Action Button (GridHub Style) */}
      <QuickMatchWrapper currentUser={{ id: user.id, name: capitalizeName(userData?.name) || "Usuário" }} />

      {/* 4. Plan Banner */}
      <div className="rounded-xl border border-yellow-500/20 bg-[#0a0a0c] overflow-hidden mt-8 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <Crown size={32} className="text-yellow-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-text-secondary tracking-widest uppercase">SEU PLANO</span>
              <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded font-black tracking-wide">PRO</span>
            </div>
            <p className="text-sm font-medium text-text-secondary max-w-2xl leading-relaxed mt-2">
              Você é um Atleta Premium. Aproveite os benefícios exclusivos, estatísticas avançadas e check-in antecipado em campeonatos oficiais QuadraHub.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
