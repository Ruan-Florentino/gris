'use client';

import React, { useState, useEffect, memo } from 'react';
import { Activity, ShieldAlert, Zap, Globe, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface FeedItem {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'CRITICAL' | 'SYSTEM';
}

const INITIAL_MESSAGES: FeedItem[] = [
  { id: '1', timestamp: '01:24:12', message: 'SATELLITE UPLINK ESTABLISHED: NRO-72', type: 'SYSTEM' },
  { id: '2', timestamp: '01:25:05', message: 'ANOMALY DETECTED: SECTOR 7G (ARCTIC)', type: 'ALERT' },
  { id: '3', timestamp: '01:26:44', message: 'DEEP SEA SONAR: UNIDENTIFIED DEPOSIT DETECTED', type: 'INFO' },
  { id: '4', timestamp: '01:28:12', message: 'TECTONIC SHIFT: MAGNITUDE 4.2 - MARIANA TRENCH', type: 'CRITICAL' },
];

const MESSAGES_POOL = [
  { message: 'LITHIUM CONCENTRATION DETECTED: ANDES REGION', type: 'INFO' },
  { message: 'OFFSHORE DRILLING ACTIVITY DETECTED: GULF OF MEXICO', type: 'ALERT' },
  { message: 'GEOLOGICAL PROBABILITY UPDATE: SEDIMENTARY BASIN 12', type: 'SYSTEM' },
  { message: 'SIGNAL INTERFERENCE: SOLAR FLARE DETECTED', type: 'CRITICAL' },
  { message: 'DATA DECRYPTION COMPLETE: SECTOR 42', type: 'SYSTEM' },
  { message: 'NEW RESOURCE CLASSIFIED: RARE EARTH ELEMENTS', type: 'INFO' },
  { message: 'THERMAL ANOMALY DETECTED: ICELANDIC RIDGE', type: 'ALERT' },
];

export default memo(function IntelligenceFeed() {
  const [messages, setMessages] = useState<FeedItem[]>(INITIAL_MESSAGES);
  const [threatLevel, setThreatLevel] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = MESSAGES_POOL[Math.floor(Math.random() * MESSAGES_POOL.length)];
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newItem: FeedItem = {
        id: Date.now().toString(),
        timestamp,
        message: randomMsg.message,
        type: randomMsg.type as any,
      };

      setMessages(prev => [newItem, ...prev.slice(0, 5)]);
      setThreatLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#081018]/95 backdrop-blur-2xl border border-[#00E5FF]/40 rounded-sm p-1.5 md:p-5 font-mono text-[6px] md:text-[10px] w-full md:w-80 shadow-[0_0_50px_rgba(0,229,255,0.1)] relative overflow-hidden group">
      {/* Hardware Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 md:w-6 md:h-6 border-t-2 border-l-2 border-[#00E5FF]/40 rounded-tl-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 md:w-6 md:h-6 border-b-2 border-r-2 border-[#00E5FF]/40 rounded-br-sm" />

      {/* Scanning Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-30">
        <div className="w-full h-[1px] bg-[#00FF9C] shadow-[0_0_15px_#00FF9C] animate-[scan_3s_linear_infinite]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-1 md:mb-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 md:gap-2 text-[#00FF9C] font-black tracking-[0.05em] md:tracking-[0.3em] uppercase text-[6px] md:text-[10px]">
              <Activity className="w-1.5 h-1.5 md:w-4 md:h-4 animate-pulse" />
              INTEL_FEED
            </div>
            <div className="text-[3px] md:text-[8px] text-white/30 tracking-widest mt-0.5 uppercase">NODE_UPLINK_SECURE</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
              <div className="w-4 md:w-16 h-0.5 md:h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-[#FF3B3B] shadow-[0_0_8px_#FF3B3B]" 
                  animate={{ width: `${threatLevel}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-[4px] md:text-[9px] text-[#FF3B3B] font-black tracking-tighter">{threatLevel.toFixed(0)}%</span>
            </div>
            <div className="text-[3px] md:text-[7px] text-[#FF3B3B]/50 tracking-widest uppercase font-bold">THREAT_LEVEL</div>
          </div>
        </div>

        <div className="space-y-0.5 md:space-y-4 max-h-20 md:max-h-64 overflow-hidden relative">
          {/* Fade out bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-3 md:h-12 bg-gradient-to-t from-[#081018] to-transparent z-10" />
          
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.id} 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 - (idx * 0.15) }}
              className="flex gap-1 md:gap-4 border-l pl-1 md:pl-4 py-0.5 md:py-1 relative group/item transition-all hover:bg-white/2"
              style={{ 
                borderColor: msg.type === 'CRITICAL' ? '#FF3B3B' : 
                            msg.type === 'ALERT' ? '#FFB800' : 
                            msg.type === 'SYSTEM' ? '#00FF9C' : '#00E5FF',
              }}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-0.5 md:mb-1">
                  <div className="flex items-center gap-0.5 md:gap-2">
                    <span className="text-[#00E5FF]/40 text-[4px] md:text-[8px] font-bold tracking-widest">{msg.timestamp}</span>
                    <span className={`text-[4px] md:text-[8px] font-black tracking-[0.05em] md:tracking-[0.1em] uppercase px-0.5 md:px-1 rounded-sm ${
                      msg.type === 'CRITICAL' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' :
                      msg.type === 'ALERT' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                      msg.type === 'SYSTEM' ? 'bg-[#00FF9C]/20 text-[#00FF9C]' :
                      'bg-[#00E5FF]/20 text-[#00E5FF]'
                    }`}>
                      {msg.type}
                    </span>
                  </div>
                  {msg.type === 'CRITICAL' && (
                    <ShieldAlert className="w-1 h-1 md:w-3 md:h-3 text-[#FF3B3B] animate-pulse" />
                  )}
                </div>
                <span className={`text-[5px] md:text-[10px] leading-tight md:leading-relaxed tracking-wide transition-colors ${
                  msg.type === 'CRITICAL' ? 'text-[#FF3B3B] font-bold' : 'text-[#E8F0FF]/90'
                } group-hover/item:text-[#00FF9C]`}>
                  {msg.message}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-1 md:mt-6 pt-1 md:pt-4 border-t border-white/10 flex justify-between items-center text-[3px] md:text-[8px] text-white/30 tracking-[0.05em] md:tracking-[0.2em] uppercase">
          <div className="flex items-center gap-1 md:gap-3">
            <div className="flex items-center gap-0.5 md:gap-1.5">
              <Globe className="w-1 h-1 md:w-2.5 md:h-2.5 text-[#00FF9C]" />
              UPLINK: OK
            </div>
            <div className="flex items-center gap-0.5 md:gap-1.5">
              <Zap className="w-1 h-1 md:w-2.5 md:h-2.5 text-[#00E5FF]" />
              14MS
            </div>
          </div>
          <div className="text-white/20">GRIS_INTEL_V4</div>
        </div>
      </div>
    </div>
  );
});
