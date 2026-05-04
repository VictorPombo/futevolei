export const DATA = {
  plataforma: {
    atletasTotal: 847,
    atletasNovos30dias: 94,
    atletasNovosHoje: 23,
    campeonatosAtivos: 14,
    campeonatosEmAndamento: 6,
    campeonatosAbertos: 5,
    campeonatosRascunho: 3,
    campeonatosFinalizados: 18,
    organizadoresTotal: 12,
    organizadoresVerificados: 9,
    organizadoresPendentes: 2,
    partidas: { total: 423, eloProcessado: 398, bug: 25 },
    receita: 0,
    lgpdScore: 42
  },
  
  crescimentoMensal: [
    { mes: 'Jul', atletas: 312 },
    { mes: 'Ago', atletas: 398 },
    { mes: 'Set', atletas: 487 },
    { mes: 'Out', atletas: 603 },
    { mes: 'Nov', atletas: 698 },
    { mes: 'Dez', atletas: 754 },
    { mes: 'Jan', atletas: 847 },
  ],
  
  niveis: {
    profissional: { count: 12, pct: 1.4, color: '#E8833A' },
    amadorA: { count: 48, pct: 5.7, color: '#F59E0B' },
    amadorB: { count: 143, pct: 16.9, color: '#8B5CF6' },
    amadorC: { count: 312, pct: 36.8, color: '#3B82F6' },
    iniciante: { count: 245, pct: 28.9, color: '#22C55E' },
    aprendiz: { count: 87, pct: 10.3, color: '#6B7280' },
  },
  
  topAtletas: [
    { pos: 1, iniciais: 'LT', nome: 'Lucas Torres', cidade: 'São Paulo, SP', nivel: 'Profissional', rating: 1847, delta: +24 },
    { pos: 2, iniciais: 'MF', nome: 'Mariana Freitas', cidade: 'Rio de Janeiro, RJ', nivel: 'Profissional', rating: 1792, delta: +12 },
    { pos: 3, iniciais: 'RS', nome: 'Rafael Souza', cidade: 'Belo Horizonte, MG', nivel: 'Profissional', rating: 1765, delta: -8 },
    { pos: 4, iniciais: 'AC', nome: 'Ana Costa', cidade: 'Fortaleza, CE', nivel: 'Profissional', rating: 1654, delta: +31 },
    { pos: 5, iniciais: 'PO', nome: 'Pedro Oliveira', cidade: 'Curitiba, PR', nivel: 'Profissional', rating: 1621, delta: +5 },
    { pos: 6, iniciais: 'BN', nome: 'Beatriz Nunes', cidade: 'Salvador, BA', nivel: 'Amador A', rating: 1587, delta: -15 },
    { pos: 7, iniciais: 'TM', nome: 'Thiago Mendes', cidade: 'São Paulo, SP', nivel: 'Amador A', rating: 1556, delta: +8 },
    { pos: 8, iniciais: 'CL', nome: 'Camila Lima', cidade: 'Florianópolis, SC', nivel: 'Amador A', rating: 1534, delta: 0 },
    { pos: 9, iniciais: 'GR', nome: 'Gabriel Rocha', cidade: 'Recife, PE', nivel: 'Amador A', rating: 1498, delta: +19 },
    { pos: 10, iniciais: 'JS', nome: 'Júlia Santos', cidade: 'Porto Alegre, RS', nivel: 'Amador A', rating: 1477, delta: -4 },
  ],
  
  campeonatos: [
    { id: 1, nome: 'Open Verão SP 2025', organizador: 'Beach Arena SP', categoria: 'profissional', formato: 'grupos_mata_mata', inscritos: 12, max: 16, status: 'in_progress', oficial: true, data: '15/01/2025', taxaDupla: 150 },
    { id: 2, nome: 'Copa RJ Amador', organizador: 'Carlos Mendes', categoria: 'amador', formato: 'eliminatoria_direta', inscritos: 5, max: 8, status: 'open', oficial: false, data: '20/01/2025', taxaDupla: 80 },
    { id: 3, nome: 'BH Open 2025', organizador: 'Arena BH', categoria: 'profissional', formato: 'grupos_mata_mata', inscritos: 18, max: 24, status: 'in_progress', oficial: true, data: '10/01/2025', taxaDupla: 250 },
    { id: 4, nome: 'Torneio Iniciantes CWB', organizador: 'Quadra CWB', categoria: 'misto', formato: 'eliminatoria_direta', inscritos: 3, max: 8, status: 'open', oficial: false, data: '25/01/2025', taxaDupla: 50 },
    { id: 5, nome: 'Circuito Nordeste #3', organizador: 'Nordeste Beach', categoria: 'amador', formato: 'grupos_mata_mata', inscritos: 0, max: 12, status: 'draft', oficial: false, data: '—', taxaDupla: 0 },
  ],
  
  organizadores: [
    { id: 1, nome: 'Beach Arena SP', email: 'contato@beacharenasp.com', cidade: 'SP', campeonatos: 8, atletas: 184, status: 'verificado', plano: 'free' },
    { id: 2, nome: 'Carlos Mendes', email: 'carlos@beachrj.com', cidade: 'RJ', campeonatos: 3, atletas: 56, status: 'pendente', plano: 'free' },
    { id: 3, nome: 'Fernanda Lima', email: 'fernanda@arenasp.com', cidade: 'SP', campeonatos: 1, atletas: 12, status: 'analise', plano: 'free' },
    { id: 4, nome: 'Arena BH', email: 'contato@arenabh.com', cidade: 'MG', campeonatos: 5, atletas: 143, status: 'verificado', plano: 'free' },
    { id: 5, nome: 'Nordeste Beach', email: 'nordeste@beach.com', cidade: 'BA', campeonatos: 2, atletas: 38, status: 'verificado', plano: 'free' },
  ],
  
  projecaoReceita: [
    { mes: 'Jan', real: 0, otimista: 0 },
    { mes: 'Fev', real: 0, otimista: 0 },
    { mes: 'Mar', real: 1200, otimista: 2000 },
    { mes: 'Abr', real: 2800, otimista: 4500 },
    { mes: 'Mai', real: 3600, otimista: 6000 },
    { mes: 'Jun', real: 4055, otimista: 7500 },
    { mes: 'Jul', real: 4800, otimista: 9000 },
    { mes: 'Ago', real: 5200, otimista: 11000 },
    { mes: 'Set', real: 6100, otimista: 13500 },
    { mes: 'Out', real: 7200, otimista: 16000 },
    { mes: 'Nov', real: 8400, otimista: 19000 },
    { mes: 'Dez', real: 10500, otimista: 24000 },
  ]
};
