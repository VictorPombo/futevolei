"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { startAuthentication } from "@simplewebauthn/browser";

export default function QuickMatchModal({
  isOpen,
  onClose,
  currentUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string };
}) {
  const [step, setStep] = useState<"select_players" | "checkin" | "score">("select_players");
  const [matchId, setMatchId] = useState<string | null>(null);
  
  // Seleção de jogadores
  const [search, setSearch] = useState("");
  const [athletes, setAthletes] = useState<Record<string, unknown>[]>([]);
  const [selectedAthletes, setSelectedAthletes] = useState<Record<string, unknown>[]>([{ ...currentUser, team: 1 }]);
  
  // Check-in
  const [checkins, setCheckins] = useState<Record<string, boolean>>({});
  
  // Placar
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (search.length > 2) {
      supabase
        .from("users")
        .select("id, name, city")
        .eq("role", "athlete")
        .ilike("name", `%${search}%`)
        .neq("id", currentUser.id)
        .limit(5)
        .then(({ data }) => setAthletes(data || []));
    } else {
      setAthletes([]);
    }
  }, [search]);

  // Realtime subscription para check-ins
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`match_${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_checkins", filter: `match_id=eq.${matchId}` },
        (payload) => {
          setCheckins((prev) => ({ ...prev, [payload.new.user_id]: true }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const handleCreateMatch = async () => {
    if (selectedAthletes.length !== 4) {
      setError("Selecione 4 atletas para a partida.");
      return;
    }
    
    const team1 = selectedAthletes.filter(a => a.team === 1);
    const team2 = selectedAthletes.filter(a => a.team === 2);
    
    if (team1.length !== 2 || team2.length !== 2) {
      setError("Cada dupla precisa de 2 atletas.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/matches/avulsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athlete1Team1Id: team1[0].id,
          athlete2Team1Id: team1[1].id,
          athlete1Team2Id: team2[0].id,
          athlete2Team2Id: team2[1].id,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMatchId(data.match.id);
      setStep("checkin");
      
      // Se o usuário atual estiver na partida, já tenta fazer o check-in dele
      handleCheckin();

    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    try {
      const res = await fetch("/api/auth/webauthn/generate-authentication-options");
      if (!res.ok) throw new Error("Erro ao preparar biometria.");
      const options = await res.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let asseResp: any;
      try {
        asseResp = await startAuthentication(options);
      } catch (error: unknown) {
        if ((error as Error).name === "NotAllowedError") return; // cancelado
        throw error;
      }

      // Adicionar match_id no payload
      asseResp.match_id = matchId;

      const verificationResp = await fetch("/api/auth/webauthn/verify-authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asseResp),
      });

      const verificationJSON = await verificationResp.json();
      if (verificationJSON.verified) {
        setCheckins(prev => ({ ...prev, [currentUser.id]: true }));
      }
    } catch (e: unknown) {
      console.error(e);
      setError("Erro na biometria: " + (e as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <div className="rounded-2xl w-full max-w-lg overflow-hidden animate-slide-up" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="text-lg font-bold">
            {step === "select_players" ? "Nova Partida Rápida" : step === "checkin" ? "Check-in Biométrico" : "Placar"}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white">✕</button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-500">{error}</div>
          )}

          {step === "select_players" && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Buscar atletas..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                />
                {athletes.length > 0 && (
                  <div className="mt-1 border rounded-lg max-h-32 overflow-y-auto" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                    {athletes.map(a => (
                      <div
                        key={a.id}
                        className="p-2 text-sm hover:bg-white/5 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          if (selectedAthletes.length < 4 && !selectedAthletes.find(sa => sa.id === a.id)) {
                            setSelectedAthletes([...selectedAthletes, { ...a, team: selectedAthletes.filter(sa => sa.team === 1).length < 2 ? 1 : 2 }]);
                          }
                          setSearch("");
                        }}
                      >
                        {a.name} <span className="text-xs text-text-muted">{a.city}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(t => (
                  <div key={t} className="p-4 rounded-xl" style={{ background: "var(--color-card)" }}>
                    <div className="text-xs font-bold mb-2 text-text-secondary uppercase">Dupla {t}</div>
                    {selectedAthletes.filter(a => a.team === t).map(a => (
                      <div key={a.id} className="text-sm font-medium mb-1 truncate flex justify-between">
                        {a.name}
                        {a.id !== currentUser.id && (
                          <button onClick={() => setSelectedAthletes(selectedAthletes.filter(sa => sa.id !== a.id))} className="text-red-500 text-xs">✕</button>
                        )}
                      </div>
                    ))}
                    {selectedAthletes.filter(a => a.team === t).length < 2 && (
                      <div className="text-xs text-text-muted italic">Vaga disponível</div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateMatch}
                disabled={selectedAthletes.length !== 4 || loading}
                className="w-full py-3 mt-4 rounded-lg font-semibold transition-all disabled:opacity-50"
                style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
              >
                {loading ? "Criando..." : "Confirmar e Ir para Check-in"}
              </button>
            </div>
          )}

          {step === "checkin" && (
            <div className="space-y-6 text-center">
              <p className="text-sm text-text-secondary">
                Aguardando os atletas confirmarem presença em seus próprios celulares.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(t => (
                  <div key={t} className="p-4 rounded-xl" style={{ background: "var(--color-card)" }}>
                    <div className="text-xs font-bold mb-3 text-text-secondary uppercase">Dupla {t}</div>
                    {selectedAthletes.filter(a => a.team === t).map(a => {
                      const isChecked = checkins[a.id];
                      return (
                        <div key={a.id} className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isChecked ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                          <span className="text-sm font-medium truncate">{a.name}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {!checkins[currentUser.id] && (
                <button
                  onClick={handleCheckin}
                  className="w-full py-3 rounded-lg font-semibold border"
                  style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
                >
                  Fazer meu Check-in (Biometria)
                </button>
              )}

              <button
                onClick={() => setStep("score")}
                disabled={Object.keys(checkins).length < 4}
                className="w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                style={{ background: "var(--color-primary)", color: "var(--color-bg)" }}
              >
                Iniciar Partida
              </button>
            </div>
          )}

          {step === "score" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center p-4 rounded-xl" style={{ background: "var(--color-card)" }}>
                  <div className="text-xs font-bold mb-2 text-text-secondary uppercase">Dupla 1</div>
                  <input
                    type="number"
                    value={score1}
                    onChange={(e) => setScore1(parseInt(e.target.value) || 0)}
                    className="w-full text-center text-3xl font-black bg-transparent outline-none"
                  />
                </div>
                <div className="text-xl font-black text-text-muted">×</div>
                <div className="flex-1 text-center p-4 rounded-xl" style={{ background: "var(--color-card)" }}>
                  <div className="text-xs font-bold mb-2 text-text-secondary uppercase">Dupla 2</div>
                  <input
                    type="number"
                    value={score2}
                    onChange={(e) => setScore2(parseInt(e.target.value) || 0)}
                    className="w-full text-center text-3xl font-black bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  /* call backend to finish match */
                  alert("API de finalização a ser chamada!");
                  onClose();
                }}
                className="w-full py-3 rounded-lg font-semibold transition-all"
                style={{ background: "var(--color-success)", color: "var(--color-bg)" }}
              >
                Finalizar e Calcular ELO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
