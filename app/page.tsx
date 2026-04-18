'use client';

import Image from 'next/image';
import { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { resourcesData, ResourceData, ResourceType, RESOURCE_LABELS, RESOURCE_COLORS, CATEGORY_LABELS, riskZones, exportRoutes } from '@/lib/data';
import { Search, X, Target, Crosshair, Activity, Database, MapPin, Beaker, Download, Lock, Clock, Radar } from 'lucide-react';
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
import GrisLogo from '@/components/GrisLogo';

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
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-[var(--gris-emerald)] opacity-20 rounded-sm" />
          <div className="absolute inset-0 border-2 border-[var(--gris-emerald)] border-t-transparent rounded-sm animate-[spin_2s_linear_infinite]" />
          <div className="absolute inset-4 border-2 border-[var(--gris-sky)] opacity-20 rounded-sm" />
          <div className="absolute inset-4 border-2 border-[var(--gris-sky)] border-b-transparent rounded-sm animate-[spin_3s_linear_infinite_reverse]" />
          
          <div className="relative z-10 animate-float">
            <GrisLogo 
              size={48} 
              className="drop-shadow-[0_0_12px_rgba(0,255,156,0.6)]"
            />
          </div>
          
          <div className="absolute inset-0 bg-[var(--gris-emerald)] opacity-10 blur-xl animate-pulse" />
          
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
    sedimentary_basin: true,
    seismic_zone: true,
    fault_line: true,
    tectonic_plate: true
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
      globeRef.current.flyTo(resource.lat, resource.lng, 500000);
      // Dispara o efeito de pulse quando seleciona (feedback tático)
      setTimeout(() => {
        globeRef.current?.triggerPulse?.();
      }, 1500);
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
    
    // Resource selection from GlobeMap
    const handleSelectResourceEvent = (e: any) => {
      const resourceId = e.detail;
      const resource = allData.find(r => r.id === resourceId) || null;
      handleSelectResource(resource);
    };
    const handleMapClick = () => {
      handleSelectResource(null);
    };
    
    window.addEventListener('toggle-war-room', handleToggleWarRoom);
    window.addEventListener('toggle-temporal-mode', handleToggleTemporalMode);
    window.addEventListener('select-resource', handleSelectResourceEvent);
    window.addEventListener('map-click', handleMapClick);
    
    return () => {
      window.removeEventListener('toggle-war-room', handleToggleWarRoom);
      window.removeEventListener('toggle-temporal-mode', handleToggleTemporalMode);
      window.removeEventListener('select-resource', handleSelectResourceEvent);
      window.removeEventListener('map-click', handleMapClick);
    };
  }, [allData, handleSelectResource]);

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
      <div className="tactical-noise" />

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
          riskZones: riskZones,
          exportRoutes: exportRoutes,
          selectedResource: selectedResource,
          cameraData: globeRef.current?.getCameraPosition?.() || undefined
        }}
      />

      {/* War Room */}
      <WarRoom 
        isOpen={showWarRoom}
        onClose={() => setShowWarRoom(false)}
        data={filteredData}
      />

      {/* Dynamic Coordinates */}
      <div className="absolute bottom-20 md:bottom-24 right-4 md:right-6 z-40 pointer-events-none flex flex-col items-end gap-1">
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

              {/* Target Resource Dossier */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, x: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed z-50 bottom-24 md:bottom-auto md:top-[72px] lg:left-[320px] md:left-6 md:w-[400px] w-[calc(100%-32px)] mx-4 md:mx-0 bg-[rgba(5,10,14,0.95)] backdrop-blur-2xl border border-[var(--gris-border-subtle)] md:rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
          >
            {/* Top scanning line effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,var(--gris-emerald),transparent)] opacity-50 animate-[pulse_2s_infinite]" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--gris-emerald)] opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[var(--gris-emerald)] opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--gris-emerald)] opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[var(--gris-emerald)] opacity-50" />

            <div className="p-5 flex flex-col gap-4 relative">
              
              {/* Header: Type and Close */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] animate-pulse ${
                    selectedResource.threatLevel === 'CRITICAL' ? 'text-[var(--gris-red)] bg-[var(--gris-red)]' : 
                    selectedResource.threatLevel === 'ELEVATED' ? 'text-[var(--gris-amber)] bg-[var(--gris-amber)]' : 
                    'text-[var(--gris-emerald)] bg-[var(--gris-emerald)]'
                  }`} />
                  <span className="font-oxanium text-[10px] font-bold text-[var(--gris-text-2)] tracking-[0.2em] uppercase">
                    {RESOURCE_LABELS[selectedResource.type] || selectedResource.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getChemicalElement(selectedResource.type) && (
                    <div className="flex items-center gap-1.5 border border-[var(--gris-border-subtle)] px-2 py-0.5 bg-[rgba(255,255,255,0.02)]">
                      <span className="text-[11px] font-bold font-mono text-[var(--gris-emerald)]">
                        {getChemicalElement(selectedResource.type)?.symbol}
                      </span>
                      <span className="text-[9px] font-mono text-[var(--gris-text-2)]">
                        {getChemicalElement(selectedResource.type)?.number}
                      </span>
                    </div>
                  )}
                  <button onClick={() => handleSelectResource(null)} className="p-1 rounded-sm bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(239,68,68,0.2)] text-[var(--gris-text-2)] hover:text-[var(--gris-red)] transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title and Location */}
              <div>
                <h3 className="font-oxanium text-lg font-bold text-white uppercase tracking-[0.1em] leading-tight mb-1">
                  {selectedResource.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--gris-text-2)] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 border border-[var(--gris-text-2)] rotate-45" />
                  <ScrambleText text={`${selectedResource.region}, ${selectedResource.country}`} />
                </div>
              </div>

              {/* Probability Bar */}
              <div className="space-y-1.5 border border-[var(--gris-border-subtle)] p-3 bg-[rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[var(--gris-text-3)] uppercase flex items-center gap-2">
                    <span className="w-1 h-2 bg-[var(--gris-emerald)]" />
                    Probabilidade
                  </span>
                  <span className="text-[13px] font-mono font-bold text-[var(--gris-emerald)] glow-emerald">{selectedResource.probability}%</span>
                </div>
                <div className="h-1.5 w-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedResource.probability}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[var(--gris-emerald)] shadow-[0_0_10px_var(--gris-emerald)] relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] -translate-x-full animate-[slideRight_1.5s_infinite]" />
                  </motion.div>
                </div>
              </div>

              {/* Inline Metrics */}
              <div className="grid grid-cols-2 gap-px bg-[var(--gris-border-subtle)] border border-[var(--gris-border-subtle)] mt-2">
                <div className="bg-[rgba(5,10,14,0.95)] p-2">
                  <span className="block text-[8px] font-mono text-[var(--gris-text-3)] tracking-[0.1em] uppercase mb-1">Impacto Previsto</span>
                  <span className="text-[12px] font-mono text-white font-bold">{selectedResource.estimatedSize}</span>
                </div>
                <div className="bg-[rgba(5,10,14,0.95)] p-2">
                  <span className="block text-[8px] font-mono text-[var(--gris-text-3)] tracking-[0.1em] uppercase mb-1">Profundidade Tática</span>
                  <span className="text-[12px] font-mono text-white font-bold">{selectedResource.depth}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleDeepScan}
                  disabled={isScanning}
                  className="flex-[2] py-3 bg-[rgba(0,255,156,0.1)] border border-[var(--gris-emerald)] hover:bg-[var(--gris-emerald)] text-[var(--gris-emerald)] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,156,0.3)] text-[10px] font-oxanium font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full animate-[slideRight_1.5s_infinite]" />
                  <Radar className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? 'EXECUTANDO...' : 'INICIAR_SCAN'}
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="flex-1 py-3 border border-[var(--gris-border-subtle)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.08)] text-white text-[10px] font-oxanium font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  PULL
                </button>
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
                     <div className="pt-3 mt-3 border-t border-[rgba(255,255,255,0.1)]">
                       <span className="block text-[9px] font-mono text-[var(--gris-emerald)] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
                         <Activity className="w-3 h-3" />
                         TELEMETRIA OBTIDA
                       </span>
                       <p className="text-[11px] font-mono text-[var(--gris-text-2)] leading-relaxed uppercase tracking-wide bg-[rgba(0,0,0,0.5)] p-3 border border-[rgba(255,255,255,0.05)]">
                         <ScrambleText text={selectedResource.description || "Nenhum relatório de inteligência detalhado disponível. Assinatura termal inconclusiva."} />
                       </p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
