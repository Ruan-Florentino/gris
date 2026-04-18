'use client';

import React, { memo, useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Crosshair, Zap, Radio, Clock, Activity, X } from 'lucide-react';
import { ResourceData } from '@/lib/data';

interface WarRoomProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResourceData[];
}

export default memo(function WarRoom({ isOpen, onClose, data }: WarRoomProps) {
  const [threatLevel, setThreatLevel] = useState(85);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setThreatLevel(prev => Math.min(100, Math.max(70, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-[56px] right-0 bottom-0 w-full md:w-[380px] bg-[rgba(5,10,14,0.95)] backdrop-blur-2xl border-l border-[var(--gris-red)] z-40 flex flex-col pointer-events-auto shadow-[-20px_0_50px_rgba(239,68,68,0.15)] animate-[slideInRight_0.3s_ease-out]">
      
      {/* HUD Corner Decorators */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--gris-red)] opacity-50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--gris-red)] opacity-50" />
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      {/* Header */}
      <div className="relative bg-[rgba(239,68,68,0.1)] px-4 py-3 border-b border-[rgba(239,68,68,0.3)] flex items-center justify-between z-10">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[linear-gradient(90deg,var(--gris-red),transparent)]" />
        <div className="flex items-center gap-3 text-[var(--gris-red)] font-oxanium font-bold text-[14px] uppercase tracking-[0.3em]">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          SALA_DE_GUERRA
        </div>
        <button onClick={onClose} className="md:hidden p-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[var(--gris-text-2)] hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="hidden md:flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-[var(--gris-red)] rounded-full animate-pulse blur-[1px]" />
          <div className="text-[9px] text-[var(--gris-red)] font-mono tracking-wider">UPLINK ATIVO</div>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-8 z-10">
        
        {/* THREAT LEVEL */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-oxanium text-[var(--gris-text-2)] uppercase tracking-[0.2em] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-1 h-3 bg-[var(--gris-red)]" /> NÍVEL DE AMEAÇA GLOBAL
            </span>
            <span className="text-[var(--gris-red)] font-mono font-bold text-[14px] glow-red">{Math.round(threatLevel)}%</span>
          </div>
          <div className="h-2.5 bg-[rgba(255,255,255,0.05)] rounded-sm overflow-hidden border border-[rgba(239,68,68,0.3)] p-[1px]">
            <div 
              className="h-full bg-[var(--gris-red)] rounded-[1px] shadow-[0_0_10px_var(--gris-red)] transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${threatLevel}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] -translate-x-full animate-[slideRight_1.5s_infinite]" />
            </div>
          </div>
        </div>

        {/* ACTIVE ALERTS */}
        <div className="flex flex-col gap-4">
          <div className="text-[11px] font-oxanium text-[var(--gris-emerald)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--gris-border-subtle)] pb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--gris-amber)]" />
            VETORES DE ALERTA ATIVOS
          </div>
          
          <div className="flex flex-col gap-3">
            <AlertCard 
              severity="CRÍTICO" 
              location="MAR DO SUL DA CHINA" 
              event="PERFURAÇÃO NÃO AUTORIZADA" 
              time="T-00:15:22" 
            />
            <AlertCard 
              severity="ALTO" 
              location="BACIA DA SIBÉRIA" 
              event="ANOMALIA SÍSMICA" 
              time="T-01:42:05" 
            />
            <AlertCard 
              severity="ALTO" 
              location="CINTURÃO DO CONGO" 
              event="RUPTURA DE CADEIA MAGNÉTICA" 
              time="T-04:11:30" 
            />
          </div>
        </div>

        {/* RAPID RESPONSE */}
        <div className="flex flex-col gap-4 mt-auto">
          <div className="text-[11px] font-oxanium text-[var(--gris-emerald)] uppercase tracking-[0.2em] flex items-center gap-2 border-b border-[var(--gris-border-subtle)] pb-2">
            <Activity className="w-3.5 h-3.5" />
            PROTOCOLO DE RESPOSTA
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full py-4 bg-[rgba(239,68,68,0.1)] border border-[var(--gris-red)] text-[var(--gris-red)] font-oxanium text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--gris-red)] hover:text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[slideRight_1s_infinite]" />
              <Crosshair className="w-4 h-4" />
              IMPLANTAR CONTRAMEDIDAS
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white font-oxanium text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[var(--gris-sky)]" />
                MONITORAR
              </button>
              <button className="w-full py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-white font-oxanium text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[var(--gris-amber)]" />
                INTERCEPTAR
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

function AlertCard({ severity, location, event, time }: { severity: string, location: string, event: string, time: string }) {
  const isCritical = severity === 'CRÍTICO';
  return (
    <div className={`p-4 border bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.05)] relative overflow-hidden group ${
      isCritical ? 'border-[rgba(239,68,68,0.3)]' : 'border-[rgba(245,158,11,0.3)]'
    }`}>
      {/* Colored Left Edge */}
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${isCritical ? 'bg-[var(--gris-red)]' : 'bg-[var(--gris-amber)]'}`} />
      
      {/* Background Glitch on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[linear-gradient(transparent_50%,rgba(255,255,255,1)_50%)] bg-[length:100%_4px] pointer-events-none transition-opacity" />

      <div className="flex items-center justify-between mb-3 pl-2">
        <span className={`text-[9px] font-oxanium font-bold px-2 py-0.5 tracking-[0.1em] uppercase ${
          isCritical ? 'bg-[var(--gris-red)] text-white' : 'bg-[var(--gris-amber)] text-black'
        }`}>
          {severity}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--gris-text-2)] bg-[rgba(0,0,0,0.5)] px-2 py-0.5 rounded-sm">
          <Clock className="w-3 h-3" />
          {time}
        </div>
      </div>
      <div className="font-inter text-[13px] text-white uppercase font-bold mb-1.5 pl-2 tracking-wide">
        {event}
      </div>
      <div className="font-mono text-[10px] text-[var(--gris-text-2)] uppercase tracking-widest pl-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" /> LOC: {location}
      </div>
    </div>
  );
}

