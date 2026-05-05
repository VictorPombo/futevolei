import { Users, Search, Filter, MessageSquare, Plus } from "lucide-react";

export const metadata = {
  title: "Encontrar Duplas | QuadraHub",
};

export default function MatchmakingPage() {
  const availablePlayers = [
    { name: "Lucas Mendes", level: "Amador B", side: "Esquerda", winRate: "68%", city: "São Paulo, SP", status: "Buscando parceiro agora" },
    { name: "Pedro Henrique", level: "Amador C", side: "Direita", winRate: "52%", city: "São Paulo, SP", status: "Buscando para torneio" },
    { name: "Rafael Costa", level: "Iniciante", side: "Qualquer", winRate: "45%", city: "Campinas, SP", status: "Jogo amistoso" },
    { name: "Thiago Silva", level: "Amador A", side: "Esquerda", winRate: "71%", city: "São Paulo, SP", status: "Buscando parceiro agora" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 uppercase flex items-center gap-3">
            <Users className="text-primary" size={32} /> Encontrar Duplas
          </h1>
          <p className="text-text-secondary font-medium">Conecte-se com atletas compatíveis com seu nível e lado de jogo.</p>
        </div>
        <button className="bg-primary text-black font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Plus size={18} /> Anunciar Disponibilidade
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou cidade..." 
            className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <button className="bg-[#0a0a0c] border border-white/10 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-colors">
          <Filter size={18} /> Filtrar Nível
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePlayers.map((player, i) => (
          <div key={i} className="card-3d p-6 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-primary">
                  {player.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{player.name}</h3>
                  <div className="text-[10px] uppercase tracking-widest text-text-secondary">{player.city}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="text-[9px] uppercase tracking-widest text-text-secondary mb-0.5">Lado</div>
                <div className="text-xs font-bold text-white">{player.side}</div>
              </div>
              <div className="bg-white/5 p-2 rounded border border-white/5">
                <div className="text-[9px] uppercase tracking-widest text-text-secondary mb-0.5">Win Rate</div>
                <div className="text-xs font-bold text-green-400">{player.winRate}</div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> {player.level}
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
                <MessageSquare size={14} /> Convidar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
