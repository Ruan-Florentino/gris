'use client';

import React, { useState, useEffect, memo } from 'react';
import { ResourceData } from '@/lib/data';
import { Crosshair, Satellite, Activity, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SatelliteViewportProps {
  resource: ResourceData | null;
}

export default memo(function SatelliteViewport({ resource }: SatelliteViewportProps) {
  const [noise, setNoise] = useState(0);
  const [telemetry, setTelemetry] = useState({ alt: 35786, speed: 7.5, signal: 98.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setNoise(Math.random());
      setTelemetry(prev => ({
        alt: prev.alt + (Math.random() - 0.5) * 0.1,
        speed: prev.speed + (Math.random() - 0.5) * 0.01,
        signal: Math.min(100, Math.max(95, prev.signal + (Math.random() - 0.5) * 0.5))
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, x: -20, rotateY: 30 }}
          animate={{ scale: 1, opacity: 1, x: 0, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, x: -20, rotateY: 30 }}
          className="absolute left-1.5 bottom-20 md:left-6 md:bottom-48 w-20 h-20 md:w-64 md:h-64 z-30 pointer-events-none flex flex-col perspective-1000"
        >
          <div className="flex-1 bg-[#02040A]/90 border border-[#00E5FF]/50 rounded-sm relative overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.25)] md:shadow-[0_0_40px_rgba(0,229,255,0.25)] group">
            
            {/* Simulated Satellite Feed */}
            <div className="absolute inset-0 opacity-60 mix-blend-screen">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040A_100%)]" />
              <div className="absolute inset-0 bg-[#00E5FF]/5 animate-pulse" />
              
              {/* Static Noise */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  transform: `translate(${noise * 10}px, ${noise * 5}px)`
                }}
              />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:8px_8px] md:bg-[size:20px_20px]" />

            {/* Crosshair Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="relative w-full h-full">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#00E5FF]" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#00E5FF]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-16 md:h-16 border border-[#00E5FF] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-32 md:h-32 border border-[#00E5FF]/20 rounded-full" />
                
                {/* Corner Accents */}
                <div className="absolute top-1.5 left-1.5 md:top-4 md:left-4 w-1.5 h-1.5 md:w-4 md:h-4 border-t-2 border-l-2 border-[#00E5FF]" />
                <div className="absolute top-1.5 right-1.5 md:top-4 md:right-4 w-1.5 h-1.5 md:w-4 md:h-4 border-t-2 border-r-2 border-[#00E5FF]" />
                <div className="absolute bottom-1.5 left-1.5 md:bottom-4 md:left-4 w-1.5 h-1.5 md:w-4 md:h-4 border-b-2 border-l-2 border-[#00E5FF]" />
                <div className="absolute bottom-1.5 right-1.5 md:bottom-4 md:right-4 w-1.5 h-1.5 md:w-4 md:h-4 border-b-2 border-r-2 border-[#00E5FF]" />
              </div>
            </div>

            {/* Technical Readouts */}
            <div className="absolute top-0.5 left-0.5 right-0.5 md:top-3 md:left-3 md:right-3 flex justify-between text-[3px] md:text-[8px] text-[#00E5FF] font-mono tracking-widest font-bold">
              <div className="flex items-center gap-0.5 md:gap-2 bg-[#02040A]/60 px-0.5 py-0.5 md:px-1.5 md:py-0.5 rounded-sm border border-[#00E5FF]/20">
                <Satellite className="w-1 h-1 md:w-2.5 md:h-2.5" />
                SAT_LINK: 09
              </div>
              <div className="flex items-center gap-0.5 md:gap-2 bg-[#02040A]/60 px-0.5 py-0.5 md:px-1.5 md:py-0.5 rounded-sm border border-[#00E5FF]/20">
                <Activity className="w-1 h-1 md:w-2.5 md:h-2.5 animate-pulse" />
                LIVE_FEED
              </div>
            </div>

            <div className="absolute bottom-0.5 left-0.5 right-0.5 md:bottom-3 md:left-3 md:right-3 flex flex-col gap-0.5 md:gap-1 text-[3px] md:text-[7px] text-[#00E5FF] font-mono tracking-widest font-bold">
              <div className="flex justify-between">
                <span>ALT: {telemetry.alt.toFixed(2)} KM</span>
                <span>SPD: {telemetry.speed.toFixed(2)} KM/S</span>
              </div>
              <div className="flex justify-between">
                <span>SIG: {telemetry.signal.toFixed(1)}%</span>
                <span>LAT: {resource.lat.toFixed(4)}°</span>
              </div>
            </div>

            {/* Target Tracking Box */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 md:gap-2">
              <div className="relative">
                <div className="w-3 h-3 md:w-8 md:h-8 border-2 border-[#FF3B3B] animate-ping opacity-50" />
                <div className="absolute inset-0 w-3 h-3 md:w-8 md:h-8 border-2 border-[#FF3B3B] flex items-center justify-center">
                  <Crosshair className="w-3 h-3 text-[#FF3B3B]" />
                </div>
              </div>
              <div className="text-[4px] md:text-[7px] text-[#FF3B3B] font-black bg-[#FF3B3B]/10 border border-[#FF3B3B]/40 px-0.5 md:px-2 py-0.5 tracking-tighter">
                TARGET_LOCKED: {resource.id}
              </div>
            </div>

            {/* Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,229,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00E5FF]/40 shadow-[0_0_15px_#00E5FF] animate-[scan_3s_linear_infinite]" />
            
            {/* Glitch Overlay */}
            <div className="absolute inset-0 bg-[#FF3B3B]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay" />
          </div>

          <div className="mt-1 md:mt-2 bg-[#081018]/90 border border-[#00E5FF]/40 p-1.5 md:p-3 rounded-sm font-mono shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <div className="flex justify-between items-center mb-0.5 md:mb-1">
              <div className="text-[5px] md:text-[8px] text-[#00E5FF]/50 tracking-widest uppercase">Satellite Perspective</div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#00FF9C] rounded-full animate-pulse" />
            </div>
            <div className="text-[7px] md:text-[10px] text-[#E8F0FF] font-black tracking-widest truncate uppercase">{resource.name}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
