'use client';

import React, { memo, useState, useEffect } from 'react';
import { X, Layers, Activity, Database, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResourceData } from '@/lib/data';

interface SubsurfaceViewerProps {
  resource: ResourceData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default memo(function SubsurfaceViewer({ resource, isOpen, onClose }: SubsurfaceViewerProps) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Use a small timeout to avoid synchronous setState warning
      const timeout = setTimeout(() => setScanProgress(0), 0);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!resource) return null;

  // Generate pseudo-random depths based on resource ID
  const seed = resource.id.charCodeAt(0) + resource.id.charCodeAt(resource.id.length - 1);
  const depositDepth = 1500 + (seed * 50) % 3000; // 1500m to 4500m
  const depositThickness = 200 + (seed * 10) % 800; // 200m to 1000m

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#02040A]/80 backdrop-blur-sm pointer-events-auto"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl bg-[#081018] border border-[#00E5FF]/40 rounded-sm shadow-[0_0_50px_rgba(0,229,255,0.15)] flex flex-col overflow-hidden font-mono pointer-events-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-1.5 md:p-4 border-b border-[#00E5FF]/30 bg-[#00E5FF]/5">
              <div className="flex items-center gap-1 md:gap-3">
                <Layers className="w-3 h-3 md:w-5 md:h-5 text-[#00E5FF]" />
                <div>
                  <h2 className="text-[8px] md:text-sm font-bold tracking-[0.05em] md:tracking-[0.3em] text-[#00E5FF] uppercase">Subsurface Geological Scan</h2>
                  <div className="text-[5px] md:text-[10px] text-[#00E5FF]/60 tracking-widest uppercase mt-0.5 md:mt-1">
                    TARGET: {resource.name} | COORD: {resource.lat.toFixed(4)}, {resource.lng.toFixed(4)}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-[#00E5FF]/50 hover:text-[#00E5FF] transition-colors p-1 md:p-2">
                <X className="w-3 h-3 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden h-auto md:h-[60vh] md:min-h-[400px]">
              {/* Left Panel: Depth Chart */}
              <div className="w-full md:flex-1 relative border-b md:border-b-0 md:border-r border-[#00E5FF]/20 bg-[#02040A] overflow-hidden p-1.5 md:p-8 min-h-[150px] md:min-h-0">
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,229,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />
                
                {/* Scanning Laser */}
                {scanProgress < 100 && (
                  <div 
                    className="absolute left-0 right-0 h-[1px] md:h-[2px] bg-[#00E5FF] shadow-[0_0_15px_#00E5FF] z-30"
                    style={{ top: `${scanProgress}%` }}
                  />
                )}

                {/* Depth Scale */}
                <div className="absolute left-0.5 md:left-2 top-1.5 bottom-1.5 md:top-8 md:bottom-8 w-4 md:w-12 border-r border-[#00E5FF]/30 flex flex-col justify-between text-[4px] md:text-[8px] text-[#00E5FF]/50 z-10">
                  <span>0m</span>
                  <span>1000m</span>
                  <span>2000m</span>
                  <span>3000m</span>
                  <span>4000m</span>
                  <span>5000m</span>
                </div>

                {/* Geological Layers */}
                <div className="absolute left-8 md:left-16 right-2 md:right-8 top-2 bottom-2 md:top-8 md:bottom-8 flex flex-col opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards]">
                  {/* Radar Sweep Background */}
                  <div className="absolute inset-0 overflow-hidden opacity-30 mix-blend-screen pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,229,255,0.1)_270deg,rgba(0,229,255,0.8)_360deg)] animate-[spin_4s_linear_infinite]" />
                    <div className="absolute inset-0 border border-[#00E5FF]/20 rounded-full animate-[ping_3s_linear_infinite]" />
                  </div>

                  {/* Surface / Water */}
                  <div className="h-[10%] border-b border-[#00E5FF]/20 bg-blue-900/10 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMEU1RkYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-[7px] md:text-[10px] text-[#00E5FF]/50 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">Surface Layer / Hydrosphere</div>
                  </div>
                  {/* Sedimentary */}
                  <div className="h-[20%] border-b border-[#00E5FF]/20 bg-[#8B4513]/10 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMjBMMjAgMEw0MCAyMEwyMCA0MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwRTVGRiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-[7px] md:text-[10px] text-[#00E5FF]/50 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">Sedimentary Basin</div>
                  </div>
                  {/* Upper Crust */}
                  <div className="h-[40%] border-b border-[#00E5FF]/20 bg-[#A0522D]/10 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZD0iTTAgMEwxMCAxME0xMCAwTDAgMTAiIHN0cm9rZT0iIzAwRTVGRiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-[7px] md:text-[10px] text-[#00E5FF]/50 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">Upper Continental Crust</div>
                  </div>
                  {/* Lower Crust */}
                  <div className="h-[30%] bg-[#CD853F]/10 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMEU1RkYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center text-[7px] md:text-[10px] text-[#00E5FF]/50 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">Lower Crust / Mantle Boundary</div>
                  </div>

                  {/* The Resource Deposit */}
                  {scanProgress > (depositDepth / 5000) * 100 && (
                    <motion.div 
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      className="absolute left-1/4 right-1/4 rounded-sm border-2 border-[#00FF9C] bg-[#00FF9C]/20 shadow-[0_0_30px_rgba(0,255,156,0.4)] flex items-center justify-center overflow-hidden group"
                      style={{ 
                        top: `${(depositDepth / 5000) * 100}%`, 
                        height: `${(depositThickness / 5000) * 100}%` 
                      }}
                    >
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwRkY5QyIgc3Ryb2tlLW9wYWNpdHk9IjAuNCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50 animate-[slideRight_2s_linear_infinite]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF9C]/30 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                      <span className="relative z-10 text-[7px] md:text-[10px] font-bold text-[#00FF9C] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm text-center">
                        {resource.name.toUpperCase()} DEPOSIT
                      </span>
                      
                      {/* Targeting Reticles on Deposit */}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t-2 border-l-2 border-[#00FF9C]" />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-t-2 border-r-2 border-[#00FF9C]" />
                      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b-2 border-l-2 border-[#00FF9C]" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 md:w-2 md:h-2 border-b-2 border-r-2 border-[#00FF9C]" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Panel: Data Readout */}
              <div className="w-full md:w-64 bg-[#081018] p-1.5 md:p-4 flex flex-col gap-1.5 md:gap-4">
                <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 p-1 md:p-3 rounded-sm">
                  <div className="text-[5px] md:text-[9px] text-[#00E5FF]/60 uppercase tracking-widest mb-0.5 md:mb-1">Scan Status</div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Activity className={`w-2 h-2 md:w-4 md:h-4 ${scanProgress < 100 ? 'text-[#00FF9C] animate-pulse' : 'text-[#00E5FF]'}`} />
                    <span className={`text-[7px] md:text-xs font-bold ${scanProgress < 100 ? 'text-[#00FF9C]' : 'text-[#00E5FF]'}`}>
                      {scanProgress < 100 ? `SCANNING... ${scanProgress}%` : 'ANALYSIS COMPLETE'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 md:space-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_1s_forwards]">
                  <div>
                    <div className="text-[5px] md:text-[9px] text-[#00E5FF]/60 uppercase tracking-widest mb-0.5 md:mb-1">Estimated Depth</div>
                    <div className="text-[8px] md:text-sm font-bold text-[#E8F0FF]">{depositDepth} Meters</div>
                  </div>
                  <div>
                    <div className="text-[5px] md:text-[9px] text-[#00E5FF]/60 uppercase tracking-widest mb-0.5 md:mb-1">Deposit Thickness</div>
                    <div className="text-[8px] md:text-sm font-bold text-[#E8F0FF]">~{depositThickness} Meters</div>
                  </div>
                  <div>
                    <div className="text-[5px] md:text-[9px] text-[#00E5FF]/60 uppercase tracking-widest mb-0.5 md:mb-1">Host Rock</div>
                    <div className="text-[8px] md:text-sm font-bold text-[#E8F0FF]">
                      {resource.category === 'STRATEGIC_ENERGY' ? 'Porous Sandstone / Shale' : 'Igneous / Metamorphic'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[5px] md:text-[9px] text-[#00E5FF]/60 uppercase tracking-widest mb-0.5 md:mb-1">Extraction Complexity</div>
                    <div className="flex items-center gap-0.5 mt-0.5 md:mt-1">
                      <div className="h-0.5 md:h-1.5 flex-1 bg-[#FF3B3B] rounded-sm" />
                      <div className="h-0.5 md:h-1.5 flex-1 bg-[#FF3B3B] rounded-sm" />
                      <div className="h-0.5 md:h-1.5 flex-1 bg-[#FF3B3B]/20 rounded-sm" />
                      <div className="h-0.5 md:h-1.5 flex-1 bg-[#FF3B3B]/20 rounded-sm" />
                    </div>
                    <div className="text-[5px] md:text-[10px] text-[#FF3B3B] mt-0.5 md:mt-1 font-bold uppercase">Elevated</div>
                  </div>
                </div>

                <button className="w-full py-1 md:py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[7px] md:text-[10px] font-bold tracking-widest uppercase hover:bg-[#00E5FF]/20 transition-colors flex items-center justify-center gap-1 md:gap-2 opacity-0 animate-[fadeIn_0.5s_ease-out_1.5s_forwards]">
                  <Database className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  Export Telemetry
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
