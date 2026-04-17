'use client';

import React, { memo, useState, useEffect } from 'react';
import { X, Target, Satellite, Clock, Database, Navigation, Percent, FileText, Square, Shield, Globe, Activity, FileSearch, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResourceData, RESOURCE_COLORS, RESOURCE_LABELS } from '@/lib/data';

interface DetailsPanelProps {
  resource: ResourceData | null;
  onClose: () => void;
  onGenerateBriefing: () => void;
  onSubsurfaceScan?: () => void;
}

export default memo(function DetailsPanel({ resource, onClose, onGenerateBriefing, onSubsurfaceScan }: DetailsPanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [scrambledName, setScrambledName] = useState('');

  useEffect(() => {
    if (!resource) return;

    // Decryption effect for high probability or critical resources
    if (resource.probability > 80 || resource.threatLevel === 'CRITICAL') {
      setIsDecrypting(true);
      let iterations = 0;
      const interval = setInterval(() => {
        setScrambledName(
          resource.name.split('').map(char => 
            char === ' ' ? ' ' : String.fromCharCode(65 + Math.floor(Math.random() * 26))
          ).join('')
        );
        iterations++;
        if (iterations > 20) {
          clearInterval(interval);
          setIsDecrypting(false);
        }
      }, 50);
      return () => clearInterval(interval);
    } else {
      setIsDecrypting(false);
    }
  }, [resource]);

  useEffect(() => {
    if (isDecrypting) {
      setDisplayedText('DECRYPTING CLASSIFIED INTEL...');
      return;
    }

    if (!resource?.description) {
      setDisplayedText('No detailed analysis report available for this resource at this time. Further surveying required.');
      return;
    }

    let i = 0;
    setDisplayedText('');
    const text = resource.description;
    
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
      }
    }, 20); // Fast typing speed

    return () => clearInterval(timer);
  }, [resource, isDecrypting]);

  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 md:absolute md:top-32 md:bottom-12 md:left-auto md:right-6 md:w-[400px] z-40 pointer-events-none flex flex-col max-h-[85vh] md:max-h-none pb-1 md:pb-0"
        >
          <div className="h-full bg-[#081018]/98 backdrop-blur-3xl border-t md:border border-[#00E5FF]/40 rounded-t-xl md:rounded-sm p-2 md:p-8 pointer-events-auto shadow-[0_-20px_60px_rgba(0,0,0,0.8)] md:shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col font-mono relative overflow-hidden group">
            
            {/* Hardware Accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00E5FF]/30 rounded-tl-xl md:rounded-tl-sm" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00E5FF]/30 rounded-br-sm" />

            {/* Mobile Drag Handle */}
            <div className="w-8 h-0.5 bg-[#00E5FF]/20 rounded-full mx-auto mb-1.5 md:hidden" />
            
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,229,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />

            <div className="flex justify-between items-start mb-1.5 md:mb-8 relative z-10">
              <div>
                <div className="text-[6px] md:text-[10px] text-[#00E5FF] font-black tracking-[0.1em] md:tracking-[0.3em] mb-0.5 md:mb-2 flex items-center gap-1 md:gap-2">
                  <Target className="w-2 h-2 md:w-4 md:h-4" />
                  OBJECTIVE_ID: {resource.id}
                </div>
                <h2 className={`text-sm md:text-2xl font-black uppercase tracking-[0.05em] leading-tight ${isDecrypting ? 'text-[#FFB800]' : 'text-[#E8F0FF]'}`}>
                  {isDecrypting ? scrambledName : resource.name}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1 md:p-2 hover:bg-[#FF3B3B]/20 text-[#00E5FF] hover:text-[#FF3B3B] rounded-sm transition-all border border-white/5 hover:border-[#FF3B3B]/50 group/close"
              >
                <X className="w-2.5 h-2.5 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-3 space-y-1.5 md:space-y-8 relative z-10">
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-0.5 md:gap-1 bg-white/2 border border-white/5 p-1 md:p-2 rounded-sm">
                <DetailRow label="CLASSIFICATION" value={resource.classification || 'SECRET'} icon={<Shield />} color={resource.threatLevel === 'CRITICAL' ? '#FF3B3B' : '#FFB800'} highlight />
                <DetailRow label="ASSET_TYPE" value={RESOURCE_LABELS[resource.type]} icon={<Database />} color={RESOURCE_COLORS[resource.type]} />
                <DetailRow label="GEOLOCATION" value={resource.country} icon={<Globe />} />
                <DetailRow label="COORDINATES" value={`${resource.lat.toFixed(4)}°N, ${resource.lng.toFixed(4)}°E`} icon={<Navigation />} />
                <DetailRow label="ALT_DEPTH" value={resource.depth} icon={<Activity />} />
                <DetailRow label="INTEL_SOURCE" value={resource.source || 'NRO_SATELLITE_72'} icon={<Satellite />} />
              </div>

              {/* Description */}
              <div className="pt-1.5 md:pt-6 border-t border-white/10">
                <div className="text-[6px] md:text-[10px] text-[#00E5FF] font-black tracking-[0.1em] md:tracking-[0.3em] mb-0.5 md:mb-4 flex items-center gap-1 md:gap-2">
                  <FileText className="w-2 h-2 md:w-4 md:h-4" />
                  ANALYSIS_REPORT
                </div>
                <div className="bg-white/2 border border-white/5 p-1 md:p-4 rounded-sm relative">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00FF9C]/50" />
                  <p className="text-[7px] md:text-[11px] text-[#E8F0FF]/90 leading-relaxed tracking-wide min-h-[25px] md:min-h-[80px] font-medium">
                    {displayedText}
                    <span className="inline-block w-0.5 h-2 md:w-2 md:h-4 bg-[#00FF9C] ml-1 animate-pulse align-middle" />
                  </p>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="pt-1.5 md:pt-6 border-t border-white/10">
                <div className="flex justify-between items-end mb-0.5 md:mb-3">
                  <div className="text-[6px] md:text-[10px] text-[#00E5FF] font-black tracking-[0.1em] md:tracking-[0.3em] flex items-center gap-1 md:gap-2 uppercase">
                    <Percent className="w-2 h-2 md:w-4 md:h-4" />
                    CONFIDENCE_SCORE
                  </div>
                  <div className="text-[10px] md:text-lg font-black text-[#00FF9C] tracking-tighter leading-none">{resource.probability}%</div>
                </div>
                <div className="h-0.5 md:h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.probability}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#00E5FF] via-[#00FF9C] to-[#00FF9C] shadow-[0_0_10px_rgba(0,255,156,0.3)]" 
                  />
                </div>
              </div>

              {/* Geological Composition */}
              <div className="pt-1.5 md:pt-6 border-t border-white/10">
                <div className="text-[6px] md:text-[10px] text-[#00E5FF] font-black tracking-[0.1em] md:tracking-[0.3em] mb-1 md:mb-5 flex items-center gap-1 md:gap-2 uppercase">
                  <Activity className="w-2 h-2 md:w-4 md:h-4" />
                  GEOLOGICAL_COMPOSITION
                </div>
                <div className="grid grid-cols-1 gap-0.5 md:gap-4">
                  <CompositionBar label="SILICA_CONTENT" value={45} color="#00E5FF" />
                  <CompositionBar label="FERROUS_METALS" value={28} color="#FF3B3B" />
                  <CompositionBar label="MAGNESIUM_OXIDE" value={15} color="#00FF9C" />
                  <CompositionBar label="TRACE_ELEMENTS" value={12} color="#FFB800" />
                </div>
              </div>

              {/* Tactical Analysis */}
              <div className="pt-1.5 md:pt-6 border-t border-white/10 pb-1 md:pb-6">
                <div className="text-[6px] md:text-[10px] text-[#00E5FF] font-black tracking-[0.1em] md:tracking-[0.3em] mb-1 md:mb-5 flex items-center gap-1 md:gap-2 uppercase">
                  <Shield className="w-2 h-2 md:w-4 md:h-4" />
                  TACTICAL_ASSESSMENT
                </div>
                <div className="grid grid-cols-2 gap-1 md:gap-4 mb-1.5 md:mb-6">
                  <div className="bg-white/2 border border-white/5 p-1 md:p-3 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-[#FF3B3B]/50" />
                    <div className="text-[4px] md:text-[9px] text-white/30 tracking-widest mb-0.5 md:mb-1.5 font-bold uppercase">Threat Level</div>
                    <div className={`text-[7px] md:text-xs font-black tracking-[0.05em] md:tracking-[0.2em] ${resource.threatLevel === 'CRITICAL' ? 'text-[#FF3B3B]' : 'text-[#00FF9C]'}`}>
                      {resource.threatLevel || 'LOW_RISK'}
                    </div>
                  </div>
                  <div className="bg-white/2 border border-white/5 p-1 md:p-3 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-[#FFB800]/50" />
                    <div className="text-[4px] md:text-[9px] text-white/30 tracking-widest mb-0.5 md:mb-1.5 font-bold uppercase">Strategic Val</div>
                    <div className="text-[7px] md:text-xs font-black text-[#FFB800] tracking-[0.05em] md:tracking-[0.2em]">
                      {resource.probability > 80 ? 'PRIORITY_1' : 'PRIORITY_2'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 md:gap-3">
                  <button 
                    onClick={onGenerateBriefing}
                    className="w-full flex items-center justify-center gap-1 md:gap-3 py-1 md:py-4 bg-[#00FF9C]/5 border border-[#00FF9C]/30 text-[#00FF9C] hover:bg-[#00FF9C]/15 transition-all rounded-sm group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    <FileSearch className="w-2.5 h-2.5 md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[7px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.3em] uppercase">Generate Briefing</span>
                  </button>
                  {onSubsurfaceScan && (
                    <button 
                      onClick={onSubsurfaceScan}
                      className="w-full flex items-center justify-center gap-1 md:gap-3 py-1 md:py-4 bg-[#00E5FF]/5 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/15 transition-all rounded-sm group/btn relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      <Layers className="w-2.5 h-2.5 md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[7px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.3em] uppercase">Subsurface Scan</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

function CompositionBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-0.5 md:space-y-1">
      <div className="flex justify-between text-[6px] md:text-[8px] tracking-widest text-[#E8F0FF]/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-0.5 md:h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon, color, highlight }: { label: string, value: React.ReactNode, icon?: React.ReactNode, color?: string, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 md:py-2 border-b border-[#00E5FF]/20 last:border-0">
      <span className="text-[8px] md:text-[10px] text-[#00E5FF]/70 tracking-widest flex items-center gap-1.5 md:gap-2">
        {icon && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-2.5 h-2.5 md:w-3 md:h-3', style: { color: color || 'inherit' } })}
        {label}
      </span>
      <span className={`text-[9px] md:text-xs tracking-wider text-right ${highlight ? 'text-[#00FF9C] font-bold' : 'text-[#E8F0FF]'}`}>
        {value}
      </span>
    </div>
  );
}
