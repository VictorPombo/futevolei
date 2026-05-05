import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { getLevelForRating, getLevelProgress } from "@/lib/elo";
import RatingBadge from "@/components/RatingBadge";
import DashboardChart from "@/app/(protected)/dashboard/DashboardChart";
import RatingDelta from "@/components/RatingDelta";
import Navbar from "@/components/Navbar";

export const revalidate = 60; // ISR - revalida a cada 1 min

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: user } = await admin.from("users").select("name").eq("id", id).single();
  
  if (!user) return { title: "Atleta não encontrado" };
  return { title: `${user.name} | QuadraHub` };
}

export default async function PublicAthleteProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  // Get user data
  const { data: userData } = await admin
    .from("users")
    .select("id, name, city, state, avatar_url")
    .eq("id", id)
    .single();

  if (!userData) notFound();

  // Get athlete profile
  const { data: profile } = await admin
    .from("athlete_profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (!profile) notFound();

  // Get ELO history (last 20)
  const { data: eloHistory } = await admin
    .from("elo_history")
    .select("*, match:matches(*, championship:championships(name))")
    .eq("athlete_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const rating = profile.rating;
  const level = getLevelForRating(rating);
  const progress = getLevelProgress(rating);

  const nextLevelRating = level.maxRating === Infinity ? null : level.maxRating + 1;
  const nextLevelName = nextLevelRating ? getLevelForRating(nextLevelRating).name : null;

  const chartData = (eloHistory || []).reverse().map((entry, i) => ({
    matchIndex: i + 1,
    rating: entry.rating_after,
  }));

  const recentMatches = (eloHistory || []).slice(0, 10).reverse();

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* Avatar */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shrink-0 relative"
            style={{
              background: "var(--color-primary-glow)",
              color: "var(--color-primary)",
              border: `3px solid ${level.color}`,
              boxShadow: `0 0 20px ${level.color}33`,
            }}
          >
            {userData.avatar_url ? (
              <img src={userData.avatar_url} alt={userData.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              userData.name.charAt(0).toUpperCase()
            )}
            
            {/* Badge de Biometria */}
            {profile.biometrics_registered && (
              <div 
                className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 flex items-center justify-center text-white shadow-lg"
                style={{ borderColor: "var(--color-bg)" }}
                title="Identidade Verificada (Biometria)"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black mb-1">{userData.name}</h1>
            <p className="text-text-secondary mb-4">{userData.city}, {userData.state}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs text-text-secondary uppercase font-bold mb-1">Rating</p>
                <p className="text-2xl font-black font-mono" style={{ color: level.color }}>{rating}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs text-text-secondary uppercase font-bold mb-1">Vitórias</p>
                <p className="text-2xl font-black text-green-500">{profile.wins}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs text-text-secondary uppercase font-bold mb-1">Derrotas</p>
                <p className="text-2xl font-black text-red-500">{profile.losses}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <p className="text-xs text-text-secondary uppercase font-bold mb-1">Winrate</p>
                <p className="text-2xl font-black">{profile.total_matches > 0 ? Math.round((profile.wins / profile.total_matches) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        {nextLevelName && (
          <div className="mb-10 rounded-xl p-6" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <RatingBadge rating={rating} size="md" />
              </div>
              <span className="text-sm font-bold text-text-secondary">{nextLevelName}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--color-bg)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)`,
                }}
              />
            </div>
            <p className="text-xs text-right text-text-muted mt-2 font-mono">Faltam {nextLevelRating! - rating} pts</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="md:col-span-2 space-y-6">
            {chartData.length > 0 && (
              <div className="rounded-xl p-6" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
                <h2 className="text-lg font-bold mb-4">Evolução do Rating</h2>
                <DashboardChart data={chartData} />
              </div>
            )}
          </div>

          {/* Recent Matches */}
          <div className="rounded-xl p-6 h-fit" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
            <h2 className="text-lg font-bold mb-4">Últimos Resultados</h2>
            {recentMatches.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-4">Sem histórico de partidas.</p>
            ) : (
              <div className="space-y-4">
                {recentMatches.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: "var(--color-border)" }}>
                    <div>
                      <p className="text-sm font-bold">
                        {(entry.match as { championship?: { name: string } })?.championship?.name || "Partida Avulsa"}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(entry.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <RatingDelta delta={entry.delta} />
                      <div className="text-xs font-mono text-text-muted">{entry.rating_after}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
