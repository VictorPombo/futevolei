import { MapPin, Navigation, Clock, Activity, Calendar } from "lucide-react";

export const metadata = {
  title: "Quadras Locais | QuadraHub",
};

export default function QuadrasPage() {
  const arenas = [
    { name: "Arena Praia Club", city: "São Paulo, SP", courts: 4, status: "Ao Vivo", activeMatches: 2, nextTourney: "Sexta, 19h" },
    { name: "Sunset Sand", city: "São Paulo, SP", courts: 6, status: "Livre", activeMatches: 0, nextTourney: "Sábado, 09h" },
    { name: "Futevôlei Brasil", city: "Osasco, SP", courts: 3, status: "Ao Vivo", activeMatches: 3, nextTourney: "Hoje, 20h" },
    { name: "Orla Beach", city: "Campinas, SP", courts: 8, status: "Livre", activeMatches: 1, nextTourney: "Domingo, 08h" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-1 uppercase flex items-center gap-3">
          <MapPin className="text-blue-500" size={32} /> Radar de Quadras
        </h1>
        <p className="text-text-secondary font-medium">Encontre arenas parceiras, veja o status das quadras em tempo real e faça check-in.</p>
      </div>

      {/* Live Map Placeholder */}
      <div className="w-full h-[300px] rounded-xl border border-white/5 bg-[#0a0a0c] relative overflow-hidden mb-8 flex items-center justify-center flex-col gap-3 group">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <MapPin size={48} className="text-blue-500/50 group-hover:scale-110 transition-transform" />
        <div className="text-sm font-bold text-text-secondary uppercase tracking-widest relative z-10">Mapa interativo em breve</div>
      </div>

      <h2 className="text-lg font-black tracking-widest uppercase mb-4 text-text-secondary">Arenas na sua região</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {arenas.map((arena, i) => {
          const isLive = arena.status === "Ao Vivo";
          
          return (
            <div key={i} className={`card-3d p-6 rounded-xl border flex flex-col gap-4 relative overflow-hidden ${isLive ? 'border-red-500/30' : 'border-white/5 bg-[#0a0a0c]'}`}>
              {isLive && <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />}
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{arena.name}</h3>
                  <div className="text-xs text-text-secondary font-medium flex items-center gap-1 mt-0.5">
                    <Navigation size={12} /> {arena.city}
                  </div>
                </div>
                {isLive ? (
                  <span className="flex items-center gap-1.5 bg-red-500/10 text-red-500 px-3 py-1 rounded border border-red-500/20 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Campeonato Rolando
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1 rounded border border-green-500/20 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Quadras Livres
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 relative z-10">
                <div className="bg-white/5 p-3 rounded border border-white/5 flex flex-col items-center justify-center text-center">
                  <Activity size={16} className={isLive ? "text-red-400 mb-1" : "text-text-secondary mb-1"} />
                  <div className="text-lg font-black">{arena.activeMatches}</div>
                  <div className="text-[9px] uppercase tracking-widest text-text-secondary">Partidas</div>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5 flex flex-col items-center justify-center text-center">
                  <MapPin size={16} className="text-blue-400 mb-1" />
                  <div className="text-lg font-black">{arena.courts}</div>
                  <div className="text-[9px] uppercase tracking-widest text-text-secondary">Quadras</div>
                </div>
                <div className="bg-white/5 p-3 rounded border border-white/5 flex flex-col items-center justify-center text-center">
                  <Calendar size={16} className="text-yellow-400 mb-1" />
                  <div className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{arena.nextTourney}</div>
                  <div className="text-[9px] uppercase tracking-widest text-text-secondary">Próx. Evento</div>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  );
}
