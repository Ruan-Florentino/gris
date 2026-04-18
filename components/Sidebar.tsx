import React, { useState, memo } from 'react';
import { Search, Map, Target, Crosshair, Ruler, Plane, BrainCircuit, ChevronRight, TrendingUp, ShieldAlert, Diamond, Satellite, X } from 'lucide-react';
import { ResourceType } from '@/lib/data';

interface SidebarProps {
  filters: Record<ResourceType, boolean>;
  onFilterChange: (type: ResourceType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose?: () => void;
  activeTool: string | null;
  onToolChange: (tool: string | null) => void;
  onSuggestionClick: (location: string) => void;
  onSaveZone: (name: string) => void;
  onDiscoveryAI: () => void;
  onZoneClick: (lat: number, lng: number, alt: number) => void;
  onToggleAI: () => void;
}

export default memo(function Sidebar({ 
  filters, 
  onFilterChange, 
  searchQuery, 
  onSearchChange, 
  activeTool, 
  onToolChange, 
  onDiscoveryAI, 
  onToggleAI 
}: SidebarProps) {
  const [activeFilter, setActiveFilter] = useState('TUDO');
  const [mobileTab, setMobileTab] = useState<'BUSCA' | 'TÁTICO' | 'IA' | null>(null);

  // === RENDERERS FOR PANELS ===

  const renderNavSistema = () => (
    <div className="flex flex-col gap-3">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gris-emerald)] opacity-60 group-focus-within:opacity-100 transition-opacity" />
        <input 
          type="text"
          placeholder="BUSCAR LOCAL OU RECURSO..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[rgba(255,255,255,0.03)] border border-[var(--gris-border)] focus:border-[var(--gris-emerald)] rounded-none py-2.5 pl-9 pr-3 text-[12px] font-mono text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_15px_rgba(0,255,156,0.1)]"
        />
        {/* Animated corner brackets on focus parent via custom CSS or absolute divs could go here */}
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {['TUDO', 'METAIS', 'ENERGIA', 'CRÍTICOS'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`chip transition-all ${
              activeFilter === f 
                ? 'chip-emerald shadow-[0_0_10px_rgba(0,255,156,0.2)]' 
                : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.1)] text-[var(--gris-text-muted)] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="text-[10px] font-mono tracking-widest text-[var(--gris-emerald)] mt-1 animate-pulse">
        {'> '} 247 RESULTADOS
      </div>
    </div>
  );

  const renderSuiteTatica = () => (
    <div className="grid grid-cols-2 gap-2">
      <TacticalButton icon={<Target />} label="SCAN_PROFUNDO" active={activeTool === 'DEEP_SCAN'} onClick={() => onToolChange(activeTool === 'DEEP_SCAN' ? null : 'DEEP_SCAN')} status="STANDBY" />
      <TacticalButton icon={<Ruler />} label="MEDIR" active={activeTool === 'MEASURE'} onClick={() => onToolChange(activeTool === 'MEASURE' ? null : 'MEASURE')} status="STANDBY" />
      <TacticalButton icon={<Plane />} label="DRONE" active={activeTool === 'DRONE_RECON'} onClick={() => onToolChange(activeTool === 'DRONE_RECON' ? null : 'DRONE_RECON')} status="STANDBY" />
      <TacticalButton icon={<Satellite />} label="ORBITAL" active={activeTool === 'ORBITAL'} onClick={() => onToolChange(activeTool === 'ORBITAL' ? null : 'ORBITAL')} status="ATIVO" highlight />
    </div>
  );

  const renderInsightsIA = () => (
    <div className="flex flex-col gap-3">
      <button 
        onClick={onToggleAI}
        className="w-full flex items-center justify-between p-3 border border-[var(--gris-purple)] bg-[rgba(123,47,255,0.1)] hover:bg-[rgba(123,47,255,0.2)] transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(123,47,255,0.1)] to-transparent -translate-x-full group-hover:animate-[slideRight_1.5s_infinite]" />
        <div className="flex items-center gap-3 relative z-10">
          <BrainCircuit className="w-5 h-5 text-[var(--gris-purple)] group-hover:scale-110 transition-transform" />
          <div className="text-left flex flex-col">
            <span className="font-oxanium text-[12px] font-bold tracking-widest uppercase text-white">INICIAR_ANALISTA</span>
            <span className="font-mono text-[9px] text-[var(--gris-text-muted)] tracking-wider">AURA-9 PRONTO</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--gris-purple)] relative z-10" />
      </button>

      <div className="flex flex-col gap-2 mt-2">
        <AIResultCard title="Assinatura Lítio" value="88%" color="var(--gris-emerald)" />
        <AIResultCard title="Depósito Ouro" value="62%" color="var(--gris-sky)" />
        <AIResultCard title="Fenda Tectônica" value="94%" color="var(--gris-amber)" />
      </div>
    </div>
  );

  return (
    <>
      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden md:flex flex-col w-[300px] fixed top-[56px] bottom-0 left-0 bg-[rgba(0,8,16,0.85)] saturate-150 backdrop-blur-xl border-r border-[var(--gris-border-subtle)] z-[40]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
          
          <Panel title="NAV_SISTEMA">
            {renderNavSistema()}
          </Panel>

          <Panel title="SUÍTE_TÁTICA">
            {renderSuiteTatica()}
          </Panel>

          <Panel title="INSIGHTS_IA">
            {renderInsightsIA()}
          </Panel>

        </div>
      </aside>

      {/* === MOBILE BOTTOM TAB BAR === */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-[72px] bg-[rgba(0,8,16,0.95)] backdrop-blur-md border-t border-[rgba(0,255,156,0.15)] z-[60] flex items-center justify-around px-2 pb-safe">
        <MobileTabBtn icon={<Search />} label="BUSCA" active={mobileTab === 'BUSCA'} onClick={() => setMobileTab(mobileTab === 'BUSCA' ? null : 'BUSCA')} />
        <MobileTabBtn icon={<Crosshair />} label="TÁTICO" active={mobileTab === 'TÁTICO'} onClick={() => setMobileTab(mobileTab === 'TÁTICO' ? null : 'TÁTICO')} />
        
        {/* Main Center FAB */}
        <div className="relative -top-6">
          <button 
            onClick={onDiscoveryAI}
            className="w-14 h-14 rounded-full bg-[var(--gris-emerald)] text-black shadow-[0_0_20px_rgba(0,255,156,0.4)] flex items-center justify-center hover:scale-105 transition-all outline outline-4 outline-[rgba(0,8,16,0.95)]"
          >
            <Target className="w-6 h-6 animate-[pulse_2s_infinite]" />
          </button>
        </div>

        <MobileTabBtn icon={<BrainCircuit />} label="IA" active={mobileTab === 'IA'} onClick={() => setMobileTab(mobileTab === 'IA' ? null : 'IA')} />
        <MobileTabBtn icon={<ShieldAlert />} label="VARREDURA" active={false} onClick={() => window.dispatchEvent(new CustomEvent('toggle-war-room'))} />
      </div>

      {/* === MOBILE BOTTOM SHEET === */}
      <div className={`md:hidden fixed inset-x-0 bottom-[72px] z-[50] transition-transform duration-300 ease-out bg-[rgba(10,14,24,0.95)] backdrop-blur-xl border-t border-[var(--gris-border-subtle)] rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-6 ${mobileTab ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full h-full p-5 pt-3 pointer-events-auto">
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-[rgba(255,255,255,0.2)] rounded-full mx-auto mb-4" />
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-header !mb-0">{mobileTab}</h3>
            <button onClick={() => setMobileTab(null)} className="p-1 rounded-full bg-[rgba(255,255,255,0.05)] text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
            {mobileTab === 'BUSCA' && renderNavSistema()}
            {mobileTab === 'TÁTICO' && renderSuiteTatica()}
            {mobileTab === 'IA' && renderInsightsIA()}
          </div>
        </div>
      </div>
    </>
  );
});

// === SUBCOMPONENTS ===

function Panel({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="section-header">
        <div className="w-1 h-1 bg-[var(--gris-emerald)] animate-pulse" />
        {title}
      </div>
      <div className="glass-panel p-3">
        {children}
      </div>
    </div>
  );
}

function MobileTabBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[60px] transition-colors relative ${active ? 'text-[var(--gris-emerald)]' : 'text-[var(--gris-text-muted)] hover:text-white'}`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 mb-1' })}
      <span className="text-[9px] font-oxanium font-bold tracking-widest uppercase">{label}</span>
      {active && <div className="absolute -top-3 w-1/2 h-[2px] bg-[var(--gris-emerald)] shadow-[0_0_10px_var(--gris-emerald)]" />}
    </button>
  );
}

function TacticalButton({ icon, label, active, onClick, status, highlight = false }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, status: string, highlight?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-start p-2.5 border transition-all duration-200 ${
        active || highlight
          ? 'bg-[rgba(0,255,156,0.05)] border-[var(--gris-emerald)] text-[var(--gris-emerald)] glow-emerald' 
          : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-[var(--gris-text-muted)] hover:border-[rgba(255,255,255,0.2)] hover:text-white'
      }`}
    >
      <div className="flex justify-between w-full items-start mb-2">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4' })}
        <div className={`status-dot ${status === 'ATIVO' ? 'active' : 'bg-[var(--gris-text-muted)]'}`} />
      </div>
      <span className="font-oxanium text-[9px] font-bold tracking-[0.15em] uppercase w-full text-left leading-tight">{label}</span>
      <span className="font-mono text-[7px] text-[var(--gris-text-secondary)] mt-1">{status}</span>
    </button>
  );
}

function AIResultCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-2 border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer group">
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-6 transition-all group-hover:-translate-y-0.5" style={{ backgroundColor: color }} />
        <span className="font-inter text-[11px] font-medium text-[var(--gris-text-1)] uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-mono text-[12px] font-bold" style={{ color }}>{value}</span>
      </div>
    </div>
  );
}
