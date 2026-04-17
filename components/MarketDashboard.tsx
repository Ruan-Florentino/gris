'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Globe, Zap, Database } from 'lucide-react';
import { ResourceType, RESOURCE_LABELS } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketItem {
  type: ResourceType;
  price: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  volatility: 'HIGH' | 'MEDIUM' | 'LOW';
  history: number[];
}

export default memo(function MarketDashboard() {
  const marketData: MarketItem[] = useMemo(() => {
    return [
      { type: 'lithium_triangle', price: 42500, change: 5.2, trend: 'up', volatility: 'HIGH', history: [40000, 41000, 40500, 41800, 42500] },
      { type: 'rare_earth', price: 128400, change: -2.1, trend: 'down', volatility: 'MEDIUM', history: [131000, 130500, 129000, 129500, 128400] },
      { type: 'oil_field', price: 84.50, change: 1.4, trend: 'up', volatility: 'LOW', history: [82.0, 83.5, 83.0, 84.1, 84.5] },
      { type: 'copper_belt', price: 9200, change: 0.8, trend: 'up', volatility: 'MEDIUM', history: [9000, 9150, 9100, 9180, 9200] },
      { type: 'gold_deposit', price: 2150, change: -0.3, trend: 'stable', volatility: 'LOW', history: [2160, 2155, 2158, 2152, 2150] },
      { type: 'gas_basin', price: 3.45, change: 12.5, trend: 'up', volatility: 'HIGH', history: [3.0, 3.1, 3.2, 3.3, 3.45] },
      { type: 'pre_salt', price: 72.20, change: -1.8, trend: 'down', volatility: 'MEDIUM', history: [74.0, 73.5, 73.8, 72.5, 72.2] },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-1 md:gap-4 p-1 md:p-4 font-mono">
      <div className="flex items-center justify-between mb-0.5 md:mb-2">
        <div className="flex items-center gap-1 md:gap-2 text-[#00E5FF]">
          <BarChart3 className="w-2 h-2 md:w-4 md:h-4" />
          <span className="text-[6px] md:text-xs font-bold tracking-[0.05em] md:tracking-[0.2em]">MERCADO GLOBAL DE RECURSOS</span>
        </div>
        <div className="text-[6px] md:text-[10px] text-[#00E5FF]/50 animate-pulse">FEED AO VIVO // SEGURO</div>
      </div>

      <div className="grid grid-cols-1 gap-1 md:gap-2">
        {marketData.map((item, idx) => (
          <motion.div
            key={item.type}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-[#081018]/60 border border-[#00E5FF]/20 p-1 md:p-3 rounded-sm hover:border-[#00E5FF]/50 transition-all overflow-hidden"
          >
            {/* Background progress bar for visual flair */}
            <div className="absolute bottom-0 left-0 h-[1px] bg-[#00E5FF]/30 w-full" />
            <div 
              className={`absolute bottom-0 left-0 h-[1px] transition-all duration-1000 ${
                item.trend === 'up' ? 'bg-[#00FF9C]' : item.trend === 'down' ? 'bg-[#FF3B3B]' : 'bg-[#00E5FF]'
              }`} 
              style={{ width: `${Math.abs(item.change * 5)}%` }} 
            />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex flex-col w-[40%] md:w-1/3">
                <span className="text-[6px] md:text-[10px] text-[#E8F0FF] font-bold tracking-wider truncate">{RESOURCE_LABELS[item.type]}</span>
                <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                  <span className={`text-[4px] md:text-[8px] px-1 py-0.5 rounded-xs ${
                    item.volatility === 'HIGH' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' :
                    item.volatility === 'MEDIUM' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                    'bg-[#00FF9C]/20 text-[#00FF9C]'
                  }`}>
                    {item.volatility === 'HIGH' ? 'ALTA' : item.volatility === 'MEDIUM' ? 'MÉDIA' : 'BAIXA'} VOL
                  </span>
                </div>
              </div>

              <div className="w-[25%] md:w-1/3 h-4 md:h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={item.history.map((val, i) => ({ name: i, value: val }))}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={item.trend === 'up' ? '#00FF9C' : item.trend === 'down' ? '#FF3B3B' : '#00E5FF'} 
                      strokeWidth={1} 
                      dot={false} 
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col items-end w-[35%] md:w-1/3">
                <div className="flex items-center gap-0.5 md:gap-1">
                  <DollarSign className="w-1.5 h-1.5 md:w-3 md:h-3 text-[#00E5FF]" />
                  <span className="text-[8px] md:text-sm font-black text-[#E8F0FF]">{item.price.toLocaleString()}</span>
                </div>
                <div className={`flex items-center gap-0.5 md:gap-1 text-[6px] md:text-[10px] font-bold ${
                  item.trend === 'up' ? 'text-[#00FF9C]' : item.trend === 'down' ? 'text-[#FF3B3B]' : 'text-[#00E5FF]/70'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="w-1.5 h-1.5 md:w-3 md:h-3" /> : 
                   item.trend === 'down' ? <TrendingDown className="w-1.5 h-1.5 md:w-3 md:h-3" /> : 
                   <Minus className="w-1.5 h-1.5 md:w-3 md:h-3" />}
                  {item.change > 0 ? '+' : ''}{item.change}%
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 md:mt-4 p-2 md:p-3 bg-[#00E5FF]/5 border border-[#00E5FF]/20 rounded-sm">
        <div className="text-[7px] md:text-[9px] text-[#00E5FF]/70 leading-relaxed">
          <span className="text-[#00FF9C] font-bold">INSIGHT DE MERCADO:</span> Interrupções na cadeia de suprimentos no setor de {RESOURCE_LABELS[marketData[0].type]} estão impulsionando o interesse especulativo. Projeções de rede neural sugerem volatilidade contínua pelas próximas 48 horas.
        </div>
      </div>
    </div>
  );
});
