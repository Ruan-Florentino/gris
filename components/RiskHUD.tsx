'use client';

import React, { memo, useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Activity, Info, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { riskZones, RiskZone } from '@/lib/data';

interface RiskHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

export default memo(function RiskHUD({ isOpen, onClose }: RiskHUDProps) {
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="absolute left-0 right-0 top-24 bottom-auto md:bottom-12 md:left-6 md:right-auto md:w-80 z-40 pointer-events-none flex flex-col max-h-[40vh] md:max-h-none"
        >
          <div className="flex-1 bg-[var(--gris-surface)]/95 backdrop-blur-2xl border-y md:border border-[var(--gris-red)]/40 md:rounded-sm p-2 md:p-4 pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:shadow-[0_0_40px_rgba(255,59,59,0.15)] flex flex-col font-mono relative overflow-hidden">
            
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,59,59,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

            <div className="flex justify-between items-center mb-1 md:mb-4 border-b border-[var(--gris-red)]/30 pb-0.5 md:pb-2">
              <div className="flex items-center gap-1 md:gap-2 text-[var(--gris-red)]">
                <ShieldAlert className="w-2 h-2 md:w-4 md:h-4 animate-pulse" />
                <h2 className="text-[6px] md:text-xs font-bold tracking-[0.05em] md:tracking-[0.2em] uppercase">Global Risk Analysis</h2>
              </div>
              <button onClick={onClose} className="text-[var(--gris-red)]/50 hover:text-[var(--gris-red)]">
                <X className="w-2 h-2 md:w-4 md:h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5 md:pr-2 space-y-0.5 md:space-y-4">
              {riskZones.map(zone => (
                <div 
                  key={zone.id}
                  onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                  className={`p-0.5 md:p-3 border transition-all cursor-pointer group ${
                    selectedZone?.id === zone.id 
                      ? 'bg-[var(--gris-red)]/20 border-[var(--gris-red)]' 
                      : 'bg-[var(--gris-red)]/5 border-[var(--gris-red)]/20 hover:border-[var(--gris-red)]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-0.5">
                    <div className="text-[6px] md:text-[10px] font-bold text-[var(--gris-text-primary)] tracking-wider uppercase">{zone.name}</div>
                    <div className={`text-[4px] md:text-[8px] px-1 md:px-1.5 py-0.5 rounded-full font-bold ${
                      zone.riskLevel === 'CRITICAL' ? 'bg-[var(--gris-red)] text-white' :
                      zone.riskLevel === 'ELEVATED' ? 'bg-[var(--gris-amber)] text-black' :
                      'bg-[#00FF9C] text-black'
                    }`}>
                      {zone.riskLevel}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {selectedZone?.id === zone.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[5px] md:text-[9px] text-[var(--gris-text-primary)]/70 leading-relaxed mt-0.5 md:mt-2 border-t border-[var(--gris-red)]/20 pt-0.5 md:pt-2">
                          {zone.description}
                        </p>
                        <div className="flex gap-1 md:gap-2 mt-0.5 md:mt-3">
                          <div className="flex-1 bg-black/40 p-0.5 md:p-1.5 rounded-sm border border-[var(--gris-red)]/10">
                            <div className="text-[3px] md:text-[7px] text-[var(--gris-red)]/50 uppercase mb-0.5">Vulnerability</div>
                            <div className="text-[5px] md:text-[9px] text-[var(--gris-red)]">HIGH</div>
                          </div>
                          <div className="flex-1 bg-black/40 p-0.5 md:p-1.5 rounded-sm border border-[var(--gris-red)]/10">
                            <div className="text-[3px] md:text-[7px] text-[var(--gris-red)]/50 uppercase mb-0.5">Stability</div>
                            <div className="text-[5px] md:text-[9px] text-[var(--gris-red)]">VOLATILE</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-1 md:mt-4 pt-1 md:pt-4 border-t border-[var(--gris-red)]/30">
              <div className="bg-[var(--gris-red)]/10 p-1 md:p-3 rounded-sm border border-[var(--gris-red)]/30">
                <div className="flex items-center gap-1 md:gap-2 text-[var(--gris-red)] mb-0.5 md:mb-2">
                  <Activity className="w-1.5 h-1.5 md:w-3 md:h-3" />
                  <span className="text-[5px] md:text-[9px] font-bold tracking-widest uppercase">ÍNDICE_TENSÃO_GLOBAL</span>
                </div>
                <div className="h-0.5 md:h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--gris-red)] animate-[pulse_2s_infinite]" style={{ width: '74%' }} />
                </div>
                <div className="flex justify-between text-[4px] md:text-[7px] text-[var(--gris-red)]/50 mt-0.5 md:mt-1 uppercase tracking-tighter">
                  <span>ESTÁVEL</span>
                  <span>CRÍTICO</span>
                </div>
                <div className="flex justify-between text-[7px] font-mono text-[var(--gris-text-secondary)] mt-2 uppercase tracking-wider">
                  <span>ÚLTIMA ATUALIZAÇÃO: {new Date().toISOString().split('T')[0]}</span>
                  <span className="text-[var(--gris-emerald)]">▲ +2.3%</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
