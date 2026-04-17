'use client';

import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { resourcesData, ResourceData, ResourceType, RESOURCE_LABELS, RESOURCE_COLORS, CATEGORY_LABELS } from '@/lib/data';
import { Search, Radar, X, Target, Crosshair, Activity, Database, MapPin, Beaker, Download, Lock, Clock } from 'lucide-react';
import { useRealData } from '@/hooks/useRealData';
import TemporalSlider from '@/components/TemporalSlider';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AIAnalyst from '@/components/AIAnalyst';
import WarRoom from '@/components/WarRoom';
import StatsDashboard from '@/components/StatsDashboard';
import WeatherWidget from '@/components/WeatherWidget';
import { ScrambleText } from '@/components/ScrambleText';

const getChemicalElement = (type: string) => {
  const elements: Record<string, { symbol: string, number: number, group: string }> = {
    gold_deposit: { symbol: 'Au', number: 79, group: 'Metal de Transição' },
    lithium_triangle: { symbol: 'Li', number: 3, group: 'Metal Alcalino' },
    copper_belt: { symbol: 'Cu', number: 29, group: 'Metal de Transição' },
    iron_formation: { symbol: 'Fe', number: 26, group: 'Metal de Transição' },
    cobalt_mine: { symbol: 'Co', number: 27, group: 'Metal de Transição' },
    nickel_deposit: { symbol: 'Ni', number: 28, group: 'Metal de Transição' },
    platinum_reserve: { symbol: 'Pt', number: 78, group: 'Metal de Transição' },
    diamond_mine: { symbol: 'C', number: 6, group: 'Não-metal' },
    bauxite_mine: { symbol: 'Al', number: 13, group: 'Metal Pós-transição' },
    uranium_mine: { symbol: 'U', number: 92, group: 'Actinídeo' },
    coal_mine: { symbol: 'C', number: 6, group: 'Não-metal' },
    silver_mine: { symbol: 'Ag', number: 47, group: 'Metal de Transição' },
    palladium_reserve: { symbol: 'Pd', number: 46, group: 'Metal de Transição' },
    zinc_deposit: { symbol: 'Zn', number: 30, group: 'Metal de Transição' },
    titanium_mine: { symbol: 'Ti', number: 22, group: 'Metal de Transição' },
    graphite_deposit: { symbol: 'C', number: 6, group: 'Não-metal' },
    tungsten_mine: { symbol: 'W', number: 74, group: 'Metal de Transição' },
    manganese_deposit: { symbol: 'Mn', number: 25, group: 'Metal de Transição' },
    tin_mine: { symbol: 'Sn', number: 50, group: 'Metal Pós-transição' },
    lead_deposit: { symbol: 'Pb', number: 82, group: 'Metal Pós-transição' },
    chromium_mine: { symbol: 'Cr', number: 24, group: 'Metal de Transição' },
    molybdenum_mine: { symbol: 'Mo', number: 42, group: 'Metal de Transição' },
    vanadium_deposit: { symbol: 'V', number: 23, group: 'Metal de Transição' },
  };
  return elements[type] || null;
};

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--gris-void)] text-[var(--gris-emerald)] font-mono z-50">
      <div className="scanline" />

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      
      <div className="flex flex-col items-center gap-8 max-w-lg w-full px-8 relative z-10">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-2 border-[var(--gris-emerald)] opacity-20 rounded-sm" />
          <div className="absolute inset-0 border-2 border-[var(--gris-emerald)] border-t-transparent rounded-sm animate-[spin_2s_linear_infinite]" />
          <div className="absolute inset-4 border-2 border-[var(--gris-sky)] opacity-20 rounded-sm" />
          <div className="absolute inset-4 border-2 border-[var(--gris-sky)] border-b-transparent rounded-sm animate-[spin_3s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Radar className="w-8 h-8 text-[var(--gris-emerald)] animate-pulse" />
          </div>
          
          {/* Scanning dots */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--gris-emerald)] rounded-full animate-ping" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--gris-emerald)] rounded-full animate-ping [animation-delay:0.5s]" />
        </div>
        
        <div className="w-full space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-[0.4em] text-[var(--gris-text-primary)] mb-1 font-oxanium">SISTEMA GRIS</h2>
            <div className="text-[11px] text-[var(--gris-emerald)] tracking-widest uppercase opacity-70 font-mono">Sistema de Inteligência de Recursos Globais // v4.0.2</div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[11px] tracking-widest text-[var(--gris-emerald)] font-mono">
              <span>INICIALIZANDO MOTOR GEOESPACIAL</span>
              <span className="animate-pulse">EXECUTANDO...</span>
            </div>
            <div className="progress-track w-full">
              <div className="progress-fill w-[200%] animate-[slideRight_3s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export type MapMode = 'SATELLITE' | 'RESOURCES' | 'GEOLOGY' | 'TACTICAL' | 'HEATMAP' | 'SEISMIC' | 'TECTONIC' | 'PROBABILITY' | 'RISK' | 'LOGISTICS' | 'CYBER_INTEL' | 'PREDICTIVE' | 'INFRARED' | 'TERRAIN';

