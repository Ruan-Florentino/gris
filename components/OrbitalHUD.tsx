'use client';

import React, { useState, useEffect } from 'react';
import { Satellite, Activity, Zap, X, Database, Crosshair } from 'lucide-react';

interface OrbitalHUDProps {
  target: { lat: number; lng: number } | null;
  onClose: () => void;
}

export default function OrbitalHUD({ target, onClose }: OrbitalHUDProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('ALIGNING SATELLITE NETWORK...');

  useEffect(() => {
    if (!target) return;
    
    const p1 = setTimeout(() => setPhase('CALIBRATING SPECTROMETER...'), 1000);
    const p2 = setTimeout(() => setPhase('PENETRATING ATMOSPHERE...'), 2000);
    const p3 = setTimeout(() => setPhase('ANALYZING SUBSURFACE COMPOSITION...'), 3000);
    const p4 = setTimeout(() => setPhase('ORBITAL SCAN COMPLETE'), 4500);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    return () => {
      clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(p4);
      clearInterval(interval);
      // Reset state when target changes or unmounts
      setProgress(0);
      setPhase('ALIGNING SATELLITE NETWORK...');
    };
  }, [target]);

  if (!target) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none font-mono text-[#00E5FF] overflow-hidden flex items-center justify-center">
      {/* HUD Background Effects */}
      <div className="absolute inset-0 bg-[#00E5FF]/5 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,10,20,0.95)_100%)] pointer-events-none" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,229,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Main UI Container */}
      <div className="relative w-full max-w-4xl p-2 md:p-8 flex flex-col gap-2 md:gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-[#00E5FF]/30 pb-0.5 md:pb-4">
          <div>
            <div className="flex items-center gap-1 md:gap-3 text-[10px] md:text-2xl font-bold tracking-[0.05em] md:tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]">
              <Satellite className="w-3 h-3 md:w-8 md:h-8 animate-pulse" />
              ORBITAL COMMAND
            </div>
            <div className="text-[6px] md:text-sm tracking-widest mt-0.5 md:mt-2 opacity-80">SAT-LINK: KINETIC-7 // ORBIT: LEO</div>
          </div>
          <div className="text-right">
            <div className="text-[5px] md:text-sm tracking-widest opacity-80 uppercase">Target Coordinates</div>
            <div className="text-[8px] md:text-xl font-bold">{target.lat.toFixed(4)}°N, {target.lng.toFixed(4)}°E</div>
          </div>
        </div>

        {/* Center Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-8">
          
          {/* Left Panel: Status */}
          <div className="space-y-1 md:space-y-6">
            <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 p-1 md:p-4 rounded-sm backdrop-blur-md">
              <div className="text-[6px] md:text-xs tracking-widest opacity-70 mb-0.5 md:mb-2 uppercase">Current Phase</div>
              <div className="text-[7px] md:text-sm font-bold animate-pulse">{phase}</div>
            </div>

            <div className="space-y-0.5 md:space-y-2">
              <div className="flex justify-between text-[6px] md:text-xs tracking-widest uppercase">
                <span>Energy Output</span>
                <span>84.2 TW</span>
              </div>
              <div className="h-0.5 md:h-1 bg-[#00E5FF]/20">
                <div className="h-full bg-[#00E5FF] w-[84%]" />
              </div>
            </div>

            <div className="space-y-0.5 md:space-y-2">
              <div className="flex justify-between text-[6px] md:text-xs tracking-widest uppercase">
                <span>Atmospheric Interference</span>
                <span>12%</span>
              </div>
              <div className="h-0.5 md:h-1 bg-[#00E5FF]/20">
                <div className="h-full bg-[#00FF9C] w-[12%]" />
              </div>
            </div>
          </div>

          {/* Center Panel: Targeting Reticle */}
          <div className="flex items-center justify-center relative h-32 md:h-auto">
            <div className="absolute inset-0 border border-[#00E5FF]/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-2 border border-[#00E5FF]/40 rounded-full animate-[spin_7s_linear_infinite_reverse]" />
            <div className="absolute inset-4 border-2 border-[#00E5FF]/10 rounded-full" />
            
            <Crosshair className="w-16 h-16 md:w-32 md:h-32 opacity-80" strokeWidth={0.5} />
            
            {progress < 100 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] animate-[ping_2s_ease-in-out_infinite]" />
            )}
            
            <div className="absolute bottom-0 bg-[#02040A] px-1.5 md:px-4 py-0.5 md:py-1 text-sm md:text-2xl font-bold border border-[#00E5FF]/30">
              {progress}%
            </div>
          </div>

          {/* Right Panel: Data Stream */}
          <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/20 p-1.5 md:p-4 rounded-sm backdrop-blur-md flex flex-col">
            <div className="text-[7px] md:text-xs tracking-widest opacity-70 mb-1 md:mb-4 flex items-center gap-1 md:gap-2">
              <Database className="w-2.5 h-2.5 md:w-4 md:h-4" />
              SPECTROMETRY DATA
            </div>
            
            <div className="flex-1 space-y-1 md:space-y-3 overflow-hidden relative">
              <div className={`transition-opacity duration-500 ${progress > 30 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-[5px] md:text-[10px] opacity-50">SIGNATURE ALPHA</div>
                <div className="font-bold text-[8px] md:text-base">DETECTED: SILICATE MESH</div>
              </div>
              <div className={`transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-[5px] md:text-[10px] opacity-50">SIGNATURE BETA</div>
                <div className="font-bold text-[#00FF9C] text-[8px] md:text-base">ANOMALY: HEAVY METALS</div>
              </div>
              <div className={`transition-opacity duration-500 ${progress > 70 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-[5px] md:text-[10px] opacity-50">THERMAL VARIANCE</div>
                <div className="font-bold text-[#FFB800] text-[8px] md:text-base">+4.2°C ABOVE BASELINE</div>
              </div>
              <div className={`transition-opacity duration-500 ${progress > 90 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-[5px] md:text-[10px] opacity-50">CONCLUSION</div>
                <div className="font-bold text-[#00E5FF] animate-pulse text-[8px] md:text-base">HIGH YIELD POTENTIAL</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Controls */}
        <div className="flex justify-center mt-2 md:mt-8 pointer-events-auto">
          <button
            onClick={onClose}
            className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-8 md:py-3 bg-[#00E5FF]/10 border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/30 transition-colors rounded-sm font-bold tracking-[0.1em] md:tracking-[0.2em] shadow-[0_0_20px_rgba(0,229,255,0.3)] text-[10px] md:text-base"
          >
            <X className="w-3.5 h-3.5 md:w-5 md:h-5" />
            TERMINATE UPLINK
          </button>
        </div>

      </div>
    </div>
  );
}
