'use client';

import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, Satellite, Zap, Shield, AlertTriangle, CheckCircle2, Loader2, Target } from 'lucide-react';

interface Mission {
  id: string;
  type: 'RECONHECIMENTO_DRONE' | 'VARREDURA_ORBITAL' | 'INFILTRAÇÃO_CIBERNÉTICA' | 'SONDA_GEOLÓGICA';
  status: 'ATIVO' | 'CONCLUÍDO' | 'FALHOU' | 'PENDENTE';
  progress: number;
  target: string;
  startTime: string;
}

export default memo(function MissionControl() {
  const [missions, setMissions] = useState<Mission[]>([
    { id: 'MSN-001', type: 'RECONHECIMENTO_DRONE', status: 'ATIVO', progress: 64, target: 'Setor 7G', startTime: '14:20:05' },
    { id: 'MSN-002', type: 'VARREDURA_ORBITAL', status: 'CONCLUÍDO', progress: 100, target: 'Fossa das Marianas', startTime: '13:45:12' },
    { id: 'MSN-003', type: 'INFILTRAÇÃO_CIBERNÉTICA', status: 'FALHOU', progress: 12, target: 'Nó 04', startTime: '15:10:30' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMissions(prev => prev.map(m => {
        if (m.status === 'ATIVO') {
          const nextProgress = m.progress + Math.random() * 2;
          if (nextProgress >= 100) {
            return { ...m, progress: 100, status: 'CONCLUÍDO' };
          }
          return { ...m, progress: nextProgress };
        }
        return m;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 md:gap-4 p-1 md:p-4 font-mono">
      <div className="flex items-center justify-between mb-0.5 md:mb-2">
        <div className="flex items-center gap-1 md:gap-2 text-[#00FF9C]">
          <Crosshair className="w-1.5 h-1.5 md:w-4 md:h-4" />
          <span className="text-[5px] md:text-xs font-bold tracking-[0.05em] md:tracking-[0.2em]">CONTROLE TÁTICO DE MISSÕES</span>
        </div>
        <div className="flex items-center gap-0.5 md:gap-1">
          <div className="w-0.5 h-0.5 md:w-2 md:h-2 bg-[#00FF9C] rounded-full animate-pulse" />
          <span className="text-[4px] md:text-[10px] text-[#00FF9C]/70 uppercase">Online</span>
        </div>
      </div>

      <div className="space-y-1 md:space-y-3">
        <AnimatePresence mode="popLayout">
          {missions.map((mission) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative bg-[#081018]/80 border p-1 md:p-3 rounded-sm transition-all ${
                mission.status === 'ATIVO' ? 'border-[#00FF9C]/40 shadow-[0_0_15px_rgba(0,255,156,0.1)]' :
                mission.status === 'CONCLUÍDO' ? 'border-[#00E5FF]/30 opacity-80' :
                'border-[#FF3B3B]/30 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-0.5 md:mb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-[5px] md:text-[10px] font-black text-[#E8F0FF]">{mission.id}</span>
                    <span className={`text-[3px] md:text-[8px] px-1 py-0.5 rounded-xs ${
                      mission.status === 'ATIVO' ? 'bg-[#00FF9C]/20 text-[#00FF9C]' :
                      mission.status === 'CONCLUÍDO' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' :
                      'bg-[#FF3B3B]/20 text-[#FF3B3B]'
                    }`}>
                      {mission.status}
                    </span>
                  </div>
                  <span className="text-[4px] md:text-[9px] text-[#00E5FF]/70 mt-0.5 md:mt-1 uppercase tracking-widest">{mission.type.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-[4px] md:text-[9px] text-[#E8F0FF]/50">{mission.startTime}</div>
              </div>

              <div className="flex items-center gap-1 md:gap-3 mb-0.5 md:mb-2">
                <div className="flex-1 h-0.5 md:h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${
                      mission.status === 'ATIVO' ? 'bg-[#00FF9C]' :
                      mission.status === 'CONCLUÍDO' ? 'bg-[#00E5FF]' :
                      'bg-[#FF3B3B]'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${mission.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-[5px] md:text-[10px] font-bold text-[#E8F0FF] w-3 md:w-8 text-right">{Math.floor(mission.progress)}%</span>
              </div>

              <div className="flex items-center justify-between text-[4px] md:text-[9px]">
                <div className="flex items-center gap-1 text-[#00E5FF]/70">
                  <Target className="w-1.5 md:w-3 h-1.5 md:h-3" />
                  ALVO: {mission.target}
                </div>
                {mission.status === 'ATIVO' && (
                  <div className="flex items-center gap-1 text-[#00FF9C] animate-pulse">
                    <Loader2 className="w-1.5 md:w-3 h-1.5 md:h-3 animate-spin" />
                    PROCESSANDO
                  </div>
                )}
                {mission.status === 'CONCLUÍDO' && (
                  <div className="flex items-center gap-1 text-[#00E5FF]">
                    <CheckCircle2 className="w-1.5 md:w-3 h-1.5 md:h-3" />
                    DADOS SINCRONIZADOS
                  </div>
                )}
                {mission.status === 'FALHOU' && (
                  <div className="flex items-center gap-1 text-[#FF3B3B]">
                    <AlertTriangle className="w-1.5 md:w-3 h-1.5 md:h-3" />
                    INTERROMPIDO
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => {
          const types: Mission['type'][] = ['RECONHECIMENTO_DRONE', 'VARREDURA_ORBITAL', 'INFILTRAÇÃO_CIBERNÉTICA', 'SONDA_GEOLÓGICA'];
          const targets = ['Setor 7G', 'Fossa das Marianas', 'Nó 04', 'Plataforma Ártica', 'Triângulo do Lítio', 'Campo de Ghawar'];
          const newMission: Mission = {
            id: `MSN-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
            type: types[Math.floor(Math.random() * types.length)],
            status: 'ATIVO',
            progress: 0,
            target: targets[Math.floor(Math.random() * targets.length)],
            startTime: new Date().toLocaleTimeString([], { hour12: false })
          };
          setMissions(prev => [newMission, ...prev].slice(0, 5)); // Keep max 5 missions
        }}
        className="mt-1 md:mt-2 w-full py-1 md:py-2 bg-[#00FF9C]/10 border border-[#00FF9C]/30 text-[#00FF9C] text-[6px] md:text-[10px] font-bold tracking-[0.05em] md:tracking-[0.2em] uppercase hover:bg-[#00FF9C]/20 transition-all rounded-sm relative overflow-hidden group"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00FF9C]/20 to-transparent -translate-x-full group-hover:animate-[slideRight_1s_ease-in-out_infinite]" />
        INICIAR NOVA OPERAÇÃO
      </button>
    </div>
  );
});
