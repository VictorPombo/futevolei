import { Gift, Tag, ArrowRight, Crown, Percent } from "lucide-react";

export const metadata = {
  title: "Clube de Vantagens | QuadraHub",
};

export default function ClubePage() {
  const benefits = [
    { title: "Bolas Mikasa Oficiais", discount: "20% OFF", desc: "Desconto exclusivo na loja oficial Mikasa Brasil para atletas PRO.", tag: "Material", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { title: "Fisioterapia Esportiva", discount: "30% OFF", desc: "Sessões de recovery e liberação miofascial na clínica PhysioSport.", tag: "Saúde", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Aluguel de Quadras", discount: "15% OFF", desc: "Desconto no aluguel avulso em todas as arenas da rede QuadraHub.", tag: "Arenas", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { title: "Óculos Oakley", discount: "10% OFF", desc: "Linha esportiva com desconto para proteger sua visão na areia.", tag: "Acessórios", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-1 uppercase flex items-center gap-3">
          <Gift className="text-yellow-500" size={32} /> Clube de Vantagens
        </h1>
        <p className="text-text-secondary font-medium">Benefícios e descontos exclusivos para assinantes do plano QuadraHub PRO.</p>
      </div>

      {/* Pro Banner */}
      <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-[#0a0a0c] overflow-hidden mb-10 relative">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <Crown size={32} className="text-yellow-500" />
            </div>
            <div>
              <div className="text-yellow-500 font-black uppercase tracking-widest text-sm mb-1">Status PRO Ativo</div>
              <h2 className="text-2xl font-bold">Você tem acesso a todos os descontos</h2>
              <p className="text-sm text-text-secondary mt-1">Apresente seu app na recepção dos parceiros para validar.</p>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-lg border border-white/20 transition-colors uppercase tracking-wider text-sm flex items-center gap-2 whitespace-nowrap">
            Ver Minha Carteirinha
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((item, i) => (
          <div key={i} className="card-3d p-6 rounded-xl border border-white/5 bg-[#0a0a0c] flex flex-col justify-between group hover:border-yellow-500/20 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.border} border`}>
                  <Percent size={24} className={item.color} />
                </div>
                <span className="bg-white/5 border border-white/10 text-text-secondary px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                  {item.tag}
                </span>
              </div>
              
              <h3 className="text-xl font-black tracking-tight mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{item.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
              <div className="text-2xl font-black text-white">{item.discount}</div>
              <button className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors group-hover:translate-x-1">
                Resgatar Cupom <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
