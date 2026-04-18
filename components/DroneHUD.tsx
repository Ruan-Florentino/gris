'use client';

import React, { useState, useEffect } from 'react';
import { Battery, Crosshair, X, AlertTriangle } from 'lucide-react';

interface DroneHUDProps {
  target: { lat: number; lng: number } | null;
  onClose: () => void;
}

export default function DroneHUD({ target, onClose }: DroneHUDProps) {
  const [time, setTime] = useState('');
  const [rec, setRec] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toISOString().split('T')[1].split('.')[0] + 'Z');
      setRec(r => !r);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!target) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none font-mono text-[#00FF9C] overflow-hidden">
      {/* Night Vision / Camera Effect */}
      <div className="absolute inset-0 bg-[#00FF9C]/10 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      {/* Static Noise Overlay */}
      <div className="noise-hud" />

      {/* Top Left */}
      <div className="absolute top-1.5 md:top-6 left-1.5 md:left-6 flex flex-col gap-0.5 md:gap-2">
        <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-2xl font-bold drop-shadow-[0_0_10px_rgba(0,255,156,0.8)]">
          <div className={`w-1.5 h-1.5 md:w-4 md:h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)] ${rec ? 'opacity-100' : 'opacity-0'}`} />
          REC
        </div>
        <div className="text-[7px] md:text-sm tracking-widest bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm">UAV-77 &quot;NIGHTOWL&quot;</div>
        <div className="text-[6px] md:text-xs opacity-80 bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm w-max">ALT: 2500M ASL</div>
      </div>

      {/* Top Right */}
      <div className="absolute top-1.5 md:top-6 right-1.5 md:right-6 flex flex-col items-end gap-0.5 md:gap-2">
        <div className="text-[10px] md:text-xl font-bold bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm">{time}</div>
        <div className="flex items-center gap-1 md:gap-2 bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm">
          <Battery className="w-2.5 h-2.5 md:w-5 md:h-5" />
          <span className="text-[7px] md:text-base">87%</span>
        </div>
        <div className="text-[6px] md:text-xs opacity-80 bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm">LINK: SECURE</div>
      </div>

      {/* Center Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-80">
        <Crosshair className="w-16 h-16 md:w-48 md:h-48 text-[#00FF9C]" strokeWidth={0.5} />
        <div className="absolute w-24 h-24 md:w-64 md:h-64 border border-[#00FF9C]/30 rounded-full" />
        <div className="absolute w-32 h-32 md:w-96 md:h-96 border border-[#00FF9C]/10 rounded-full" />
        
        {/* Animated Target Lock Box */}
        <div className="absolute w-4 h-4 md:w-12 md:h-12 border border-[#00FF9C] animate-[ping_3s_infinite] opacity-50" />
        <div className="absolute w-3 h-3 md:w-8 md:h-8 border border-red-500 animate-pulse" />
        
        {/* Pitch Ladder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-48 md:h-48 flex flex-col justify-between items-center py-1 md:py-8 pointer-events-none">
          <div className="flex items-center gap-0.5 md:gap-2"><span className="text-[4px] md:text-[8px]">+20</span><div className="w-6 md:w-16 h-px bg-[#00FF9C]/50" /><span className="text-[4px] md:text-[8px]">+20</span></div>
          <div className="flex items-center gap-0.5 md:gap-2"><span className="text-[4px] md:text-[8px]">+10</span><div className="w-8 md:w-24 h-px bg-[#00FF9C]/50" /><span className="text-[4px] md:text-[8px]">+10</span></div>
          <div className="flex items-center justify-between w-12 md:w-40">
            <div className="w-4 md:w-12 h-px bg-[#00FF9C]" />
            <div className="w-1.5 h-1.5 md:w-4 md:h-4 border border-[#00FF9C] rounded-full flex items-center justify-center"><div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-[#00FF9C] rounded-full" /></div>
            <div className="w-4 md:w-12 h-px bg-[#00FF9C]" />
          </div>
          <div className="flex items-center gap-0.5 md:gap-2"><span className="text-[4px] md:text-[8px]">-10</span><div className="w-8 md:w-24 h-px border-t border-dashed border-[#00FF9C]/50" /><span className="text-[4px] md:text-[8px]">-10</span></div>
          <div className="flex items-center gap-0.5 md:gap-2"><span className="text-[4px] md:text-[8px]">-20</span><div className="w-6 md:w-16 h-px border-t border-dashed border-[#00FF9C]/50" /><span className="text-[4px] md:text-[8px]">-20</span></div>
        </div>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-1.5 md:bottom-6 left-1.5 md:left-6 flex flex-col gap-0.5 text-[7px] md:text-xs">
        <div className="bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm w-max">TGT LAT: {target.lat.toFixed(6)}</div>
        <div className="bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded-sm backdrop-blur-sm w-max">TGT LNG: {target.lng.toFixed(6)}</div>
        <div className="mt-0.5 md:mt-2 text-red-500 flex items-center gap-1 md:gap-2 animate-pulse bg-red-500/10 px-1 md:px-3 md:py-2 rounded-sm border border-red-500/30 backdrop-blur-sm">
          <AlertTriangle className="w-2.5 h-2.5 md:w-5 md:h-5" />
          <span className="font-bold tracking-widest text-[6px] md:text-xs">UNAUTHORIZED AIRSPACE</span>
        </div>
      </div>

      {/* Bottom Right / Controls */}
      <div className="absolute bottom-1.5 md:bottom-6 right-1.5 md:right-6 pointer-events-auto">
        <button
          onClick={onClose}
          className="flex items-center gap-1 md:gap-2 px-1.5 py-1 md:px-6 md:py-3 bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/40 transition-colors rounded-sm font-bold tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.3)] text-[7px] md:text-base"
        >
          <X className="w-2.5 h-2.5 md:w-5 md:h-5" />
          RECALL DRONE
        </button>
      </div>
    </div>
  );
}
