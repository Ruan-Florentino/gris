'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Sparkles, Activity, ShieldAlert, Database, Terminal, ChevronRight, BrainCircuit, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ResourceData, RiskZone, ExportRoute } from '@/lib/data';

interface AIAnalystProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    resources: ResourceData[];
    riskZones: RiskZone[];
    exportRoutes: ExportRoute[];
    selectedResource?: ResourceData | null;
    cameraData?: { lat: number, lng: number, alt: number, heading: number, pitch: number };
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAnalyst({ isOpen, onClose, context }: AIAnalystProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "NÚCLEO NEURAL ATIVO. Monitoramento global sincronizado. Aguardando diretrizes estratégicas.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context, input })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || "Erro: Falha no uplink de inteligência. Por favor, tente novamente.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Analyst Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "ERRO CRÍTICO: Link neural de satélite interrompido. Reestabelecendo...",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, scale: 0.95 }}
          className="fixed inset-0 md:inset-auto md:top-[60px] md:right-[316px] md:bottom-24 w-full md:w-[460px] z-[70] flex flex-col pointer-events-auto"
        >
          <div className="flex-1 bg-[rgba(5,10,14,0.95)] backdrop-blur-2xl border border-[var(--gris-purple)] md:rounded-[4px] flex flex-col shadow-[-20px_0_50px_rgba(123,47,255,0.1)] overflow-hidden relative">
            
            {/* Ambient Purple Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--gris-purple)] opacity-10 blur-[100px] pointer-events-none rounded-full" />
            
            {/* HUD Corner Decorators */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--gris-purple)] transition-opacity duration-1000 ${isLoading ? 'opacity-100 animate-pulse' : 'opacity-50'}`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--gris-purple)] transition-opacity duration-1000 ${isLoading ? 'opacity-100 animate-pulse' : 'opacity-50'}`} />

            {/* Outline Gradient matching AI role Focus */}
            <div className={`absolute inset-0 border-[0.5px] rounded-[4px] pointer-events-none transition-colors duration-1000 ${isLoading ? 'border-[rgba(123,47,255,0.4)]' : 'border-transparent'}`} />

            {/* Header */}
            <div className="p-4 border-b border-[rgba(123,47,255,0.2)] bg-[rgba(123,47,255,0.05)] flex items-center justify-between relative z-10">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[linear-gradient(90deg,var(--gris-purple),transparent)]" />
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 border border-[var(--gris-purple)] bg-[rgba(123,47,255,0.1)] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[var(--gris-purple)] glow-purple" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--gris-emerald)] shadow-[0_0_8px_var(--gris-emerald)] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-[14px] font-oxanium font-bold text-white tracking-[0.2em] uppercase flex items-center gap-2">
                    GRIS-AI
                    <span className="px-1.5 py-0.5 bg-[var(--gris-purple)] text-black text-[9px] tracking-widest font-bold">AURA-9</span>
                  </h3>
                  <div className="text-[10px] text-[var(--gris-text-2)] font-mono uppercase tracking-widest mt-1">
                    {'> '} NÚCLEO NEURAL ATIVO
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--gris-text-2)] hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="relative flex-1 overflow-hidden">
              <div 
                ref={scrollRef}
                className="absolute inset-0 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar z-10"
              >
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} relative w-full`}>
                    <div className={`flex items-center gap-2 mb-1.5 text-[9px] font-oxanium font-bold uppercase tracking-[0.15em] ${msg.role === 'user' ? 'text-[var(--gris-text-2)] flex-row-reverse' : 'text-[var(--gris-purple)]'}`}>
                      {msg.role === 'user' ? 'OPERADOR' : 'GRIS-AI'} 
                      <span className="opacity-40 font-mono font-normal tracking-widest">[{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    </div>
                    <div className={`max-w-[85%] p-3 text-[13px] leading-relaxed tracking-wide font-inter ${
                      msg.role === 'user' 
                        ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--gris-text-1)]' 
                        : 'bg-[rgba(123,47,255,0.05)] border border-[rgba(123,47,255,0.2)] text-[var(--gris-text-1)] border-l-2 border-l-[var(--gris-purple)]'
                    }`}>
                      <div className="prose prose-invert prose-xs max-w-none markdown-body">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex flex-col items-start relative w-full">
                    <div className="flex items-center mb-1.5 text-[9px] font-oxanium font-bold uppercase tracking-[0.15em] text-[var(--gris-purple)]">
                      GRIS-AI
                    </div>
                    <div className="bg-[rgba(123,47,255,0.05)] border border-[rgba(123,47,255,0.2)] border-l-2 border-l-[var(--gris-purple)] p-3 flex items-center gap-2 w-24">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-3 bg-[var(--gris-purple)] animate-[ping_1s_infinite]" />
                        <div className="w-1.5 h-3 bg-[var(--gris-purple)] animate-[ping_1s_infinite_0.2s]" />
                        <div className="w-1.5 h-3 bg-[var(--gris-purple)] animate-[ping_1s_infinite_0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.5)] flex gap-2 overflow-x-auto custom-scrollbar z-10">
              <button 
                onClick={() => {
                  setInput("Briefing tático: Onde investir nos próximos 18 meses com base nos dados atuais?");
                  setTimeout(() => handleSend(), 0);
                }}
                className="whitespace-nowrap px-3 py-2 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.3)] text-[var(--gris-sky)] text-[9px] font-oxanium font-bold tracking-[0.1em] uppercase hover:bg-[rgba(56,189,248,0.2)] transition-all flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                ONDE INVESTIR
              </button>
              <button 
                onClick={() => {
                  setInput("Avaliação de Risco Geopolítico: Quais portfólios no mapa atual estão sob ameaça?");
                  setTimeout(() => handleSend(), 0);
                }}
                className="whitespace-nowrap px-3 py-2 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[var(--gris-red)] text-[9px] font-oxanium font-bold tracking-[0.1em] uppercase hover:bg-[rgba(239,68,68,0.2)] transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                VERIFICAR RISCO
              </button>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(10,14,24,0.9)] z-10 pb-8 md:pb-4">
              <div className="relative flex">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gris-purple)]">
                  <Terminal className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="SOLICITAR ANÁLISE..."
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--gris-border-subtle)] py-3.5 pl-9 pr-14 text-[12px] text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--gris-purple)] transition-all uppercase tracking-[0.05em] font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--gris-purple)] text-black hover:bg-white transition-all disabled:opacity-20 flex items-center justify-center shadow-[0_0_15px_rgba(123,47,255,0.5)]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
