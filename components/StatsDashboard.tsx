'use client';

import React, { memo, useMemo, useState, useEffect } from 'react';
import { BarChart2, PieChart, TrendingUp, Globe, Database, Activity, Crosshair, DollarSign, X } from 'lucide-react';
import { ResourceData, ResourceCategory } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RechartsPieChart, Pie, Sector } from 'recharts';
import MarketDashboard from './MarketDashboard';
import MissionControl from './MissionControl';

interface StatsDashboardProps {
  data: ResourceData[];
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'ANALYTICS' | 'MARKET' | 'MISSIONS';

export default memo(function StatsDashboard({ data, isOpen, onClose }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ANALYTICS');

  const [syncTime, setSyncTime] = useState<string>('');

  useEffect(() => {
    setSyncTime(new Date().toLocaleTimeString());
  }, []);

  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    const regions: Record<string, number> = {};
    let highThreatCount = 0;

    data.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
      regions[item.region] = (regions[item.region] || 0) + 1;
      if (item.threatLevel === 'CRITICAL') highThreatCount++;
    });

    const sortedRegions = Object.entries(regions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const categoryData = Object.entries(categories).map(([name, value]) => ({
      name: name.replace('_', ' '),
      value
    }));

    const regionData = sortedRegions.map(([name, value]) => ({
      name,
      value
    }));

    return { categories, sortedRegions, highThreatCount, total: data.length, categoryData, regionData };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--gris-surface)]/90 border border-[var(--gris-emerald)]/30 p-2 rounded-sm shadow-[0_0_15px_rgba(0,255,156,0.15)] font-mono text-[10px]">
          <p className="text-[var(--gris-emerald)] font-bold mb-1 uppercase">{label}</p>
          <p className="text-[var(--gris-text-primary)]">Contagem: <span className="text-[var(--gris-sky)] font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full md:w-[420px] z-50 bg-[var(--gris-surface)]/98 backdrop-blur-3xl border-l border-[var(--gris-emerald)]/30 p-1.5 md:p-8 font-mono pointer-events-auto shadow-[-50px_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,156,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30 pointer-events-none" />
          
          {/* Hardware Accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--gris-emerald)]/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--gris-emerald)]/20" />

          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,156,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col pt-4 md:pt-0">
            <div className="flex justify-between items-start mb-1.5 md:mb-8">
              <div className="flex items-center gap-1 md:gap-5">
                <div className="p-1 md:p-3 bg-[var(--gris-emerald)]/10 border border-[var(--gris-emerald)]/30 rounded-sm shadow-[0_0_15px_rgba(0,255,156,0.1)]">
                  {activeTab === 'ANALYTICS' && <BarChart2 className="w-2.5 h-2.5 md:w-6 md:h-6 text-[var(--gris-emerald)]" />}
                  {activeTab === 'MARKET' && <DollarSign className="w-2.5 h-2.5 md:w-6 md:h-6 text-[var(--gris-sky)]" />}
                  {activeTab === 'MISSIONS' && <Crosshair className="w-2.5 h-2.5 md:w-6 md:h-6 text-[var(--gris-amber)]" />}
                </div>
                <div>
                  <h2 className="text-[8px] md:text-lg font-black tracking-[0.05em] md:tracking-[0.4em] uppercase text-[var(--gris-text-primary)]">
                    {activeTab === 'ANALYTICS' ? 'ANÁLISE_DO_SISTEMA' : 
                     activeTab === 'MARKET' ? 'INTEL_DE_MERCADO' : 
                     'CONTROLE_DE_MISSÃO'}
                  </h2>
                  <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                    <div className="w-0.5 h-0.5 md:w-1.5 md:h-1.5 bg-[var(--gris-emerald)] rounded-full animate-pulse" />
                    <div className="text-[5px] md:text-[9px] text-[var(--gris-emerald)]/70 tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold">UPLINK_SEGURO</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 md:p-2.5 hover:bg-[var(--gris-red)]/10 text-[var(--gris-emerald)]/50 hover:text-[var(--gris-red)] transition-all border border-white/5 hover:border-[var(--gris-red)]/30 rounded-sm group"
              >
                <X className="w-3 h-3 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-0.5 md:gap-2 mb-1.5 md:mb-10 bg-white/2 p-0.5 md:p-1.5 rounded-sm border border-white/5">
              <TabButton active={activeTab === 'ANALYTICS'} onClick={() => setActiveTab('ANALYTICS')} label="ANÁLISES" icon={<BarChart2 />} />
              <TabButton active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')} label="MERCADO" icon={<DollarSign />} />
              <TabButton active={activeTab === 'MISSIONS'} onClick={() => setActiveTab('MISSIONS')} label="MISSÕES" icon={<Crosshair />} />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-4 space-y-3 md:space-y-12">
              {activeTab === 'ANALYTICS' && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-1 md:gap-5">
                    <StatCard label="TOTAL_DE_ATIVOS" value={stats.total} icon={<Database />} color="var(--gris-sky)" />
                    <StatCard label="AMEAÇAS_CRÍTICAS" value={stats.highThreatCount} icon={<Activity />} color="var(--gris-red)" />
                  </div>

                  {/* Resource Scarcity Index */}
                  <div className="bg-[var(--gris-emerald)]/5 border border-[var(--gris-emerald)]/20 p-1 md:p-5 rounded-sm relative overflow-hidden group transition-all hover:bg-[var(--gris-emerald)]/10">
                    <div className="absolute top-0 right-0 p-1 md:p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <TrendingUp className="w-2 h-2 md:w-5 md:h-5 text-[var(--gris-emerald)]" />
                    </div>
                    <div className="text-[5px] md:text-[10px] text-[var(--gris-emerald)] font-black tracking-[0.05em] md:tracking-[0.3em] uppercase mb-1 md:mb-4">DELTA_ÍNDICE_DE_ESCASSEZ</div>
                    <div className="flex items-end gap-0.5 md:gap-1.5 h-6 md:h-16 mb-1 md:mb-3">
                      {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95].map((h, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: i * 0.05 }}
                          className="flex-1 bg-[var(--gris-emerald)]/30 border-t border-[var(--gris-emerald)]/50 hover:bg-[var(--gris-emerald)] transition-all relative group/bar" 
                        >
                          <div className="absolute -top-2 md:-top-6 left-1/2 -translate-x-1/2 text-[4px] md:text-[8px] text-[var(--gris-emerald)] opacity-0 group-hover/bar:opacity-100 transition-opacity font-bold">{h}%</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[4px] md:text-[9px] text-[var(--gris-emerald)]/60 tracking-[0.05em] md:tracking-[0.2em] uppercase font-bold">
                      <span>PERÍODO: Q1-2026</span>
                      <span className="text-[var(--gris-red)] animate-pulse">DÉFICIT_CRÍTICO</span>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="space-y-1 md:space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="text-[5px] md:text-[10px] text-[var(--gris-emerald)] font-black tracking-[0.05em] md:tracking-[0.3em] uppercase flex items-center gap-1 md:gap-3">
                        <div className="w-1.5 md:w-6 h-[1px] bg-[var(--gris-emerald)]" />
                        DISTRIBUIÇÃO_DE_ATIVOS
                      </div>
                      <div className="text-[3px] md:text-[8px] text-white/20 tracking-widest">N=1.242</div>
                    </div>
                    <div className="h-24 md:h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={50} tick={{ fill: 'var(--gris-text-primary)', fontSize: 5, fontFamily: 'monospace', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 255, 156, 0.05)' }} />
                          <Bar dataKey="value" radius={[0, 2, 2, 0]} barSize={6}>
                            {stats.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--gris-sky)' : 'var(--gris-emerald)'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Regional Dominance */}
                  <div className="space-y-1 md:space-y-8 pb-1.5 md:pb-10">
                    <div className="text-[5px] md:text-[10px] text-[var(--gris-emerald)] font-black tracking-[0.05em] md:tracking-[0.3em] uppercase flex items-center gap-1 md:gap-3">
                      <div className="w-1.5 md:w-6 h-[1px] bg-[var(--gris-emerald)]" />
                      DOMINÂNCIA_REGIONAL
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-1 md:gap-8">
                      <div className="h-16 w-16 md:h-48 md:w-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={stats.regionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={10}
                              outerRadius={25}
                              paddingAngle={6}
                              dataKey="value"
                              stroke="none"
                            >
                              {stats.regionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['var(--gris-emerald)', 'var(--gris-sky)', 'var(--gris-amber)', 'var(--gris-red)', '#9D4EDD'][index % 5]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-0.5 md:space-y-3 w-full md:w-auto">
                        {stats.regionData.map((entry, index) => (
                          <div key={entry.name} className="flex items-center justify-between group/item">
                            <div className="flex items-center gap-1 md:gap-3">
                              <div className="w-1 h-1 md:w-2.5 md:h-2.5 rounded-sm" style={{ backgroundColor: ['var(--gris-emerald)', 'var(--gris-sky)', 'var(--gris-amber)', 'var(--gris-red)', '#9D4EDD'][index % 5] }} />
                              <span className="text-[5px] md:text-[10px] font-bold tracking-widest text-white/70 group-hover/item:text-white transition-colors uppercase truncate max-w-[100px] md:max-w-[100px]">{entry.name}</span>
                            </div>
                            <span className="text-[5px] md:text-[10px] font-black text-white/40">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'MARKET' && <MarketDashboard />}
              {activeTab === 'MISSIONS' && <MissionControl />}
            </div>

            {/* Footer Status */}
            <div className="mt-1.5 md:mt-8 pt-1.5 md:pt-6 border-t border-white/10 flex justify-between items-center text-[5px] md:text-[9px] text-white/30 tracking-[0.1em] md:tracking-[0.3em] uppercase font-bold">
              <div className="flex items-center gap-1 md:gap-3">
                <div className="w-0.5 h-0.5 md:w-2 md:h-2 rounded-full bg-[var(--gris-emerald)] animate-pulse shadow-[0_0_8px_var(--gris-emerald)]" />
                SISTEMA_NOMINAL
              </div>
              <div className="text-white/20">HORA_SYNC: {syncTime || '...'}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

function StatCard({ label, value, icon, color }: { label: string, value: number | string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-1 md:p-3 rounded-sm">
      <div className="text-[4px] md:text-[8px] text-white/40 tracking-widest mb-0.5 md:mb-2 flex items-center gap-0.5 md:gap-1.5">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-1.5 h-1.5 md:w-2.5 md:h-2.5', style: { color } })}
        {label}
      </div>
      <div className="text-xs md:text-xl font-bold tracking-tighter" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-0.5 md:gap-2 py-0.5 md:py-2 rounded-sm text-[5px] md:text-[9px] font-bold tracking-widest transition-all ${
        active 
          ? 'bg-[var(--gris-emerald)]/20 text-[var(--gris-emerald)] shadow-[0_0_10px_rgba(0,255,156,0.1)]' 
          : 'text-white/40 hover:text-white/60 hover:bg-white/5'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-1.5 h-1.5 md:w-3 md:h-3' })}
      {label}
    </button>
  );
}
