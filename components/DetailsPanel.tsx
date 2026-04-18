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
          className="fixed bottom-0 left-0 right-0 md:absolute md:top-32 md:bottom-12 md:left-auto md:right-6 md:w-[420px] z-40 pointer-events-none flex flex-col max-h-[85vh] md:max-h-none pb-1 md:pb-0"
        >
          <div className="panel h-full flex flex-col pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[var(--gris-border)] backdrop-blur-3xl group">
            
            {/* Edge Accents */}
            <div className="bracket-corners absolute inset-0 pointer-events-none" />

            {/* Mobile Drag Handle */}
            <div className="w-8 h-1 bg-[var(--gris-border)] rounded-full mx-auto my-2 md:hidden" />
            
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

            <div className="panel-header flex justify-between items-center relative z-10 shrink-0">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                <span>OBJECTIVE_ID: <span className="text-[var(--gris-text-1)]">{resource.id}</span></span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-[var(--gris-danger)] hover:text-white text-[var(--gris-text-2)] transition-all rounded-sm group/close"
              >
                <X className="w-4 h-4 group-hover/close:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 relative z-10">
              
              {/* Header Title */}
              <div>
                <h2 className={`font-oxanium text-lg md:text-2xl font-black uppercase tracking-widest leading-tight ${isDecrypting ? 'text-[var(--gris-amber)]' : 'text-[var(--gris-text-1)]'}`}>
                  {isDecrypting ? scrambledName : resource.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-1 border border-[var(--gris-border)] p-2 rounded-sm bg-black/40">
                <DetailRow label="CLASSIFIC." value={resource.classification || 'SECRET'} icon={<Shield />} color={resource.threatLevel === 'CRITICAL' ? 'var(--gris-danger)' : 'var(--gris-amber)'} highlight />
                <DetailRow label="ASSET_TYPE" value={RESOURCE_LABELS[resource.type]} icon={<Database />} color={RESOURCE_COLORS[resource.type]} />
                <DetailRow label="GEOLOCATION" value={resource.country} icon={<Globe />} />
                <DetailRow label="COORDINATES" value={`${resource.lat.toFixed(4)}°N, ${resource.lng.toFixed(4)}°E`} icon={<Navigation />} />
                <DetailRow label="ALT_DEPTH" value={resource.depth} icon={<Activity />} />
                <DetailRow label="INTEL_SRC" value={resource.source || 'NRO_SATELLITE_72'} icon={<Satellite />} />
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-[var(--gris-border)]">
                <div className="section-header">
                  <FileText className="w-3.5 h-3.5" />
                  ANALYSIS_REPORT
                </div>
                <div className="bg-[var(--gris-card)] border border-[var(--gris-border)] p-3 rounded-sm relative">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[var(--gris-emerald)]" />
                  <p className="font-mono text-[11px] text-[var(--gris-text-2)] leading-relaxed tracking-wide min-h-[60px]">
                    {displayedText}
                    <span className="inline-block w-1.5 h-3 bg-[var(--gris-emerald)] ml-1 animate-pulse align-middle" />
                  </p>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="pt-4 border-t border-[var(--gris-border)]">
                <div className="flex justify-between items-end mb-2">
                  <div className="section-header mb-0">
                    <Percent className="w-3.5 h-3.5" />
                    CONFIDENCE_SCORE
                  </div>
                  <div className="font-oxanium text-lg font-black text-glow-emerald text-[var(--gris-emerald)] leading-none">{resource.probability}%</div>
                </div>
                <div className="progress-track">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${resource.probability}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="progress-fill glow-emerald" 
                  />
                </div>
              </div>

              {/* Geological Composition */}
              <div className="pt-4 border-t border-[var(--gris-border)]">
                <div className="section-header">
                  <Activity className="w-3.5 h-3.5" />
                  GEOLOGICAL_COMPOSITION
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <CompositionBar label="SILICA_CONTENT" value={45} color="var(--gris-sky)" />
                  <CompositionBar label="FERROUS_METALS" value={28} color="var(--gris-danger)" />
                  <CompositionBar label="MAGNESIUM_OXIDE" value={15} color="var(--gris-emerald)" />
                  <CompositionBar label="TRACE_ELEMENTS" value={12} color="var(--gris-amber)" />
                </div>
              </div>

              {/* Tactical Analysis */}
              <div className="pt-4 border-t border-[var(--gris-border)] pb-2">
                <div className="section-header">
                  <Shield className="w-3.5 h-3.5" />
                  TACTICAL_ASSESSMENT
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="metric-card relative">
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-[var(--gris-danger)]" />
                    <div className="metric-label">Threat Level</div>
                    <div className={`metric-value ${resource.threatLevel === 'CRITICAL' ? 'text-[var(--gris-danger)]' : 'text-[var(--gris-emerald)]'}`}>
                      {resource.threatLevel || 'LOW_RISK'}
                    </div>
                  </div>
                  <div className="metric-card relative">
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-[var(--gris-amber)]" />
                    <div className="metric-label">Strategic Val</div>
                    <div className="metric-value text-[var(--gris-amber)]">
                      {resource.probability > 80 ? 'PRIORITY_1' : 'PRIORITY_2'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={onGenerateBriefing}
                    className="btn-tactical w-full flex items-center justify-center gap-2 py-3"
                  >
                    <FileSearch className="w-4 h-4" />
                    <span className="font-black text-[11px]">Generate Briefing</span>
                  </button>
                  {onSubsurfaceScan && (
                    <button 
                      onClick={onSubsurfaceScan}
                      className="btn-tactical w-full flex items-center justify-center gap-2 py-3 !border-[var(--gris-sky)] !text-[var(--gris-sky)] hover:!bg-[rgba(56,189,248,0.1)] hover:glow-sky"
                    >
                      <Layers className="w-4 h-4" />
                      <span className="font-black text-[11px]">Subsurface Scan</span>
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
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-[9px] tracking-widest text-[var(--gris-text-2)]">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="progress-track" style={{ height: '2px' }}>
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon, color, highlight }: { label: string, value: React.ReactNode, icon?: React.ReactNode, color?: string, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--gris-border)] last:border-0">
      <span className="font-mono text-[10px] text-[var(--gris-text-3)] tracking-widest flex items-center gap-2">
        {icon && React.cloneElement(icon as React.ReactElement<any>, { className: 'w-3 h-3', style: { color: color || 'inherit' } })}
        {label}
      </span>
      <span className={`font-mono text-[10px] tracking-wider text-right uppercase ${highlight ? 'text-glow-emerald text-[var(--gris-emerald)] font-bold' : 'text-[var(--gris-text-1)]'}`}>
        {value}
      </span>
    </div>
  );
}
