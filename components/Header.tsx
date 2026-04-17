'use client';

import { Shield, Globe, Activity, Lock, Radar, Satellite, Mountain, Database, Percent, Thermometer, Layers, Target, Crosshair, Menu, BarChart2, ShieldAlert, Navigation, Zap, AlertTriangle, BrainCircuit, Terminal, ChevronDown, User } from 'lucide-react';
import { MapMode } from '@/app/page';
import React, { memo, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ScrambleText } from '@/components/ScrambleText';

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
  const [time, setTime] = useState<string | null>(null);
  const [isWarRoomActive, setIsWarRoomActive] = useState(false);
  const [isTimelineActive, setIsTimelineActive] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toISOString().split('T')[1].split('.')[0]);
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
      case 5: return 'text-[var(--gris-emerald)]';
      case 4: return 'text-yellow-400';
      case 3: return 'text-[var(--gris-amber)]';
      case 2: return 'text-[var(--gris-red)]';
      case 1: return 'text-[var(--gris-red)] animate-pulse';
      default: return 'text-[var(--gris-emerald)]';
    }
  };

  const getDefconBorder = (level: number) => {
    switch(level) {
      case 5: return 'border-[var(--gris-emerald)] shadow-[0_0_8px_rgba(0,255,156,0.3)]';
      case 4: return 'border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.3)]';
      case 3: return 'border-[var(--gris-amber)] shadow-[0_0_8px_rgba(245,158,11,0.3)]';
      case 2: return 'border-[var(--gris-red)] shadow-[0_0_8px_rgba(239,68,68,0.3)]';
      case 1: return 'border-[var(--gris-red)] shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse';
      default: return 'border-[var(--gris-emerald)]';
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-[50px] md:h-[60px] bg-[rgba(0,8,16,0.95)] backdrop-blur-md border-b border-[var(--gris-border)] flex items-center justify-between px-4 md:px-6 pointer-events-auto">
      
      {/* Left: Logo & Status */}
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <div className="absolute inset-0 border border-[var(--gris-emerald)] opacity-20 rounded-sm rotate-45" />
            <Radar className="w-4 h-4 md:w-5 md:h-5 text-[var(--gris-emerald)] animate-[hud-rotate_4s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-oxanium font-bold text-lg md:text-2xl text-[var(--gris-emerald)] tracking-[6px]" style={{ textShadow: '0 0 10px rgba(0,255,156,0.5)' }}>GRIS</span>
              <span className="hidden sm:block bg-[var(--gris-red)] text-white text-[8px] md:text-[9px] font-bold px-1.5 md:px-2 py-0.5 rounded-sm tracking-[0.2em] animate-pulse">ALTAMENTE CONFIDENCIAL</span>
            </div>
            <span className="hidden md:block font-mono text-[8px] text-[var(--gris-text-secondary)] tracking-[0.3em] uppercase">Sistema Global de Inteligência</span>
          </div>
        </div>

        {/* Signal Indicators (Desktop Only) */}
        <div className="hidden xl:flex items-center gap-6 border-l border-[rgba(0,255,156,0.1)] pl-6">
          <div className="flex flex-col gap-1">
            <span className="font-oxanium text-[8px] text-[var(--gris-text-secondary)] uppercase">Link de Satélite</span>
            <div className="flex items-end gap-0.5 h-3">
              {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-[var(--gris-emerald)]" 
                  style={{ 
                    height: `${h * 100}%`,
                    animation: `signal-bar 1s ease-in-out infinite alternate ${i * 0.1}s`
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Tabs (Desktop Only) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center h-full">
        {[
          { id: 'SATELLITE', label: 'REDE SATÉLITE', icon: Satellite },
          { id: 'TIMELINE', label: 'LINHA DO TEMPO', icon: Activity, event: 'toggle-temporal-mode' },
          { id: 'WAR_ROOM', label: 'SALA DE GUERRA', icon: ShieldAlert, event: 'toggle-war-room' },
          { id: 'TACTICAL', label: 'HOLOGRAMA', icon: Layers }
        ].map((tab) => {
          const isActive = (tab.id === 'SATELLITE' && activeMode === 'SATELLITE' && !isWarRoomActive && !isTimelineActive) ||
                         (tab.id === 'TIMELINE' && isTimelineActive) ||
                         (tab.id === 'WAR_ROOM' && isWarRoomActive) ||
                         (tab.id === 'TACTICAL' && activeMode === 'TACTICAL' && !isWarRoomActive && !isTimelineActive);
          
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
              className={`h-full px-4 lg:px-8 flex flex-col items-center justify-center gap-1 transition-all relative group font-oxanium text-[10px] tracking-widest uppercase ${isActive ? 'text-[var(--gris-emerald)]' : 'text-[var(--gris-emerald-dim)] hover:text-[var(--gris-emerald)]'}`}
              style={isActive ? { textShadow: '0 0 12px rgba(0,255,156,0.5)' } : {}}
            >
              <tab.icon className={`w-4 h-4 ${isActive ? 'drop-shadow-[0_0_5px_rgba(0,255,156,0.5)]' : ''}`} />
              <span className="hidden lg:block">{tab.label}</span>
              {isActive && (
                <>
                  <div className="absolute top-1 right-2 flex gap-0.5">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i} 
                        className="w-0.5 h-2 bg-[var(--gris-emerald)] opacity-60"
                        style={{ animation: `signal-bar 0.8s ease-in-out infinite alternate ${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--gris-emerald)] shadow-[0_0_10px_rgba(0,255,156,0.5)]" />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Right: Indicators */}
      <div className="flex items-center h-full gap-4 md:gap-8">
        <div className="flex items-center gap-4 border-r border-[rgba(0,255,156,0.1)] pr-4 md:pr-8">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-oxanium text-[8px] text-[var(--gris-text-secondary)] uppercase tracking-[2px]">Relógio do Sistema</span>
            <span className="font-mono text-xs text-[var(--gris-emerald)] tabular-nums tracking-[3px]">{time}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--gris-emerald)] animate-pulse shadow-[0_0_6px_rgba(0,255,156,0.8)]" />
              <span className="font-mono text-[7px] text-[var(--gris-emerald)] opacity-50 tracking-[2px]">ONLINE</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-oxanium text-[8px] text-[var(--gris-text-secondary)] uppercase tracking-[2px] mb-1">Nível de Ameaça</span>
            <div className={`border ${getDefconBorder(defconLevel)} px-2 py-0.5 bg-black/50`}>
              <span className={`font-mono text-[10px] md:text-xs font-bold tracking-widest ${getDefconColor(defconLevel)}`}>DEFCON {defconLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onToggleStats}
            className="w-8 h-8 flex items-center justify-center relative group cursor-pointer border border-[rgba(0,255,156,0.3)] bg-[rgba(0,255,156,0.05)] hover:border-[var(--gris-emerald)] transition-colors"
            title="Dashboard de Estatísticas"
          >
            <BarChart2 className="w-4 h-4 text-[var(--gris-emerald)]" />
          </button>
          <div className="hidden sm:flex flex-col justify-center border border-[rgba(0,255,156,0.3)] bg-[rgba(0,255,156,0.05)] px-3 py-1">
            <span className="font-oxanium text-[10px] text-[var(--gris-emerald)] tracking-[2px] uppercase">OPERADOR: ALPHA-7</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes signal-bar {
          from { opacity: 0.3; }
          to { opacity: 1; }
        }
      `}</style>
    </header>
  );
});
