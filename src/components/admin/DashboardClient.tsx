'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OverviewView, FinanceView, AthletesView, PlaceholderView } from './Views';

export function DashboardClient() {
  const [activePage, setActivePage] = useState('visao-geral');

  const renderView = () => {
    switch (activePage) {
      case 'visao-geral': return <OverviewView />;
      case 'financeiro': return <FinanceView />;
      case 'atletas': return <AthletesView />;
      case 'elo': return <AthletesView />; // reusing for now since it has the calculator
      default: return <PlaceholderView title={activePage} />;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'visao-geral': return 'Visão Geral';
      case 'financeiro': return 'Módulo Financeiro';
      case 'lgpd': return 'Conformidade e LGPD';
      case 'campeonatos': return 'Gestão de Campeonatos';
      case 'atletas': return 'Base de Atletas';
      case 'organizadores': return 'Organizadores & Promotores';
      case 'elo': return 'Processamento de ELO';
      case 'monetizacao': return 'Estratégia de Monetização';
      case 'roadmap': return 'Roadmap de Produto';
      case 'bugs': return 'Auditoria Técnica & Bugs';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--admin-bg)] text-[var(--admin-text)] overflow-hidden font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--admin-primary)] opacity-5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--admin-purple)] opacity-5 blur-[100px] pointer-events-none"></div>
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        ></div>

        <Header title={getPageTitle()} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-20">
          <div className="max-w-[1400px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
