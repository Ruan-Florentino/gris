'use client';

import { 
  Satellite, 
  Map as Mountain, 
  Target, 
  ShieldAlert, 
  Activity, 
  User
} from 'lucide-react';
import { MapMode } from '@/app/page';
import React, { memo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import GrisLogo from '@/components/GrisLogo';

interface HeaderProps {
  activeMode: MapMode;
  onModeChange: (mode: MapMode) => void;
  onToggleSidebar: () => void;
  onToggleStats: () => void;
  onToggleAI: () => void;
  defconLevel: number;
  onDefconChange: (level: number) => void;
}

export default memo(function Header({ activeMode, onModeChange, onToggleSidebar, onToggleStats, onToggleAI, defconLevel, onDefconChange }: HeaderProps) {
  const [time, setTime] = useState<string>('00:00:00');
  const [isWarRoomActive, setIsWarRoomActive] = useState(false);
  const [isTimelineActive, setIsTimelineActive] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toISOString().split('T')[1].split('.')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleWarRoom = () => setIsWarRoomActive(prev => !prev);
    const handleTimeline = () => setIsTimelineActive(prev => !prev);
    window.addEventListener('toggle-war-room', handleWarRoom);
    window.addEventListener('toggle-temporal-mode', handleTimeline);
    return () => {
      window.removeEventListener('toggle-war-room', handleWarRoom);
      window.removeEventListener('toggle-temporal-mode', handleTimeline);
    };
  }, []);

  const getDefconColor = (level: number) => {
    switch(level) {
      case 5: return 'text-[var(--gris-emerald)] border-[var(--gris-emerald)]';
      case 4: return 'text-yellow-400 border-yellow-400';
      case 3: return 'text-[var(--gris-amber)] border-[var(--gris-amber)]';
      case 2: return 'text-[var(--gris-red)] border-[var(--gris-red)]';
      case 1: return 'text-[var(--gris-red)] border-[var(--gris-red)] animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]';
      default: return 'text-[var(--gris-emerald)] border-[var(--gris-emerald)]';
    }
  };

  const tabs = [
    { id: 'SATELLITE', label: 'SAT', icon: Satellite },
    { id: 'RESOURCES', label: 'GEO', icon: Mountain },
    { id: 'TACTICAL', label: 'TAT', icon: Target },
    { id: 'WAR_ROOM', label: 'WAR', icon: ShieldAlert, event: 'toggle-war-room' },
    { id: 'TIMELINE', label: 'TIME', icon: Activity, event: 'toggle-temporal-mode' }
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-4 sm:px-6 pointer-events-auto bg-[rgba(0,8,16,0.95)] backdrop-blur-md border-b border-transparent [border-image:linear-gradient(to_right,rgba(0,255,156,0.8),transparent)_1]">
      
      {/* Left: Logo & Badge */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="relative">
            <GrisLogo 
              size={32} 
              className="relative z-10 animate-float drop-shadow-[0_0_8px_rgba(0,255,156,0.6)]"
            />
            <div className="absolute inset-0 bg-[var(--gris-emerald)] opacity-20 blur-xl animate-pulse-glow" />
          </div>
          <div className="flex flex-col">
            <span className="font-oxanium font-black text-xl tracking-[0.2em] text-white leading-none group-hover:text-[var(--gris-emerald)] transition-colors">
              GRIS
            </span>
            <span className="font-mono text-[8px] text-[var(--gris-emerald)] opacity-50 tracking-[0.3em] uppercase hidden sm:block">
              Orbital_Intelligence
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center px-2 py-0.5 border border-[var(--gris-red)] bg-red-500/10 rounded-sm animate-pulse">
          <span className="font-mono text-[9px] text-[var(--gris-red)] uppercase font-bold tracking-widest whitespace-nowrap">
            Altamente Confidencial
          </span>
        </div>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="flex items-center h-full justify-center flex-none gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const isActive = (tab.id === 'SATELLITE' && activeMode === 'SATELLITE' && !isWarRoomActive && !isTimelineActive) ||
                         (tab.id === 'RESOURCES' && activeMode === 'RESOURCES' && !isWarRoomActive && !isTimelineActive) ||
                         (tab.id === 'TACTICAL' && activeMode === 'TACTICAL' && !isWarRoomActive && !isTimelineActive) ||
                         (tab.id === 'TIMELINE' && isTimelineActive) ||
                         (tab.id === 'WAR_ROOM' && isWarRoomActive);
          
          return (
            <button 
              key={tab.id}
              onClick={() => {
                if (tab.event) {
                  window.dispatchEvent(new CustomEvent(tab.event));
                } else {
                  onModeChange(tab.id as MapMode);
                  setIsWarRoomActive(false);
                  setIsTimelineActive(false);
                }
              }}
              className={`h-full relative flex items-center gap-1.5 px-3 sm:px-4 transition-colors font-oxanium text-[11px] sm:text-[13px] uppercase tracking-widest font-bold
                ${isActive ? 'text-[var(--gris-emerald)] bg-[rgba(0,255,156,0.1)]' : 'text-[var(--gris-text-muted)] hover:text-white'}
              `}
            >
              <tab.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive ? (tab.id === 'SAT' ? 'animate-spin' : tab.id === 'WAR' ? 'animate-pulse' : '') : ''}`} />
              <span className="hidden sm:inline-block">{tab.label}</span>
              
              {/* Active Indicators */}
              {isActive && (
                <>
                  {/* Bottom line */}
                  <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--gris-emerald)] shadow-[0_0_10px_rgba(0,255,156,0.8)]" />
                  
                  {/* Signal bars */}
                  <div className="absolute top-2 right-2 flex gap-[1px] items-end h-2 hidden sm:flex">
                    <div className="w-[1px] bg-[var(--gris-emerald)] h-1 animate-[signal-bar_1s_infinite_alternate]" />
                    <div className="w-[1px] bg-[var(--gris-emerald)] h-1.5 animate-[signal-bar_0.8s_infinite_alternate]" />
                    <div className="w-[1px] bg-[var(--gris-emerald)] h-2 animate-[signal-bar_1.2s_infinite_alternate]" />
                  </div>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Status, Clock, DEFCON, Avatar */}
      <div className="flex items-center justify-end gap-3 sm:gap-6 flex-1">
        
        {/* Status Online */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="status-dot active" />
          <span className="font-mono text-[10px] text-[var(--gris-emerald)] tracking-widest uppercase">Online</span>
        </div>

        {/* DEFCON Slider/Indicator */}
        <div 
           className={`hidden sm:flex items-center px-2 py-1 border transition-all cursor-pointer ${getDefconColor(defconLevel)}`}
           onClick={() => onDefconChange(defconLevel > 1 ? defconLevel - 1 : 5)}
           title="Click to sequence DEFCON status"
        >
          <span className="font-oxanium text-[10px] font-bold tracking-[0.2em] uppercase">DEFCON {defconLevel}</span>
        </div>

        {/* Clock */}
        <div className="font-mono text-[12px] text-[var(--gris-text-secondary)] tracking-widest hidden md:block">
          {time}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full border border-[var(--gris-emerald)] bg-[rgba(0,255,156,0.05)] flex items-center justify-center glow-emerald shadow-inner relative cursor-pointer">
          <div className="absolute inset-0 rounded-full border border-[var(--gris-emerald)] animate-ping opacity-20" />
          <span className="font-oxanium text-[9px] text-[var(--gris-emerald)] tracking-wider">A-7</span>
        </div>
      </div>
      
    </header>
  );
});
