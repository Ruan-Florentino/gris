'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Lock, Activity, Radio } from 'lucide-react';

interface DefconHUDProps {
  level: number;
}

export default function DefconHUD({ level }: DefconHUDProps) {
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    if (level !== 1) return;
    const interval = setInterval(() => {
      setShowWarning(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [level]);

  if (level > 3) return null; // Only show for DEFCON 1, 2, 3

  const isCritical = level === 1;
  const color = isCritical ? '#FF0000' : level === 2 ? '#FF4500' : '#FFB800';
  const bgColor = isCritical ? 'rgba(255,0,0,0.1)' : level === 2 ? 'rgba(255,69,0,0.1)' : 'rgba(255,184,0,0.1)';

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden flex flex-col items-center justify-center font-mono">
      {/* Flashing Border */}
      {isCritical && (
        <div 
          className={`absolute inset-0 border-[8px] transition-opacity duration-500 ${showWarning ? 'opacity-100' : 'opacity-30'}`} 
          style={{ borderColor: color }}
        />
      )}
      
      {/* Vignette */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle,transparent_50%,${bgColor}_100%)]`} />

      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.05)_50%)] bg-[length:100%_4px]" />

      {/* Critical Alert Overlay */}
      {isCritical && showWarning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center flex flex-col items-center px-2">
            <ShieldAlert className="w-12 h-12 md:w-32 md:h-32 text-[#FF0000] animate-pulse mb-2 md:mb-8" />
            <h1 className="text-2xl md:text-8xl font-black text-[#FF0000] tracking-[0.1em] md:tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(255,0,0,0.8)] relative">
              <span className="absolute inset-0 translate-x-[1px] translate-y-[-1px] text-[#00E5FF] opacity-50 mix-blend-screen animate-pulse">DEFCON 1</span>
              <span className="absolute inset-0 translate-x-[-1px] translate-y-[1px] text-[#00FF9C] opacity-50 mix-blend-screen animate-pulse [animation-delay:0.1s]">DEFCON 1</span>
              <span className="relative z-10">DEFCON 1</span>
            </h1>
            <h2 className="text-sm md:text-4xl font-bold text-white tracking-[0.2em] md:tracking-[0.5em] mt-1 md:mt-4 uppercase">
              Global Lockdown
            </h2>
            <div className="mt-4 md:mt-8 flex items-center gap-1.5 md:gap-4 text-[#FF0000] border border-[#FF0000] px-3 py-1.5 md:px-8 md:py-4 bg-[#FF0000]/10">
              <Lock className="w-3 h-3 md:w-6 md:h-6 animate-pulse" />
              <span className="text-[10px] md:text-xl tracking-widest font-bold">ALL PROTOCOLS RESTRICTED</span>
            </div>
            
            {/* Scrolling Data Stream */}
            <div className="mt-4 md:mt-12 w-full max-w-2xl overflow-hidden h-12 md:h-24 relative text-left opacity-70">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF0000]/10 to-transparent" />
              <div className="animate-[slideUp_5s_linear_infinite] text-[#FF0000] text-[7px] md:text-xs tracking-widest space-y-0.5 text-center md:text-left">
                <p>AUTH-OVERRIDE: DENIED</p>
                <p>SYSTEM-INTEGRITY: COMPROMISED</p>
                <p>THREAT-VECTOR: MULTIPLE</p>
                <p>INITIATING FAILSAFE PROTOCOL OMEGA...</p>
                <p>STANDBY FOR EXECUTIVE COMMAND...</p>
                <p>AUTH-OVERRIDE: DENIED</p>
                <p>SYSTEM-INTEGRITY: COMPROMISED</p>
                <p>THREAT-VECTOR: MULTIPLE</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Status Indicator (for DEFCON 2 and 3) */}
      {!isCritical && (
        <div className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-4 bg-black/80 border px-3 py-1 md:px-6 md:py-2 backdrop-blur-md" style={{ borderColor: color }}>
          <AlertTriangle className="w-3 h-3 md:w-6 md:h-6 animate-pulse" style={{ color }} />
          <span className="text-xs md:text-xl font-bold tracking-[0.1em] md:tracking-[0.3em] uppercase" style={{ color }}>
            DEFCON {level}
          </span>
        </div>
      )}
    </div>
  );
}
