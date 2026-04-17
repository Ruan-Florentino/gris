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
    <div className="fixed top-[50px] md:top-[60px] right-0 bottom-0 w-full md:w-[340px] bg-[#050a0e] border-l border-[#ff3030] z-40 flex flex-col pointer-events-auto animate-[slideInRight_0.3s_ease-out]">
      
      {/* Header */}
      <div className="bg-[rgba(255,48,48,0.05)] px-[14px] py-[12px] border-b border-[rgba(255,48,48,0.2)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--gris-red)] font-mono font-bold text-[12px] uppercase tracking-widest">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          SALA_DE_GUERRA
        </div>
        <button onClick={onClose} className="md:hidden text-[var(--gris-text-secondary)] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="hidden md:block text-[10px] text-[var(--gris-text-secondary)] font-mono">LINK_SEGURO</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-[14px] flex flex-col gap-6">
        
        {/* THREAT LEVEL */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono text-[var(--gris-text-secondary)] uppercase tracking-widest flex items-center justify-between">
            <span>NÍVEL DE AMEAÇA GLOBAL</span>
            <span className="text-[var(--gris-red)] font-bold">{Math.round(threatLevel)}%</span>
          </div>
          <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden border border-[rgba(255,48,48,0.2)]">
            <div 
              className="h-full bg-[var(--gris-red)] shadow-[0_0_10px_rgba(255,48,48,0.5)] transition-all duration-1000"
              style={{ width: `${threatLevel}%` }}
            />
          </div>
        </div>

        {/* ACTIVE ALERTS */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-mono text-[var(--gris-text-secondary)] uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-[var(--gris-amber)]" />
            ALERTAS ATIVOS
          </div>
          
          <div className="flex flex-col gap-2">
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
              event="RUPTURA NA CADEIA DE SUPRIMENTOS" 
              time="T-04:11:30" 
            />
          </div>
        </div>

        {/* RAPID RESPONSE */}
        <div className="flex flex-col gap-3 mt-auto">
          <div className="text-[10px] font-mono text-[var(--gris-text-secondary)] uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-[var(--gris-emerald)]" />
            RESPOSTA RÁPIDA
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <button className="w-full py-3 bg-[rgba(255,48,48,0.1)] border border-[var(--gris-red)] text-[var(--gris-red)] font-mono text-[11px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-[rgba(255,48,48,0.2)] hover:shadow-[0_0_15px_rgba(255,48,48,0.3)] transition-all flex items-center justify-center gap-2">
              <Crosshair className="w-4 h-4" />
              IMPLANTAR ATIVOS
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="w-full py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-[var(--gris-text-primary)] font-mono text-[10px] uppercase tracking-widest rounded-[4px] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
                <Radio className="w-3 h-3" />
                MONITORAR
              </button>
              <button className="w-full py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-[var(--gris-text-primary)] font-mono text-[10px] uppercase tracking-widest rounded-[4px] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" />
                NEUTRALIZAR
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
    <div className={`p-3 rounded-[4px] border bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.04)] ${
      isCritical ? 'border-[rgba(255,48,48,0.3)]' : 'border-[rgba(255,184,0,0.3)]'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm tracking-widest ${
          isCritical ? 'bg-[var(--gris-red)] text-white' : 'bg-[var(--gris-amber)] text-black'
        }`}>
          {severity}
        </span>
        <div className="flex items-center gap-1 text-[8px] font-mono text-[var(--gris-text-secondary)]">
          <Clock className="w-2.5 h-2.5" />
          {time}
        </div>
      </div>
      <div className="font-mono text-[11px] text-[var(--gris-text-primary)] uppercase font-bold mb-1">
        {event}
      </div>
      <div className="font-mono text-[9px] text-[var(--gris-text-secondary)] uppercase tracking-widest">
        LOC: {location}
      </div>
    </div>
  );
}
