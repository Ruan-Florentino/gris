'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, TrendingUp, Zap, Radio } from 'lucide-react';

const NEWS_ITEMS = [
  "BREAKING: UNIDENTIFIED MINERAL DEPOSIT DETECTED IN GREENLAND ICE SHEET",
  "MARKET UPDATE: RARE EARTH ELEMENT PRICES SURGE 12% AMID SUPPLY CONCERNS",
  "GEOPOLITICAL ALERT: NEW DRILLING PERMITS ISSUED IN DISPUTED ARCTIC WATERS",
  "TECH INTEL: QUANTUM SENSORS REVEAL SUBSURFACE ANOMALIES IN SAHARA DESERT",
  "ENVIRONMENTAL WATCH: TECTONIC ACTIVITY INCREASING IN PACIFIC RING OF FIRE",
  "LOGISTICS REPORT: AUTONOMOUS CARGO DRONES DEPLOYED TO CONGO BASIN",
  "CYBER SECURITY: ATTEMPTED BREACH ON GRIS DATA NODE 04 NEUTRALIZED",
  "AI FORECAST: 84% PROBABILITY OF NICKEL DISCOVERY IN NORTHERN SIBERIA",
  "PREDICTIVE ANALYSIS: RESOURCE SCARCITY INDEX PROJECTED TO RISE IN Q3",
  "NEURAL LINK: ESTABLISHING SECURE CONNECTION WITH ORBITAL NODE 07",
];

export default memo(function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [uplink, setUplink] = useState(99.9);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toUTCString());
      setUplink(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.min(100, Math.max(98, prev + change));
      });
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    const newsInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
    }, 6000);
    return () => {
      clearInterval(timeInterval);
      clearInterval(newsInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-5 md:h-8 bg-[#02040A]/90 backdrop-blur-md border-t border-[#00FF9C]/20 z-[100] flex items-center overflow-hidden font-mono">
      {/* Label */}
      <div className="flex items-center gap-1 md:gap-2 px-1.5 md:px-4 h-full bg-[#00FF9C]/10 border-r border-[#00FF9C]/20 text-[#00FF9C] text-[7px] md:text-[10px] font-black tracking-widest whitespace-nowrap">
        <Radio className="w-2 h-2 md:w-3 md:h-3 animate-pulse" />
        LIVE INTEL FEED
      </div>

      {/* Ticker Content */}
      <div className="flex-1 relative h-full flex items-center px-1.5 md:px-4 overflow-hidden">
        <div className="flex items-center gap-6 md:gap-12 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
          {NEWS_ITEMS.concat(NEWS_ITEMS).map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 md:gap-3 text-[7px] md:text-[10px] text-[#E8F0FF]/80 tracking-wide">
              <AlertCircle className="w-2 h-2 md:w-3 md:h-3 text-[#FFB800]" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* System Stats */}
      <div className="hidden md:flex items-center gap-6 px-6 h-full border-l border-[#00FF9C]/20 text-[8px] text-[#00FF9C]/40 tracking-[0.2em] uppercase">
        <div className="flex items-center gap-2">
          <Zap className="w-2.5 h-2.5" />
          UPLINK: {uplink.toFixed(1)}%
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-2.5 h-2.5" />
          VOLATILITY: {uplink > 99.5 ? 'LOW' : 'MODERATE'}
        </div>
        <div className="text-[#00FF9C]/60">
          {time || 'SYNCHRONIZING...'}
        </div>
      </div>
    </div>
  );
});