// Extracted component to prevent full page re-renders on mouse move
const MouseCoordinates = memo(function MouseCoordinates() {
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMouseCoords({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  const latParts = ((mouseCoords.y / window.innerHeight) * 180 - 90).toFixed(6).split('.');
  const lngParts = ((mouseCoords.x / window.innerWidth) * 360 - 180).toFixed(6).split('.');

  return (
    <div className="relative bg-[rgba(0,8,16,0.85)] backdrop-blur-md border border-[var(--gris-border)] p-4 rounded-sm flex flex-col gap-1 min-w-[160px] pointer-events-none group">
      {/* Corner Brackets */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[var(--gris-emerald)] opacity-50" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[var(--gris-emerald)] opacity-50" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[var(--gris-emerald)] opacity-50" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[var(--gris-emerald)] opacity-50" />

      {/* Rastreamento Orbital */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--gris-border-active)]">
        <div className="w-1.5 h-1.5 bg-[var(--gris-emerald)] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,156,0.8)]" />
        <div className="text-[9px] font-oxanium text-[var(--gris-emerald)] tracking-[0.15em] uppercase">Rastreamento_Orbital_Ativo</div>
      </div>

      <div className="text-[11px] font-mono text-[var(--gris-emerald)] tracking-widest flex items-center justify-between">
        <span className="opacity-50 text-[10px]">LAT:</span>
        <span className="tabular-nums drop-shadow-[0_0_2px_rgba(0,255,156,0.5)]">
          {latParts[0]}.
          <span className="text-[var(--gris-emerald-dim)]">
            <ScrambleText text={latParts[1] || "000000"} />
          </span>
        </span>
      </div>
      <div className="text-[11px] font-mono text-[var(--gris-emerald)] tracking-widest flex items-center justify-between">
        <span className="opacity-50 text-[10px]">LNG:</span>
        <span className="tabular-nums drop-shadow-[0_0_2px_rgba(0,255,156,0.5)]">
          {lngParts[0]}.
          <span className="text-[var(--gris-emerald-dim)]">
            <ScrambleText text={lngParts[1] || "000000"} />
          </span>
        </span>
      </div>

      {/* Fake Orbital Data */}
      <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-[var(--gris-border)]">
        <div className="flex justify-between items-center text-[9px] font-mono text-[var(--gris-text-secondary)]">
          <span>ALT:</span>
          <span>408.2 KM</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-[var(--gris-text-secondary)]">
          <span>SPD:</span>
          <span>7.66 KM/S</span>
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [discoveryBriefing, setDiscoveryBriefing] = useState<string | null>(null);
  const globeRef = useRef<any>(null);
  const detailsPanelRef = useRef<HTMLDivElement>(null);

  // New States
  const [activeMode, setActiveMode] = useState<MapMode>('SATELLITE');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [defconLevel, setDefconLevel] = useState(5);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showExtraData, setShowExtraData] = useState(false);
  
  // Pro Features States
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { data: allData, isLoading: isLoadingData } = useRealData();
  const [temporalMode, setTemporalMode] = useState(false);
  const [currentYear, setCurrentYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);

  const [filters, setFilters] = useState<Record<ResourceType, boolean>>({
    oil_field: true,
    gas_basin: true,
    pre_salt: true,
    offshore_basin: true,
    gold_deposit: true,
    lithium_triangle: true,
    rare_earth: true,
    copper_belt: true,
    iron_formation: true,
    polymetallic_nodule: true,
    hydrothermal_vent: true,
    deep_sea_minerals: true,
    seismic_zone: true,
    fault_line: true,
    tectonic_plate: true,
    sedimentary_basin: true,
    cobalt_mine: true,
    nickel_deposit: true,
    platinum_reserve: true,
    diamond_mine: true,
    bauxite_mine: true,
    uranium_mine: true,
    coal_mine: true,
    silver_mine: true,
    palladium_reserve: true,
    zinc_deposit: true,
    titanium_mine: true,
    graphite_deposit: true,
    tungsten_mine: true,
    manganese_deposit: true,
    tin_mine: true,
    lead_deposit: true,
    chromium_mine: true,
    molybdenum_mine: true,
    vanadium_deposit: true,
    megacity: true,
    capital: true,
    tech_hub: true
  });

  // Ensure sidebar is visible on mobile for bottom nav
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowSidebar(true);
    }
  }, []);

  const handleFilterChange = useCallback((type: ResourceType) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  }, []);

  const discoveryPoints = useMemo(() => [
    { name: 'Floresta Amazônica', lat: -3.4653, lng: -62.2159, briefing: 'Monitorando densidade do dossel e padrões de desmatamento ilegal via análise multiespectral.' },
    { name: 'Matriz Solar do Saara', lat: 24.5501, lng: 12.1254, briefing: 'Analisando saída térmica e eficiência de distribuição de energia na rede do Norte da África.' },
    { name: 'Plataforma de Gelo do Ártico', lat: 78.2232, lng: 15.6267, briefing: 'Rastreando recuo glacial e níveis de salinidade no arquipélago de Svalbard.' },
    { name: 'Megalópole de Tóquio', lat: 35.6762, lng: 139.6503, briefing: 'Mapeamento de ilhas de calor urbano e fluxo de densidade populacional durante horários de pico.' },
    { name: 'Grande Barreira de Corais', lat: -18.2871, lng: 147.6992, briefing: 'Avaliação de branqueamento de corais e rastreamento de biodiversidade marinha via integração de sonar subaquático.' },
    { name: 'Picos do Himalaia', lat: 27.9881, lng: 86.9250, briefing: 'Monitorando acúmulo de estresse tectônico e estabilidade da camada de neve na região do Everest.' }
  ], []);

  const handleDiscover = useCallback(() => {
    const randomPoint = discoveryPoints[Math.floor(Math.random() * discoveryPoints.length)];
    setDiscoveryBriefing(randomPoint.briefing);
    if (globeRef.current) {
      globeRef.current.flyTo(randomPoint.lat, randomPoint.lng, 100000);
    }
    // Clear briefing after 8 seconds
    setTimeout(() => setDiscoveryBriefing(null), 8000);
  }, [discoveryPoints]);

  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return allData.filter(r => {
      const matchesSearch = !lowerQuery || r.name.toLowerCase().includes(lowerQuery) || 
             r.country.toLowerCase().includes(lowerQuery);
      const matchesFilter = filters[r.type];
      
      let matchesYear = true;
      if (temporalMode && r.lastUpdate) {
        const rYear = new Date(r.lastUpdate).getFullYear();
        matchesYear = rYear <= currentYear;
      }
      
      return matchesSearch && matchesFilter && matchesYear;
    });
  }, [searchQuery, filters, allData, temporalMode, currentYear]);

  const handleSelectResource = useCallback((resource: ResourceData | null) => {
    setSelectedResource(resource);
    setShowExtraData(false);
    if (resource && globeRef.current) {
      globeRef.current.flyTo(resource.lat, resource.lng, 50000);
    }
  }, []);

  const handleDeepScan = useCallback(() => {
    if (!selectedResource || !globeRef.current) return;
    
    setIsScanning(true);
    globeRef.current.flyTo(selectedResource.lat, selectedResource.lng, 5000);
    
    setTimeout(() => {
      setIsScanning(false);
      setShowExtraData(true);
    }, 3000);
  }, [selectedResource]);

  // Listen for custom events
  useEffect(() => {
    const handleToggleWarRoom = () => setShowWarRoom(prev => !prev);
    const handleToggleTemporalMode = () => setTemporalMode(prev => !prev);
    
    window.addEventListener('toggle-war-room', handleToggleWarRoom);
    window.addEventListener('toggle-temporal-mode', handleToggleTemporalMode);
    
    return () => {
      window.removeEventListener('toggle-war-room', handleToggleWarRoom);
      window.removeEventListener('toggle-temporal-mode', handleToggleTemporalMode);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => (prev >= 2024 ? 2014 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleExportPDF = async () => {
    if (userPlan === 'FREE') {
      setShowUpgradeModal(true);
      return;
    }
    if (!detailsPanelRef.current || !selectedResource) return;
    
    try {
      const canvas = await html2canvas(detailsPanelRef.current, { backgroundColor: '#02040A' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GRIS_Report_${selectedResource.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[var(--gris-void)] text-[var(--gris-text-primary)] font-inter selection:bg-[var(--gris-emerald)] selection:text-black">
      
      {/* Noise Overlay - Softened */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.01] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      {/* Header */}
      <Header 
        activeMode={activeMode}
        onModeChange={setActiveMode}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleStats={() => setShowStats(!showStats)}
        onToggleAI={() => setShowAI(!showAI)}
        defconLevel={defconLevel}
        onDefconChange={setDefconLevel}
      />

      {/* HUD Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] pointer-events-none z-10 opacity-30 mix-blend-screen">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[hud-rotate_60s_linear_infinite]">
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--gris-emerald)" strokeWidth="0.2" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--gris-sky)" strokeWidth="0.1" strokeDasharray="1 8" className="animate-[hud-rotate_40s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
        </svg>
      </div>

      {/* Main 3D Globe */}
      <GlobeMap 
        ref={globeRef}
        data={filteredData}
        onSelectResource={handleSelectResource}
        selectedResource={selectedResource}
        activeMode={activeMode}
      />

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar 
          filters={filters}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setShowSidebar(false)}
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onSuggestionClick={(location) => setSearchQuery(location)}
          onSaveZone={(name) => console.log('Save zone:', name)}
          onDiscoveryAI={handleDiscover}
          onZoneClick={(lat, lng, alt) => globeRef.current?.flyTo(lat, lng, alt)}
          onToggleAI={() => setShowAI(!showAI)}
        />
      )}

      {/* Stats Dashboard */}
      <StatsDashboard 
        data={filteredData}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      {/* AI Analyst */}
      <AIAnalyst 
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        context={{
          resources: filteredData,
          riskZones: [], // Assuming empty for now or pass actual data
          exportRoutes: [], // Assuming empty for now or pass actual data
          selectedResource: selectedResource
        }}
      />

      {/* War Room */}
      <WarRoom 
        isOpen={showWarRoom}
        onClose={() => setShowWarRoom(false)}
        data={filteredData}
      />

      {/* Floating Search Bar */}
      <div className="absolute top-[70px] md:top-[80px] left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[400px] h-[40px] md:h-[44px] bg-[rgba(0,8,16,0.85)] backdrop-blur-md border border-[var(--gris-border-active)] rounded-none flex items-center px-3 md:px-4 pointer-events-auto group shadow-[0_0_20px_rgba(0,255,156,0.1)]">
        
        {/* Animated Corner Brackets */}
        <div className="absolute -top-[2px] -left-[2px] w-3 h-3 border-t-2 border-l-2 border-[var(--gris-emerald)] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 origin-top-left" />
        <div className="absolute -top-[2px] -right-[2px] w-3 h-3 border-t-2 border-r-2 border-[var(--gris-emerald)] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 origin-top-right" />
        <div className="absolute -bottom-[2px] -left-[2px] w-3 h-3 border-b-2 border-l-2 border-[var(--gris-emerald)] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 origin-bottom-left" />
        <div className="absolute -bottom-[2px] -right-[2px] w-3 h-3 border-b-2 border-r-2 border-[var(--gris-emerald)] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 origin-bottom-right" />
        
        {/* Radar Icon */}
        <Radar className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--gris-emerald)] animate-[spin_8s_linear_infinite] opacity-80" />
        
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="BUSCAR ALVO..."
          className="flex-1 bg-transparent border-none outline-none text-[11px] md:text-[12px] font-oxanium font-bold text-[var(--gris-emerald)] placeholder-[var(--gris-text-secondary)] ml-3 md:ml-4 tracking-[0.2em] uppercase focus:placeholder-transparent"
        />
        <style jsx>{`
          input::placeholder {
            animation: cursor-blink 1s step-end infinite;
          }
          @keyframes cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        <button 
          onClick={handleDiscover}
          className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] bg-[rgba(0,255,156,0.1)] border border-[var(--gris-emerald)] flex items-center justify-center hover:bg-[var(--gris-emerald)] transition-colors group/btn"
          title="Descoberta Orbital"
        >
          <Crosshair className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--gris-emerald)] group-hover/btn:text-[#000810]" />
        </button>
      </div>

      {/* Dynamic Coordinates */}
      <div className="absolute bottom-20 md:bottom-6 right-4 md:right-6 z-40 pointer-events-none flex flex-col items-end gap-1">
        <MouseCoordinates />
      </div>

      {/* Discovery Briefing Overlay */}
      <AnimatePresence>
        {discoveryBriefing && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute bottom-12 left-1/2 z-50 w-full max-w-lg px-6 pointer-events-none"
          >
            <div className="panel p-6 rounded-3xl border-[var(--gris-border-subtle)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="status-dot active" />
                <span className="text-[11px] font-inter font-semibold tracking-widest text-[var(--gris-pink)] uppercase">Briefing de Inteligência</span>
              </div>
              <p className="text-sm font-inter text-[var(--gris-text-primary)] leading-relaxed">
                {discoveryBriefing}
              </p>
              <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--gris-pink)] to-transparent opacity-30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Toast Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="absolute top-32 left-1/2 z-[100] pointer-events-none"
          >
            <div className="bg-[var(--gris-surface)]/90 backdrop-blur-md border border-[var(--gris-emerald)] px-6 py-3 rounded-full shadow-[0_0_20px_var(--gris-emerald-glow)] flex items-center gap-3">
              <Radar className="w-5 h-5 text-[var(--gris-emerald)] animate-spin" />
              <span className="text-[var(--gris-emerald)] font-mono text-xs font-bold tracking-widest uppercase">Iniciando Varredura Profunda...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resource Details Panel */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed md:absolute inset-x-0 bottom-0 md:inset-x-auto md:top-24 md:right-6 z-[100] md:z-40 md:w-96 pointer-events-auto"
          >
            <div ref={detailsPanelRef} className="panel p-6 flex flex-col gap-5 h-[80vh] md:h-auto md:max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar shadow-2xl md:rounded-3xl rounded-t-3xl border-[var(--gris-border-subtle)] bg-[rgba(3,10,14,0.95)] backdrop-blur-xl">
              <div className="md:hidden flex justify-center mb-2">
                <div className="w-12 h-1 bg-[rgba(0,255,156,0.2)] rounded-full" onClick={() => setSelectedResource(null)} />
              </div>
              
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`status-dot ${selectedResource.threatLevel === 'CRITICAL' ? 'critical' : selectedResource.threatLevel === 'ELEVATED' ? 'warning' : 'active'}`} />
                    <span className="text-[10px] font-inter font-semibold tracking-widest text-[var(--gris-text-secondary)] uppercase">
                      {selectedResource.classification || 'NÃO CLASSIFICADO'}
                    </span>
                  </div>
                  <h3 className="font-inter text-xl font-bold text-[var(--gris-text-primary)] leading-tight tracking-tight">
                    {selectedResource.name}
                  </h3>
                </div>
                <button 
                  onClick={() => handleSelectResource(null)}
                  className="text-[var(--gris-text-muted)] hover:text-[var(--gris-pink)] transition-colors p-2 bg-white/5 rounded-full border border-white/10 hover:border-[var(--gris-pink)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="chip chip-sky flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {CATEGORY_LABELS[selectedResource.category] || selectedResource.category.replace(/_/g, ' ')}
                </span>
                <span className="chip chip-emerald flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {RESOURCE_LABELS[selectedResource.type] || selectedResource.type.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Chemical Element Profile (if applicable) */}
              {getChemicalElement(selectedResource.type) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 bg-gradient-to-br from-white/5 to-white/0 p-4 rounded-2xl border border-white/10"
                >
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-xl border border-white/20 flex flex-col items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--gris-pink)]/20 to-[var(--gris-purple)]/20 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-1 left-1.5 text-[9px] font-mono text-white/60">{getChemicalElement(selectedResource.type)?.number}</span>
                    <span className="text-2xl font-bold font-inter text-white tracking-tighter">{getChemicalElement(selectedResource.type)?.symbol}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-[var(--gris-pink)] uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Beaker className="w-3 h-3" />
                      Perfil Químico
                    </div>
                    <div className="text-sm font-medium text-white">
                      {getChemicalElement(selectedResource.type)?.group}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      Alvo de extração primário
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Location Info */}
              <div className="space-y-3 mt-1">
                <div className="section-header">
                  <MapPin className="w-3 h-3" />
                  Dados de Localização
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm font-inter text-[var(--gris-text-secondary)] bg-[var(--gris-elevated)] p-4 rounded-2xl border border-[var(--gris-border-subtle)]">
                  <div>
                    <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-1">Região</span>
                    <span className="text-[var(--gris-text-primary)]">{selectedResource.region}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-1">País</span>
                    <span className="text-[var(--gris-text-primary)]">{selectedResource.country}</span>
                  </div>
                  <div className="col-span-2 pt-3 border-t border-[var(--gris-border-subtle)]">
                    <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-1">Coordenadas</span>
                    <span className="text-[var(--gris-sky)] font-mono text-xs">
                      {Math.abs(selectedResource.lat).toFixed(4)}° {selectedResource.lat >= 0 ? 'N' : 'S'}, {Math.abs(selectedResource.lng).toFixed(4)}° {selectedResource.lng >= 0 ? 'L' : 'O'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather Widget */}
              <WeatherWidget lat={selectedResource.lat} lng={selectedResource.lng} />

              {/* Metrics */}
              <div className="space-y-4 mt-1">
                <div className="section-header">
                  <Activity className="w-3 h-3" />
                  Métricas e Análise
                </div>
                
                <div className="space-y-3">
                  {/* Probability Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-[var(--gris-text-secondary)] uppercase">
                      <span>Probabilidade</span>
                      <span className="text-[var(--gris-emerald)]">{selectedResource.probability}%</span>
                    </div>
                    <div className="progress-track w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedResource.probability}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="progress-fill" 
                      />
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-inter font-semibold text-[var(--gris-text-secondary)] uppercase">
                      <span>Confiança</span>
                      <span className="text-[var(--gris-sky)]">{selectedResource.confidence}%</span>
                    </div>
                    <div className="progress-track w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedResource.confidence}%` }}
                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[var(--gris-sky)] to-[var(--gris-purple)] relative overflow-hidden rounded-full"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] bg-[length:200%_100%] animate-[slideRight_2s_linear_infinite]" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="metric-card">
                    <div className="metric-label">Tamanho Estimado</div>
                    <div className="metric-value text-lg">{selectedResource.estimatedSize}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Profundidade</div>
                    <div className="metric-value text-lg text-[var(--gris-text-secondary)]">{selectedResource.depth}</div>
                  </div>
                </div>
              </div>

              {/* Extra Data from Deep Scan */}
              <AnimatePresence>
                {showExtraData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mt-1 pt-4 border-t border-[var(--gris-border-subtle)]">
                      <div className="section-header">
                        <Radar className="w-3 h-3" />
                        Resultados da Varredura Profunda
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm font-inter text-[var(--gris-text-secondary)] bg-[var(--gris-elevated)] p-4 rounded-2xl border border-[var(--gris-border-subtle)]">
                        <div>
                          <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-1">Nível de Ameaça</span>
                          <span className={`font-bold ${selectedResource.threatLevel === 'CRITICAL' ? 'text-[var(--gris-red)]' : selectedResource.threatLevel === 'ELEVATED' ? 'text-[var(--gris-amber)]' : 'text-[var(--gris-emerald)]'}`}>
                            {selectedResource.threatLevel === 'CRITICAL' ? 'CRÍTICO' : selectedResource.threatLevel === 'ELEVATED' ? 'ELEVADO' : selectedResource.threatLevel === 'MODERATE' ? 'MODERADO' : 'BAIXO'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-[var(--gris-text-muted)] uppercase mb-1">Fonte</span>
                          <span className="text-[var(--gris-text-primary)]">{selectedResource.source || 'DESCONHECIDA'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Description */}
              <div className="space-y-3 mt-1">
                <div className="section-header">Relatório de Inteligência</div>
                <div className="relative bg-[var(--gris-elevated)] p-5 rounded-2xl border border-[var(--gris-border-subtle)] shadow-inner">
                  <p className="text-sm font-inter text-[var(--gris-text-secondary)] leading-relaxed">
                    {selectedResource.description || "Nenhum relatório de inteligência detalhado disponível para este setor. Aguardando telemetria de satélite adicional."}
                  </p>
                </div>
              </div>

              {/* Live Telemetry */}
              <div className="grid grid-cols-3 gap-2 mt-2 border-t border-[var(--gris-border-subtle)] pt-4">
                <div className="text-center">
                  <div className="text-[10px] text-[var(--gris-text-muted)] font-inter font-semibold uppercase">Status</div>
                  <div className="text-[11px] text-[var(--gris-emerald)] font-inter font-bold mt-1 animate-pulse">ATIVO</div>
                </div>
                <div className="text-center border-l border-r border-[var(--gris-border-subtle)]">
                  <div className="text-[10px] text-[var(--gris-text-muted)] font-inter font-semibold uppercase">Sinal</div>
                  <div className="text-[11px] text-[var(--gris-sky)] font-inter font-bold mt-1">FORTE</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-[var(--gris-text-muted)] font-inter font-semibold uppercase">Sinc</div>
                  <div className="text-[11px] text-[var(--gris-text-primary)] font-inter font-bold mt-1">0.02s</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleDeepScan}
                  disabled={isScanning}
                  className="btn-primary flex-1 py-4 text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[slideRight_1s_ease-in-out_infinite]" />
                  <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : 'group-hover:animate-spin'}`} />
                  {isScanning ? 'Varrendo...' : 'Varredura Profunda'}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="btn-primary flex-1 py-4 text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group relative overflow-hidden bg-[var(--gris-pink)]/10 border-[var(--gris-pink)]/40 text-[var(--gris-pink)] hover:bg-[var(--gris-pink)]/20"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  Exportar PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Temporal Slider */}
      <AnimatePresence>
        {temporalMode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <TemporalSlider 
              currentYear={currentYear}
              minYear={2014}
              maxYear={2024}
              isPlaying={isPlaying}
              onYearChange={setCurrentYear}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--gris-surface)] border border-[var(--gris-pink)]/50 p-8 rounded-3xl max-w-md w-full shadow-[0_0_40px_rgba(255,45,85,0.2)]"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[var(--gris-pink)]/10 border border-[var(--gris-pink)]/30 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[var(--gris-pink)]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">Atualizar para PRO</h2>
              <p className="text-[var(--gris-text-secondary)] text-center mb-6 text-sm">
                A exportação em PDF e a integração de dados proprietários estão disponíveis exclusivamente para usuários PRO. Desbloqueie recursos B2B avançados para sua organização.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-[var(--gris-text-primary)]">
                  <Download className="w-4 h-4 text-[var(--gris-emerald)]" />
                  <span>Exportar relatórios PDF detalhados com insights de IA</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--gris-text-primary)]">
                  <Database className="w-4 h-4 text-[var(--gris-emerald)]" />
                  <span>Acessar conjuntos de dados proprietários de mineração e energia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--gris-text-primary)]">
                  <Clock className="w-4 h-4 text-[var(--gris-emerald)]" />
                  <span>Histórico completo de 10 anos de análise temporal</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[var(--gris-border-subtle)] text-[var(--gris-text-secondary)] hover:text-white hover:bg-white/5 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    setUserPlan('PRO');
                    setShowUpgradeModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[var(--gris-pink)] text-white font-bold hover:bg-[var(--gris-pink)]/80 transition-colors shadow-[0_0_20px_rgba(255,45,85,0.4)]"
                >
                  Atualizar Agora
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
