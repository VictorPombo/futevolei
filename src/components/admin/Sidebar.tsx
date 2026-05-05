'use client';

import { 
  Zap, 
  DollarSign, 
  ShieldCheck, 
  Trophy, 
  Users, 
  ClipboardList, 
  Target, 
  Map, 
  Bug, 
  Activity 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const navItems = [
    { group: 'Principal', items: [
      { id: 'visao-geral', label: 'Visão Geral', icon: Zap, badge: { type: 'danger', text: '3' } },
      { id: 'financeiro', label: 'Financeiro', icon: DollarSign, badge: { type: 'warning', text: '!' } },
      { id: 'lgpd', label: 'Proteção & LGPD', icon: ShieldCheck, badge: { type: 'danger', text: '4' } },
    ]},
    { group: 'Plataforma', items: [
      { id: 'campeonatos', label: 'Campeonatos', icon: Trophy },
      { id: 'atletas', label: 'Atletas', icon: Users },
      { id: 'organizadores', label: 'Organizadores', icon: ClipboardList, badge: { type: 'warning', text: '2' } },
      { id: 'elo', label: 'Partidas & ELO', icon: Activity },
    ]},
    { group: 'Estratégia', items: [
      { id: 'monetizacao', label: 'Monetização', icon: Target },
      { id: 'roadmap', label: 'Roadmap', icon: Map },
      { id: 'bugs', label: 'Bugs & Técnico', icon: Bug, badge: { type: 'danger', text: '1' } },
    ]}
  ];

  return (
    <aside className="w-[var(--sidebar-w)] bg-[#111120]/60 backdrop-blur-md border-r border-[var(--admin-border)] flex flex-col z-50 h-full">
      <div className="p-6 text-xl font-extrabold text-[var(--admin-primary)] flex items-center gap-2 border-b border-[var(--admin-border)] shrink-0">
        <span className="text-2xl">🏐</span>
        <span className="font-syne hidden md:block">QuadraHub</span>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((group, idx) => (
          <div key={idx} className="mb-2">
            <div className="px-6 py-4 text-[11px] uppercase tracking-wider text-[var(--admin-text3)] font-semibold hidden md:block">
              {group.group}
            </div>
            {group.items.map(item => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`
                    flex items-center justify-center md:justify-between px-4 py-3 cursor-pointer transition-all duration-200 text-sm font-medium
                    ${isActive 
                      ? 'text-[var(--admin-primary)] bg-[var(--admin-primary-glow)] border-r-4 border-[var(--admin-primary)]' 
                      : 'text-[var(--admin-text2)] hover:text-[var(--admin-text)] hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[var(--admin-primary)]' : 'text-current'} />
                    <span className="hidden md:block">{item.label}</span>
                  </div>
                  {item.badge && (
                    <div className={`
                      hidden md:flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                      ${item.badge.type === 'danger' ? 'bg-[var(--admin-danger-bg)] text-[var(--admin-danger)] border border-[rgba(239,68,68,0.2)]' : ''}
                      ${item.badge.type === 'warning' ? 'bg-[var(--admin-warning-bg)] text-[var(--admin-warning)] border border-[rgba(245,158,11,0.2)]' : ''}
                    `}>
                      {item.badge.text}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 md:p-6 border-t border-[var(--admin-border)] flex items-center justify-center md:justify-start gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-[var(--admin-card2)] border border-[var(--admin-border2)] flex items-center justify-center text-sm font-bold text-[var(--admin-primary)] shrink-0">
          A
        </div>
        <div className="hidden md:block overflow-hidden">
          <div className="text-sm font-semibold text-[var(--admin-text)] truncate">Admin Principal</div>
          <div className="text-xs text-[var(--admin-text2)]">System Role</div>
        </div>
      </div>
    </aside>
  );
}
