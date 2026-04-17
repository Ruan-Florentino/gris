'use client';

import React, { useState, memo } from 'react';
import { Search, Satellite, Radar, Thermometer, Mountain, Percent, ChevronDown, ChevronRight, Target, Crosshair, Ruler, Square, Download, PlusSquare, BarChart2, Layers, Database, Activity, X, Plane, BrainCircuit, ChevronRightIcon, TrendingUp, ShieldAlert } from 'lucide-react';
import { ResourceType, ResourceCategory, RESOURCE_COLORS, RESOURCE_LABELS } from '@/lib/data';
import { MapMode } from '@/app/page';

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

export default memo(function Sidebar({ filters, onFilterChange, searchQuery, onSearchChange, onClose, activeTool, onToolChange, onSuggestionClick, onSaveZone, onDiscoveryAI, onZoneClick, onToggleAI }: SidebarProps) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [mobileTab, setMobileTab] = useState<'NAV' | 'TACTICAL' | 'AI' | null>(null);

  const renderNav = () => (
    <div className="flex flex-col bg-[rgba(0,8,16,0.92)] backdrop-blur-xl border border-[rgba(0,255,156,0.2)] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto filter drop-shadow-[0_0_15px_rgba(0,255,156,0.05)]">
      <div className="flex flex-col mb-4 relative">
        <div className="flex justify-between items-end pb-1 border-b border-transparent relative">
          <span className="font-oxanium text-[11px] font-bold text-[var(--gris-emerald)] uppercase tracking-[3px] drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]">NAV_SISTEMA</span>
          <span className="font-mono text-[9px] text-[var(--gris-emerald)] opacity-50 tracking-widest">v4.2.0</span>
          {/* Gradient Underline */}
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-[var(--gris-emerald)] to-transparent opacity-50" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 w-[2px] bg-[var(--gris-emerald)] opacity-0 group-focus-within:opacity-100 transition-opacity drop-shadow-[0_0_5px_rgba(0,255,156,0.8)]" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gris-emerald-dim)] group-focus-within:text-[var(--gris-emerald)] transition-colors filter drop-shadow-[0_0_3px_currentColor]" />
          <input 
            type="text"
            placeholder="BUSCAR LOCAL / RECURSO..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[rgba(0,255,156,0.05)] border border-[rgba(0,255,156,0.15)] rounded-none py-2 pl-9 pr-3 text-[11px] text-[var(--gris-emerald)] placeholder-[rgba(0,255,156,0.3)] focus:outline-none focus:border-[var(--gris-emerald)] focus:bg-[rgba(0,255,156,0.08)] transition-all font-mono uppercase tracking-widest"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['TUDO', 'MILITAR', 'RECURSOS', 'ALERTAS'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-[9px] font-mono border transition-all uppercase tracking-widest ${
                activeFilter === f 
                  ? 'bg-[rgba(0,255,156,0.15)] border-[var(--gris-emerald)] text-[var(--gris-emerald)] shadow-[0_0_10px_rgba(0,255,156,0.2)]' 
                  : 'bg-[rgba(0,255,156,0.02)] border-[rgba(0,255,156,0.1)] text-[var(--gris-text-secondary)] hover:border-[rgba(0,255,156,0.3)] hover:text-[var(--gris-emerald)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTactical = () => (
    <div className="flex flex-col bg-[rgba(0,8,16,0.92)] backdrop-blur-xl border border-[rgba(0,255,156,0.2)] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto filter drop-shadow-[0_0_15px_rgba(0,255,156,0.05)]">
      <div className="flex flex-col mb-4 relative">
        <div className="flex justify-between items-end pb-1 border-b border-transparent relative">
          <span className="font-oxanium text-[11px] font-bold text-[var(--gris-emerald)] uppercase tracking-[3px] drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]">SUÍTE_TÁTICA</span>
          <span className="font-mono text-[9px] text-[var(--gris-emerald)] opacity-50 tracking-widest">MÓDULOS</span>
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-[var(--gris-emerald)] to-transparent opacity-50" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TacticalButton icon={<Layers />} label="SCAN_PROFUNDO" active={activeTool === 'DEEP_SCAN'} onClick={() => onToolChange(activeTool === 'DEEP_SCAN' ? null : 'DEEP_SCAN')} />
        <TacticalButton icon={<Ruler />} label="MEDIR" active={activeTool === 'MEASURE'} onClick={() => onToolChange(activeTool === 'MEASURE' ? null : 'MEASURE')} />
        <TacticalButton icon={<Plane />} label="RECON_DRONE" active={activeTool === 'DRONE_RECON'} onClick={() => onToolChange(activeTool === 'DRONE_RECON' ? null : 'DRONE_RECON')} />
        <TacticalButton icon={<Satellite />} label="SCAN_ORBITAL" active={activeTool === 'ORBITAL_SCAN'} onClick={() => onToolChange(activeTool === 'ORBITAL_SCAN' ? null : 'ORBITAL_SCAN')} />
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="flex flex-col bg-[rgba(0,8,16,0.92)] backdrop-blur-xl border border-[rgba(0,255,156,0.2)] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto filter drop-shadow-[0_0_15px_rgba(0,255,156,0.05)]">
      <div className="flex flex-col mb-4 relative">
        <div className="flex justify-between items-end pb-1 border-b border-transparent relative">
          <span className="font-oxanium text-[11px] font-bold text-[var(--gris-emerald)] uppercase tracking-[3px] drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]">INSIGHTS_IA</span>
          <span className="font-mono text-[9px] text-[var(--gris-emerald)] opacity-50 tracking-widest">NEURAL</span>
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-[var(--gris-emerald)] to-transparent opacity-50" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button 
          onClick={onToggleAI}
          className="w-full h-[40px] border border-[var(--gris-emerald)] bg-[rgba(0,255,156,0.1)] hover:bg-[var(--gris-emerald)] rounded-none text-[var(--gris-emerald)] hover:text-[#000810] font-oxanium font-bold uppercase tracking-[2px] flex items-center justify-center gap-2 group transition-all"
        >
          <BrainCircuit className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          INICIAR_ANALISTA
        </button>
        
        <div className="flex flex-col gap-3">
          <AIResultCard title="ALTA_PROB_LÍTIO" percentage={88} icon={<TrendingUp className="w-4 h-4" />} color="var(--gris-emerald)" />
          <AIResultCard title="GÁS_INEXPLORADO" percentage={45} icon={<Activity className="w-4 h-4" />} color="var(--gris-sky)" />
          <AIResultCard title="RISCO_SÍSMICO" percentage={62} icon={<ShieldAlert className="w-4 h-4" />} color="var(--gris-amber)" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex absolute left-6 top-20 bottom-12 w-[300px] z-40 flex-col gap-4 pointer-events-none">
        {renderNav()}
        {renderTactical()}
        {renderAI()}
      </div>

      {/* Mobile Bottom Sheet */}
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out ${mobileTab ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-[rgba(3,10,14,0.95)] backdrop-blur-xl border-t border-[rgba(0,255,156,0.2)] p-4 pb-24 max-h-[80vh] overflow-y-auto custom-scrollbar pointer-events-auto">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-[rgba(0,255,156,0.2)] rounded-full" onClick={() => setMobileTab(null)} />
          </div>
          {mobileTab === 'NAV' && renderNav()}
          {mobileTab === 'TACTICAL' && renderTactical()}
          {mobileTab === 'AI' && renderAI()}
        </div>
      </div>

      {/* Mobile Bottom Nav Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[rgba(3,10,14,0.9)] backdrop-blur-md border-t border-[rgba(0,255,156,0.1)] z-[60] flex items-center justify-around px-4 pointer-events-auto">
        <button 
          onClick={() => setMobileTab(mobileTab === 'NAV' ? null : 'NAV')}
          className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'NAV' ? 'text-[var(--gris-emerald)]' : 'text-[var(--gris-text-secondary)]'}`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase">Navegação</span>
        </button>
        <button 
          onClick={() => setMobileTab(mobileTab === 'TACTICAL' ? null : 'TACTICAL')}
          className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'TACTICAL' ? 'text-[var(--gris-emerald)]' : 'text-[var(--gris-text-secondary)]'}`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase">Tático</span>
        </button>
        <button 
          onClick={() => setMobileTab(mobileTab === 'AI' ? null : 'AI')}
          className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'AI' ? 'text-[var(--gris-emerald)]' : 'text-[var(--gris-text-secondary)]'}`}
        >
          <BrainCircuit className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase">IA</span>
        </button>
        <button 
          onClick={() => onDiscoveryAI()}
          className="flex flex-col items-center gap-1 text-[var(--gris-sky)]"
        >
          <Target className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase">Varredura</span>
        </button>
      </div>
    </>
  );
});

function TacticalButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <button 
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center gap-2 p-3 border transition-all duration-200 font-mono text-[9px] uppercase relative overflow-hidden group ${
          active 
            ? 'bg-[rgba(0,255,156,0.1)] border-[var(--gris-emerald)] text-[var(--gris-emerald)] shadow-[inset_0_0_15px_rgba(0,255,156,0.2),_0_0_10px_rgba(0,255,156,0.3)]' 
            : 'bg-[rgba(0,255,156,0.02)] border-[rgba(0,255,156,0.15)] text-[var(--gris-text-secondary)] hover:border-[rgba(0,255,156,0.4)] hover:text-[var(--gris-emerald)] hover:bg-[rgba(0,255,156,0.05)]'
        }`}
      >
        {active && <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--gris-emerald)] animate-pulse shadow-[0_0_10px_rgba(0,255,156,1)]" />}
        {React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5 filter ${active ? 'drop-shadow-[0_0_5px_currentColor] animate-pulse' : 'group-hover:drop-shadow-[0_0_5px_currentColor]'}` })}
        <span className="tracking-widest">{label}</span>
      </button>
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-0.5">
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-1.5 h-1 ${active ? 'bg-[var(--gris-emerald)] shadow-[0_0_3px_var(--gris-emerald)]' : 'bg-[rgba(0,255,156,0.1)]'}`} />
          ))}
        </div>
        <span className={`text-[8px] font-mono tracking-widest ${active ? 'text-[var(--gris-emerald)]' : 'text-[var(--gris-text-secondary)]'}`}>
          {active ? 'ATIVO' : 'STANDBY'}
        </span>
      </div>
    </div>
  );
}

function AIResultCard({ title, percentage, icon, color }: { title: string, percentage: number, icon: React.ReactNode, color?: string }) {
  const resolvedColor = color || (percentage > 70 ? 'var(--gris-emerald)' : percentage > 40 ? 'var(--gris-sky)' : 'var(--gris-red)');
  const segments = 10;
  const activeSegments = Math.round((percentage / 100) * segments);

  return (
    <div className="flex flex-col gap-2 p-3 bg-[rgba(0,255,156,0.02)] border border-[rgba(0,255,156,0.1)] hover:border-[rgba(0,255,156,0.3)] hover:bg-[rgba(0,255,156,0.05)] transition-all group cursor-pointer shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--gris-text-primary)]">
          <div style={{ color: resolvedColor }} className="opacity-70 filter drop-shadow-[0_0_3px_currentColor]">{icon}</div>
          <span className="font-oxanium text-[10px] uppercase tracking-[2px]">{title}</span>
        </div>
        <span className="font-mono text-[10px] font-bold" style={{ color: resolvedColor, textShadow: `0 0 5px ${resolvedColor}` }}>{percentage}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 h-1.5 transition-all duration-500" 
            style={{ 
              backgroundColor: i < activeSegments ? resolvedColor : 'rgba(255,255,255,0.05)',
              boxShadow: i < activeSegments ? `0 0 5px ${resolvedColor}` : 'none',
              opacity: i < activeSegments ? 1 : 0.3
            }} 
          />
        ))}
      </div>
    </div>
  );
}
